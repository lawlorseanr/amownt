import React from 'react';
import TransactionList from './TransactionList.jsx';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      activeIsDisplayed: true,
    };
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
                console.log(e.target.options[e.target.selectedIndex].text)
              }}>
              <option value="active" default>Active</option>
              <option value="snoozed">Snoozed</option>
            </select>
          </div>
          <TransactionList transactions={[{id: 1, amount: 100}, {id: 2, amount: 200}]}/>
        </div>
      </div>

    );
  }
};

export default App;
