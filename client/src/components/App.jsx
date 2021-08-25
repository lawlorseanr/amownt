import React from 'react';
import Transactions from './Transactions.jsx';
import Accounts from './Accounts.jsx';
import Plaid from './PlaidLink.jsx';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      authenticate: true,
      transactionsPage: true,
      token: null,
    };

    this.handleAccess = this.handleAccess.bind(this);
  }

  handleAccess(token) {
    const { authenticate } = this.state;
    this.setState({
      authenticate: !authenticate,
      token,
    })
  }

  render() {
    let PAGE;
    if (this.state.authenticate) {
      PAGE = <Plaid handleAccess={this.handleAccess}/>
    } else if (this.state.transactionsPage) {
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