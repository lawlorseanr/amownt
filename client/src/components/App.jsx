import React from 'react';
import Transactions from './Transactions.jsx';
import Reconciled from './Reconciled.jsx';
import Plaid from './PlaidLink.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      authenticate: null,
      page: 'transactions',
      username: null,
      checkedUser: false,
    };

    this.handleAccess = this.handleAccess.bind(this);

    const username = prompt('Please enter your username:', 'sean');
    if (username !== null) {
      this.state.username = username;
    } else {
      this.state.username = 'user';
    }

    this.checkUser(this.state.username);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(page) {
    this.setState({ page });
  }

  checkUser(username) {
    axios.post('http://localhost:3000/api/user', { username })
      .then((response) => {
        const authenticate = response.status === 201
        const checkedUser = true;
        this.setState({ authenticate, checkedUser })
      })
      .catch((error) => console.error(error));
  }

  handleAccess() {
    const { authenticate } = this.state;
    this.setState({
      authenticate: !authenticate,
    })
  }

  render() {
    let PAGE;
    if (!this.state.checkedUser) {
      PAGE = <></>;
    } else if (this.state.authenticate) {
      PAGE = <Plaid handleAccess={this.handleAccess} username={this.state.username}/>
    } else {
      if (this.state.page === 'transactions') {
        PAGE = <Transactions handlePageChange={this.handlePageChange} username={this.state.username}/>
      } else if (this.state.page === 'reconciled') {
        PAGE = <Reconciled handlePageChange={this.handlePageChange} username={this.state.username}/>
      }
    }

    return (
      <div id='app'>
        <div id='header'>
          <div id='header-title'>
            <h1 id='header-text'>Amownt</h1>
            <h4 id='header-subtext'>own your accounting</h4>
          </div>
          <div id='header-user'>
            <h3>user: {this.state.username}</h3>
          </div>
        </div>
        {PAGE}
      </div>
    );
  }
};

export default App;