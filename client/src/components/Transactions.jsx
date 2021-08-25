import React from 'react';
import TransactionList from './Transactions/TransactionList.jsx';

class Transactions extends React.Component {
  constructor() {
    super();

    this.state = {
      transactionsPage: true,
      activeIsDisplayed: true,
      transactions: [
        {id: 1, amount: 100, account: 'Chase', date: '1/1/1000', isActive: true},
        {id: 2, amount: 200, account: 'Chase', date: '1/1/1000', isActive: true},
        {id: 3, amount: 300, account: 'Chase', date: '1/1/1000', isActive: false},
      ],
    }

    this.changeActiveIsDisplayed = this.changeActiveIsDisplayed.bind(this);
    this.changeActiveState = this.changeActiveState.bind(this);
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

  render() {
    return (
      <div id='transactions'>
        <div id='transactions-filter'>
          <h3>Transactions</h3>
          <label htmlFor='delay-toggle' className='switch'>
            <input
              id='delay-toggle'
              type='checkbox'
              onChange={(e) => this.changeActiveIsDisplayed()}
            />
            <span className='slider' />
          </label>
        </div>


        <TransactionList
          activeIsDisplayed={this.state.activeIsDisplayed}
          transactions={this.state.transactions}
          changeActiveState={this.changeActiveState}/>
      </div>
    );
  }
};

export default Transactions;