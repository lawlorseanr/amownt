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
      username: null,
    };

    this.handleAccess = this.handleAccess.bind(this);

    const username = prompt('Please enter your username :', 'sean');
    if (username !== null) {
      this.state.username = username
    }
  }

  handleAccess() {
    const { authenticate } = this.state;
    this.setState({
      authenticate: !authenticate,
    })
  }

  render() {
    let PAGE;
    if (this.state.authenticate) {
      PAGE = <Plaid handleAccess={this.handleAccess} username={this.state.username}/>
    } else if (this.state.transactionsPage) {
      PAGE = <Transactions username={this.state.username}/>
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