const router = require('express').Router();
const axios = require('axios');
const { User, Transaction } = require('../../database');

router
  .post('/set_snooze', (req, res) => {
    const { isActive, id } = req.body;
    Transaction.update({ isActive }, {  where: { id } })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(404).json(error));
  })
  .post('/get_transactions', (req, res) => {
    const { username } = req.body;
    Transaction.findAll({ where: { username }})
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(404).json(error);
      })
  })
  .post('/user', (req, res) => {
    const { username } = req.body;
    User.findAll({ where: { username } })
      .then((findResponse) => {
        if (findResponse.length === 0) {
          User.create({ username })
            .then((createResponse) => {
              res.status(201).json(createResponse);
            })
            .catch((error) => { throw error; })
        } else {
          res.status(200).json(findResponse[0].dataValues)
        }
      })
      .catch((error) => {
        res.status(404).json(error);
      })
  })
  .post('/set_transactions', (req, res) => {
    const { username } = req.body;
    let accounts;
    axios.post('http://localhost:8000/api/accounts', { username })
      .then((accountsResponse) => {
        accounts = accountsResponse.data.accounts.reduce((accumulator, account) => {
          accumulator[account.account_id] = account.name;
          return accumulator;
        }, {})
        return axios.post('http://localhost:8000/api/transactions', { username });
      })
      .then((transactionsResponse) => {
        return transactionsResponse.data.reduce((accumulator, item) => {
          const itemObj = {
            id: item.transaction_id,
            username,
            amount: item.amount,
            account: accounts[item.account_id],
            date: item.date,
            isActive: true,
            reconciled: false,
          }
          accumulator.push(itemObj);
          return accumulator;
        }, [])
      })
      .then((data) => {
        Transaction.bulkCreate(data)
          .then((createResponse) => {
            console.log('set transactions');
            console.log(createResponse);
            res.status(200).json(createResponse);
          })
          .catch((error) => res.status(404).json(error))
      })
      .catch((error) => {
        res.status(404).send(error);
      })
  })

module.exports = router;
