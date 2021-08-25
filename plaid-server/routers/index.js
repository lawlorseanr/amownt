// Using Express
const router = require('express').Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const util = require('util');
const CONFIG = require('../config/config');

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};

let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
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
  .get('/accounts', async (request, response) => {
    try {
      const accountsResponse = await client.accountsGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(accountsResponse);
      response.status(200).json(accountsResponse.data);
    } catch (error) {
      prettyPrintResponse(error);
      return response.status(404).json(formatError(error.response));
    }
  })
  .get('/transactions', async (request, response) => {
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
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'user-id',
      },
      client_name: 'Plaid Quickstart',
      products: CONFIG.PLAID_PRODUCTS,
      country_codes: CONFIG.PLAID_COUNTRY_CODES,
      language: 'en',
    };

    configs.redirect_uri = CONFIG.PLAID_REDIRECT_URI;

    try {
      const createTokenResponse = await client.linkTokenCreate(configs);
      prettyPrintResponse(createTokenResponse);
      response.json(createTokenResponse.data);
    } catch (error) {
      prettyPrintResponse(error.response);
      return response.json(formatError(error.response));
    }
  })
  .post('/set_access_token', async (request, response, next) => {
    PUBLIC_TOKEN = request.body.public_token;
    try {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: PUBLIC_TOKEN,
      });
      prettyPrintResponse(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;
      const responseObj = {
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      }
      response.status(200).json(responseObj);
    } catch (error) {
      prettyPrintResponse(error.response);
      return response.status(404).json(formatError(error.response));
    }
  });

  module.exports = router;