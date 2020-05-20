import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BurgerControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    // console.log(this.props)
    // axios.get('https://react-burger-app-55a2f.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ ingredients: response.data});
    // })
    //   .catch(error => {
    //     this.setState({ error: true });
    //   });
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients) // [salad, meat, bacon, cheese]
      .map(igKey => {
        return ingredients[igKey] // [0, 2, 4, 1]
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    // {salad: true, meat: false}

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BurgerControls
            disabledCtrl={disabledInfo}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemove}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price}
          />
        </Aux>
      );
      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
      orderSummary = <OrderSummary
        ingredients={this.props.ings}
        price={this.props.price}
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

const mapStateToProps = state => {
  return {
      ings: state.ingredients,
      price: state.totalPrice
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
      onIngredientRemove: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));