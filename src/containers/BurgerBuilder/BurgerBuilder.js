import React, { Component } from 'react';

import axios from '../../axios-orders';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BurgerControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENTS_PRICES = {
  salad: 0.3,
  cheese: 0.6,
  bacon: 0.9,
  meat: 1.4
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    // console.log(this.props)
    axios.get('https://react-burger-app-55a2f.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data});
    })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients) // [salad, meat, bacon, cheese]
      .map(igKey => {
        return ingredients[igKey] // [0, 2, 4, 1]
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 })
  }

  addIngredientsHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;

    const priceAdditions = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAdditions;

    this.setState({
      ingredients: updatedIngredients, totalPrice: newPrice
    });

    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientsHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;

    const priceDeductions = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeductions;

    this.setState({
      ingredients: updatedIngredients, totalPrice: newPrice
    });

    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    let queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice.toFixed(2));
    const queryString = queryParams.join('&');

    this.props.history.push({
      pathname: '/checkout',
      search: '?'  + queryString
    });
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    // {salad: true, meat: false}

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BurgerControls
            disabledCtrl={disabledInfo}
            ingredientAdded={this.addIngredientsHandler}
            ingredientRemoved={this.removeIngredientsHandler}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
          />
        </Aux>
      );
      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        cancelPurchase={this.purchaseCancelHandler}
        continuePurchase={this.purchaseContinueHandler}
      />
    }
      return (
        <Aux>
          <Modal
            show={this.state.purchasing}
            closeModel={this.purchaseCancelHandler}
            loading={!this.state.loading}
            >
            {orderSummary}
          </Modal>
            {burger}
        </Aux>
      );
  }
}

export default withErrorHandler(BurgerBuilder, axios);