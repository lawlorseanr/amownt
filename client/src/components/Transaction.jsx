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
        <div className='transaction-amount'>Amount: {transaction.amount}</div>
        <input
          type='submit'
          value={transaction.isActive ? 'Snooze' : 'Un-snooze'}
          className='transaction-action'
          onClick={(e) => {
            e.preventDefault();
            changeActiveState(transaction.id);
          }}/>
        <input
          type='submit'
          value='Submit'
          className='transaction-action'/>
      </div>
    </div>
  )
};
