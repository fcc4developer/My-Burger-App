import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredients)
    .map(igKey => {
      return <li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}</li>
    });
  return (
    <Aux>
      <h3>Your order</h3>
      <p>A delicious buger with the following ingrediens:</p>
      <ul>
        {ingredientSummary}
      </ul>
      <h2>Total Price: <strong>{props.price.toFixed(2)}</strong></h2>
      <p>Continue to Checkout?</p>
      <Button
       btnType='Danger'
       clicked={props.cancelPurchase}
      >CANCEL</Button>
      <Button
       btnType='Success'
       clicked={props.continuePurchase}
      >CONTINUE</Button>
    </Aux>
  )
}

export default orderSummary;