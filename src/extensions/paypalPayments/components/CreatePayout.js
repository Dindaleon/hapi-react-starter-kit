import React, { Component, PropTypes } from 'react';
import Theme from '../../../themes';

export default class CreatePayout extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      amount: 10,
      minimumAmount: 5,
      resultMessage: ''
    };
  }
  handleAmountOnChange = event => {
    this.setState({ amount: event.target.value });
  };

  createPayment = () => {
    const { createPayout, user } = this.props;
    if ( this.state.amount < this.state.minimumAmount ) {
      return this.setState({ resultMessage: 'Amount must be greater than ' + this.state.minimumAmount });
    }
    createPayout(user, this.state.amount).then((action) => {
      if (!action.error && action.result.data.status === 'completed') {
        this.setState({ resultMessage: 'Your Paypal Account has been accredited.' });
      } else if (!action.error && action.result.data.status === 'unclaimed') {
        this.setState({ resultMessage: 'Your request could not be completed because your email is not registered at Paypal' });
      } else if (!action.error && action.result.data.status === 'insufficient funds') {
        this.setState({ resultMessage: 'Your account does not have enough funds to complete the transaction.' });
      } else {
        this.setState({ resultMessage: 'Something went wrong while processing payout.' });
      }
    });
  };

  render() {
    return (
      <div>
        <Theme render="TextField"
          onChange={ this.handleAmountOnChange }
          type="number" min={ this.state.minimumAmount }
          step="1"
          value={ this.state.amount } />
        <Theme render="Button" onClick={ this.createPayment }>Request Payout</Theme>
        { this.state.resultMessage }
      </div>
    );
  }
}

CreatePayout.propTypes = {
  createPayout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
