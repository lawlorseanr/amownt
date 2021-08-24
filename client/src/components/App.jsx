import React from 'react';
import TransactionList from './TransactionList.jsx';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      activeIsDisplayed: true,
      transactions: [
        {id: 1, amount: 100, isActive: true},
        {id: 2, amount: 200, isActive: true},
        {id: 3, amount: 300, isActive: false},
      ],
    };

    this.changeActiveIsDisplayed = this.changeActiveIsDisplayed.bind(this);
    this.changeActiveState = this.changeActiveState.bind(this);
  }

  changeActiveIsDisplayed(activeIsDisplayed) {
    this.setState({ activeIsDisplayed }, () => console.log(this.state));
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
      <div id='app'>
        <h1 id='header'>Amownt</h1>
        <div id='transactions'>
          <h3>Transactions</h3>
          <div id='transactions-filter'>
          <label htmlFor="view">Selected Transactions:</label>
            <select
              name="view"
              id="view"
              onChange={(e) => {
                e.preventDefault();
                console.log(e.target.options[e.target.selectedIndex].text);
                this.changeActiveIsDisplayed(e.target.options[e.target.selectedIndex].text.toLowerCase() === 'active')
              }}>
              <option value="active" default>Active</option>
              <option value="snoozed">Snoozed</option>
            </select>
          </div>
          <TransactionList
            activeIsDisplayed={this.state.activeIsDisplayed}
            transactions={this.state.transactions}
            changeActiveState={this.changeActiveState}/>
        </div>
      </div>

    );
  }
};

export default App;
