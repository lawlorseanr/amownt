import React from 'react';
import Transaction from './Transaction.jsx';

export default ({ state, changeActiveState, reconcileAction }) => {
  const { activeIsDisplayed, transactions } = state;
  return (
    <div id='transaction-list'>
      {transactions.reduce((accumulator, transaction) => {
        if (transaction.isActive === activeIsDisplayed && !transaction.reconciled) {
          accumulator.push(<Transaction key={transaction.id} reconcileAction={reconcileAction} changeActiveState={changeActiveState} transaction={transaction}/>);
        }
        return accumulator;
      }, [])}
    </div>
  );
}