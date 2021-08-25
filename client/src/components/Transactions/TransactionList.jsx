import React from 'react';
import Transaction from './Transaction.jsx';

export default ({ state, changeActiveState }) => {
  const { activeIsDisplayed, transactions } = state;
  return (
    <div id='transaction-list'>
      {transactions.reduce((accumulator, transaction) => {
        if (transaction.isActive === activeIsDisplayed) {
          accumulator.push(<Transaction key={transaction.id} changeActiveState={changeActiveState} transaction={transaction}/>);
        }
        return accumulator;
      }, [])}
    </div>
  );
}