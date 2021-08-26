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
    this.reconcileAction = this.reconcileAction.bind(this);
  }

  fetchData() {
    const gif = document.getElementById('loading-gif');
    gif.style.opacity = 1;
    const { username } = this.state;
    axios.post('http://localhost:3000/api/get_transactions', { username })
      .then((response) => {
        const transactions = response.data;
        const sortFn = (a, b) => {
          if (a.date < b.date) {
            return -1;
          }
          if (a.date > b.date) {
            return 1;
          }
          return 0;
        }

        const sortedTransactions = transactions.sort(sortFn);

        this.setState({
          transactions: sortedTransactions,
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

  reconcileAction(reconciled) {
    const { id } = reconciled;
    const { transactions } = this.state;
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === id) {
        transaction = {...reconciled}
        axios.post('http://localhost:3000/api/set_reconciled', { transaction: reconciled })
      }
      return transaction;
    })
    this.setState({ transactions: updatedTransactions });
  }

  changeActiveState(id) {
    const { transactions } = this.state;
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === id) {
        transaction.isActive = !transaction.isActive
        axios.post('http://localhost:3000/api/set_snooze', {
          isActive: transaction.isActive, id
        })
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
            <label htmlFor='delay-toggle' className='switch'>
              <input
                id='delay-toggle'
                type='checkbox'
                onChange={() => this.changeActiveIsDisplayed()}
              />
              <span className='slider'>
                <div id='snooze'>Snoozed</div>
                <div id='active'>Active</div>
              </span>
            </label>
          </div>
        </div>
        <TransactionList
          state={this.state}
          changeActiveState={this.changeActiveState}
          reconcileAction={this.reconcileAction}/>
      </div>
    );
  }
};

export default Transactions;