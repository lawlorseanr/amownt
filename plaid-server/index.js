const express = require('express');
const cors = require('cors');
const path = require('path');
const plaidRouter = require('./routers');
const { APP_PORT, APP_HOST } = require('./config/config');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', plaidRouter)

app.listen(APP_PORT, APP_HOST, () => console.log(`Litening on http://${APP_HOST}:${APP_PORT}`));
