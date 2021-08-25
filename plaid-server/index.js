const express = require('express');
const cors = require('cors');
const path = require('path');
const plaidRouter = require('./plaidRouter');

const HOST = 'localhost';
const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', plaidRouter)

app.listen(PORT, HOST, () => console.log(`Litening on http://${HOST}:${PORT}`));
