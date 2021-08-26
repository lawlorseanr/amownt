import React from 'react';
import TransactionList from './Transactions/TransactionList.jsx';
import axios from 'axios';

class Transactions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactionsPage: true,
      activeIsDisplayed: true,
      transactions: [],
      fetchAttempt: 0,
      username: props.username,
    }

    this.changeActiveIsDisplayed = this.changeActiveIsDisplayed.bind(this);
    this.changeActiveState = this.changeActiveState.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    const gif = document.getElementById('loading-gif');
    gif.style.opacity = 1;
    const { username } = this.state;
    axios.post('http://localhost:3000/api/get_transactions', { username })
      .then((response) => {
        this.setState({
          transactions: response.data,
        })
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => gif.style.opacity = 0);
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
    document.getElementById('loading-gif').style.opacity = 1;
    this.fetchData();
  }

  render() {
    return (
      <div id='transactions'>
        <div id='transactions-filter'>
          <h3>Reconciliation</h3>
          <div id='transaction-list-action'>
            <img id='loading-gif' src="./images/spiffygif_46x46.gif" alt='Spinner' />
            {/* <button
              id='fetch-data-button'
              type='Submit'
              onClick={(e) => {
                e.preventDefault();
                this.fetchData();
              }}>
            Fetch Data
            </button> */}
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