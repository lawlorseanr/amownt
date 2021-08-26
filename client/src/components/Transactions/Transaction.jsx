import React, { useState } from 'react';
import moment from 'moment';

export default ({ transaction, changeActiveState, reconcileAction }) => {
  const [who, setWho] = useState(transaction.merchant);
  const [what, setWhat] = useState(transaction.name);
  const [why, setWhy] = useState(transaction.description);

  return (
    <div className='transaction'>
      <div className='transaction-info'>
        <label className='transaction-label'>
          <span className='transaction-label-text'>Merchant:</span>
          <input
            type='text'
            name='transaction-who'
            className='transaction-input'
            value={who || ''}
            onChange={(e) => setWho(e.target.value)}
          />
        </label>
        <label className='transaction-label'>
        <span className='transaction-label-text'>Detail:</span>
          <input
            type='text'
            name='transaction-what'
            className='transaction-input'
            value={what || ''}
            onChange={(e) => setWhat(e.target.value)}
          />
        </label>
        <label className='transaction-label'>
        <span className='transaction-label-text'>Description:</span>
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
        <span className='transaction-amount'>Amount: ${transaction.amount.toFixed(2)}</span>
        <span className='transaction-date'>Date: {moment(transaction.date).format('LL')}</span>
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
            value='Reconcile'
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
