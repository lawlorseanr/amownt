// Using Express
const router = require('express').Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const util = require('util');
const CONFIG = require('../config/config');
const { User, Transaction } = require('../../database');

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};

let ITEM_ID = null;

const configuration = new Configuration({
  basePath: PlaidEnvironments[CONFIG.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': CONFIG.PLAID_CLIENT_ID,
      'PLAID-SECRET': CONFIG.PLAID_SECRET,
      'Plaid-Version': CONFIG.PLAID_VERSION,
    },
  },
});

const client = new PlaidApi(configuration);

router
  .post('/accounts', async (request, response) => {
    const { username } = request.body;
    const queryData = await User.findAll({
      attributes: ['access_token'],
      where: { username }
    });
    const ACCESS_TOKEN = queryData[0].dataValues.access_token;

    try {
      const accountsResponse = await client.accountsGet({
        access_token: ACCESS_TOKEN,
      });
      response.status(200).json(accountsResponse.data);
    } catch (error) {
      prettyPrintResponse(error);
      return response.status(404).json(formatError(error.response));
    }
  })
  .post('/transactions', async (request, response) => {
    const { username } = request.body;
    const queryData = await User.findAll({
      attributes: ['access_token'],
      where: { username }
    });
    const ACCESS_TOKEN = queryData[0].dataValues.access_token;

    const plaidRequest = {
      access_token: ACCESS_TOKEN,
      start_date: '2018-01-01',
      end_date: '2020-02-01'
    };
    try {
      const plaidResponse = await client.transactionsGet(plaidRequest);
      let transactions = plaidResponse.data.transactions;
      const total_transactions = plaidResponse.data.total_transactions;

      // Manipulate the offset parameter to paginate
      // transactions and retrieve all available data
      while (transactions.length < total_transactions) {
        const paginatedRequest = {
          access_token: ACCESS_TOKEN,
          start_date: '2018-01-01',
          end_date: '2020-02-01',
          options: {
            offset: transactions.length,
          },
        };
        const paginatedResponse = await client.transactionsGet(paginatedRequest);
        transactions = transactions.concat(
          paginatedResponse.data.transactions,
        );
      }
      response.status(200).json(transactions);
    } catch(err) {
      response.status(404).send(err);
    }
  })
  .get('/get_access_token', (request, response) => {
    const responseObj = {
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    }
    response.status(200).json(responseObj)
  })
  .post('/create_link_token', async (request, response) => {
    const { username } = request.body;
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: username,
      },
      client_name: 'Plaid Quickstart',
      products: CONFIG.PLAID_PRODUCTS,
      country_codes: CONFIG.PLAID_COUNTRY_CODES,
      language: 'en',
    };

    configs.redirect_uri = CONFIG.PLAID_REDIRECT_URI;

    try {
      const createTokenResponse = await client.linkTokenCreate(configs);
      const { link_token, expiration } = createTokenResponse.data;
      User.update({ link_token, expiration }, {  where: { username } })
        .then(() => {
          prettyPrintResponse(createTokenResponse);
          response.json(link_token);
        })
        .catch((error) => {
          response.status(404).send(error)
        });

    } catch (error) {
      prettyPrintResponse(error.response);
      return response.json(formatError(error.response));
    }
  })
  .post('/set_access_token', async (request, response, next) => {
    const { username, public_token } = request.body;
    try {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token,
      });
      const access_token = tokenResponse.data.access_token;
      User.update({ public_token, access_token },
        { where: { username } })
        .then((updateResponse) => {
          response.status(200).json(updateResponse);
        })
        .catch((error) => {
          response.status(404).send(error);
        })
    } catch (error) {
      prettyPrintResponse(error);
      return response.status(404).json(formatError(error));
    }
  });

  module.exports = router;