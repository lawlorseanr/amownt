import React from 'react';
import Transactions from './Transactions.jsx';
import Accounts from './Accounts.jsx';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      transactionsPage: true,
    };
  }

  render() {
    let PAGE;
    if (this.state.transactionsPage) {
      PAGE = <Transactions />
    } else {
      PAGE = <Accounts />
    }

    return (
      <div id='app'>
        <div id='header'>
          <h1 id='header-text'>Amownt</h1>
        </div>
        {PAGE}
      </div>
    );
  }
};

export default App;