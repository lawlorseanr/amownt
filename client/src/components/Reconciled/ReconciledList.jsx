import React from 'react';
import Reconcile from './Reconcile.jsx';

export default ({ reconciled }) => {

  if (reconciled) {
    return (
      <div id='transaction-list'>
        {reconciled.reduce((accumulator, reconcile) => {
          if (reconcile.reconciled) {
            accumulator.push(<Reconcile key={reconcile.id} reconcile={reconcile}/>);
          }
          return accumulator;
        }, [])}
      </div>
    );
  }
  return <div id='transaction-list'></div>

}