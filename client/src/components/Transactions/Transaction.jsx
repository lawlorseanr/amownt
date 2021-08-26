import React, { useState } from 'react';

export default ({ transaction, changeActiveState, reconcileAction }) => {
  const [who, setWho] = useState(transaction.merchant);
  const [what, setWhat] = useState(transaction.name);
  const [why, setWhy] = useState(transaction.description);

  return (
    <div className='transaction'>
      <div className='transaction-info'>
        <label className='transaction-label'>
          Who:
          <input
            type='text'
            name='transaction-who'
            className='transaction-input'
            value={who || ''}
            onChange={(e) => setWho(e.target.value)}
          />
        </label>
        <label className='transaction-label'>
          What:
          <input
            type='text'
            name='transaction-what'
            className='transaction-input'
            value={what || ''}
            onChange={(e) => setWhat(e.target.value)}
          />
        </label>
        <label className='transaction-label'>
          Why:
          <input
            type='text'
            name='transaction-why'
            className='transaction-input'
            value={why || ''}
            onChange={(e) => setWhy(e.target.value)}
          />
        </label>
      </div>
      <div className='transaction-action'>
        <span className='transaction-amount'>Amount: {transaction.amount}</span>
        <span className='transaction-date'>Date: {transaction.date}</span>
        <span className='transaction-account'>Account: {transaction.account}</span>
        <div className='transaction-action-buttons'>
          <input
            type='submit'
            value={transaction.isActive ? 'Snooze' : 'Un-snooze'}
            className='transaction-action transaction-snooze'
            onClick={(e) => {
              e.preventDefault();
              changeActiveState(transaction.id);
            }}/>
          <input
            type='submit'
            value='Submit'
            className='transaction-action transaction-submit'
            onClick={(e) => {
              e.preventDefault();
              transaction.reconciled = true;
              transaction.merchant = who;
              transaction.name = what;
              transaction.description = why;
              reconcileAction(transaction);
            }}/>
        </div>
      </div>
    </div>
  )
};
