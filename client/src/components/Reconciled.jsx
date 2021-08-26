import React from 'react';
import ReconciledList from './Reconciled/ReconciledList.jsx';
import axios from 'axios';

class Reconciled extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reconciled: [],
      username: props.username,
    }

    this.fetchData = this.fetchData.bind(this);
    this.handlePageChange = props.handlePageChange;
  }

  fetchData() {
    // const gif = document.getElementById('loading-gif');
    // gif.style.opacity = 1;
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
          reconciled: sortedTransactions,
        })
      })
      .catch((error) => {
        console.error(error);
      })
      // .finally(() => gif.style.opacity = 0);
  }

  componentDidMount() {
    // document.getElementById('loading-gif').style.opacity = 1;
    this.fetchData();
  }

  render() {
    console.log(this.state);
    return (
      <div id='transactions'>
        <div id='page-switch'>
          <h3 className='pages' onClick={() => this.handlePageChange('transactions')}>Reconciliation</h3>
          <h3>&nbsp;&nbsp;&nbsp;{'|'}&nbsp;&nbsp;&nbsp;</h3>
          <h3 className='pages' onClick={() => this.handlePageChange('reconciled')}>Transactions</h3>
        </div>
        <ReconciledList reconciled={this.state.reconciled}/>
      </div>
    );
  }
};

export default Reconciled;