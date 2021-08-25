const router = require('express').Router();
const axios = require('axios');

router
  .get('/', (req, res, next) => res.status(200).send('Wingardium leviosa!'))
  .get('/transactions', (req, res) => {

    let accounts;
    axios.get('http://localhost:8000/api/accounts')
      .then((response) => {
        accounts = response.data.accounts.reduce((accumulator, account) => {
          accumulator[account.account_id] = account.name;
          return accumulator;
        }, {})
        return axios.get('http://localhost:8000/api/transactions');
      })
      .then((response) => {
        const data = response.data.reduce((accumulator, item) => {
          const itemObj = {
            id: item.transaction_id,
            amount: item.amount,
            account: accounts[item.account_id],
            date: item.date,
            isActive: true,
          }
          accumulator.push(itemObj);
          return accumulator;
        }, [])
        res.status(200).send(data);
      })
      .catch((error) => {
        res.status(404).send(error);
      })
  })

module.exports = router;
