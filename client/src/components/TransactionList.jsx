import React from 'react';
import Transaction from './Transaction.jsx';

export default ({ transactions }) => {
  return (
    <div id='transaction-list'>
      {transactions.map((transaction) => <Transaction key={transaction.id} transaction={transaction}/>)}
    </div>
  );
}