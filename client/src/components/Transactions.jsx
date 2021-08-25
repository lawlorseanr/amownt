import React from 'react';
import TransactionList from './Transactions/TransactionList.jsx';
import axios from 'axios';

class Transactions extends React.Component {
  constructor() {
    super();

    this.state = {
      transactionsPage: true,
      activeIsDisplayed: true,
      transactions: [],
      fetchAttempt: 0,
    }

    this.changeActiveIsDisplayed = this.changeActiveIsDisplayed.bind(this);
    this.changeActiveState = this.changeActiveState.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    axios.get('http://localhost:3000/api/transactions')
      .then((response) => {
        this.setState({
          transactions: response.data,
        })
      })
      .catch((error) => {
        console.error(error);
      })
  }

  changeActiveIsDisplayed() {
    const { activeIsDisplayed } = this.state;
    this.setState({ activeIsDisplayed: !activeIsDisplayed });
  }

  changeActiveState(id) {
    const { transactions } = this.state;
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === id) {
        transaction.isActive = !transaction.isActive
      }
      return transaction;
    })
    this.setState({ transactions: updatedTransactions });
  }

  componentDidMount() {
    setTimeout(this.fetchData, 3500);
  }

  render() {
    return (
      <div id='transactions'>
        <div id='transactions-filter'>
          <h3>Reconciliation</h3>
          <div id='transaction-list-action'>
            <button
              id='fetch-data-button'
              type='Submit'
              onClick={(e) => {
                e.preventDefault();
                this.fetchData();
              }}>
            Fetch Data
            </button>
            <label htmlFor='delay-toggle' className='switch'>
              <input
                id='delay-toggle'
                type='checkbox'
                onChange={() => this.changeActiveIsDisplayed()}
              />
              <span className='slider' />
            </label>
          </div>
        </div>
        <TransactionList
          state={this.state}
          changeActiveState={this.changeActiveState}/>
      </div>
    );
  }
};

export default Transactions;