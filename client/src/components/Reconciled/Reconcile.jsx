import React, { useState } from 'react';
import moment from 'moment';

export default ({ reconcile }) => {
  console.log(reconcile);
  return (
    <div className='transaction'>
      <div className='transaction-info'>
        <label className='transaction-label'>
          <span className='transaction-label-text'>Merchant:</span>
          <span className='transaction-merchant'>{reconcile.merchant}</span>
        </label>
        <label className='transaction-label'>
          <span className='transaction-label-text'>Detail:</span>
          <span className='transaction-name'>{reconcile.name}</span>
        </label>
        <label className='transaction-label'>
          <span className='transaction-label-text'>Description:</span>
          <span className='transaction-description'>{reconcile.description}</span>
        </label>
      </div>
      <div className='transaction-action'>
        <span className='transaction-amount'>Amount: ${reconcile.amount.toFixed(2)}</span>
        <span className='transaction-date'>Date: {moment(reconcile.date).format('LL')}</span>
        <span className='transaction-account'>Account: {reconcile.account}</span>
      </div>
    </div>
  )
};
