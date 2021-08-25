import React, { useState } from 'react';

export default ({ transaction, changeActiveState }) => {
  return (
    <div className='transaction'>
      <div className='transaction-info'>
        <label className='transaction-label'>
          Who:
          <input type='text' name='transaction-who' className='transaction-input' />
        </label>
        <label className='transaction-label'>
          What:
          <input type='text' name='transaction-what' className='transaction-input' />
        </label>
        <label className='transaction-label'>
          Why:
          <input type='text' name='transaction-why' className='transaction-input' />
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
            className='transaction-action transaction-submit'/>
        </div>
      </div>
    </div>
  )
};
