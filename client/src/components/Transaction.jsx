import React, { useState } from 'react';

export default ({ transaction }) => {
  const [isSnoozed, setSnoozed] = useState(false);

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
          value='Snooze'
          className='transaction-action'
          onClick={(e) => {
            e.preventDefault();
            setSnoozed(!isSnoozed);
          }}/>
        <input
          type='submit'
          value='Submit'
          className='transaction-action'/>
      </div>
    </div>
  )
};
