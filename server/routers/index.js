const Router = require('express').Router();

Router
  .get('/', (req, res) => res.status(200).send('Wingardium leviosa!'));

module.exports = Router;
