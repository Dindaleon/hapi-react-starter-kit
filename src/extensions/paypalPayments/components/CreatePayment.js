import React, { Component, PropTypes } from 'react';
import Theme from '../../../themes';

class CreatePayment extends Component {
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
    const { createPayment, user } = this.props;
    if ( this.state.amount < this.state.minimumAmount ) {
      return this.setState({ resultMessage: 'Amount must be greater than ' + this.state.minimumAmount });
    }
    createPayment(user, this.state.amount).then((action) => {
      if (!action.error) {
        this.setState({ resultMessage: 'You are now being redirected to Paypal to confirm your payment.' });
        window.location = action.result.data.approvalUrl;
      } else {
        this.setState({ resultMessage: 'Something went wrong.' });
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
          value={ this.state.amount }
          placeholder="$100" />
        <Theme render="Button" onClick={ this.createPayment } >Create Payment</Theme>
        { this.state.resultMessage }
      </div>
    );
  }
}

CreatePayment.propTypes = {
  createPayment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default CreatePayment;
