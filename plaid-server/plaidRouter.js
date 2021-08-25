// Using Express
const router = require('express').Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const util = require('util');
const CONFIG = require('./config/config');

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
  .post('/create_link_token', async function (request, response) {
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
  .post('/set_access_token', async function (request, response, next) {
    PUBLIC_TOKEN = request.body.public_token;
    try {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: PUBLIC_TOKEN,
      });
      prettyPrintResponse(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;
      response.json({
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      });
    } catch (error) {
      prettyPrintResponse(error.response);
      return response.json(formatError(error.response));
    }
  });

  module.exports = router;