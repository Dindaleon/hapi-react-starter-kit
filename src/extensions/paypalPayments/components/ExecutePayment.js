import React, { Component, PropTypes } from 'react';
import Theme from '../../../themes';

// TODO translate
export default class ExecutePayment extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      amountToBeAccredited: 0,
      paymentStatus: 'pending',
      resultMessage: ''
    };
  }
  executePayment = () => {
    const {
      executePayment,
      payerID,
      paymentId,
      user
    } = this.props;
    executePayment(user, paymentId, payerID).then((action) => {
      if (!action.error && action.result.data.status === 'approved') {
        // Once the payment has been executed
        // and user account accredited, proceed.
        this.setState({
          paymentStatus: action.result.data.status,
          resultMessage: 'Your account has been accredited.'
        });
      } else if (action.error === 400)  {
        this.setState({
          resultMessage: 'The payment has already been processed.'
        });
      } else if (action.error === 404)  {
        this.setState({
          resultMessage: 'The payment could not be executed, it does not exist.'
        });
      } else {
        this.setState({
          resultMessage: 'Something went wrong, the payment could not be executed.'
        });
      }
    });
  };

  render() {
    const { params } = this.props;
    return (
      <div>
        Payment status: { this.state.paymentStatus }
        <br />
        Your account will be accredited with the following amount: { params.amount }
        <br />
        <Theme render="Button" onClick={ this.executePayment }>Execute Payment</Theme>
        <br />
        { this.state.resultMessage }
      </div>
    );
  }
}

ExecutePayment.propTypes = {
  executePayment: PropTypes.func.isRequired,
  params: PropTypes.object,
  payerID: PropTypes.string,
  paymentId: PropTypes.string,
  user: PropTypes.object.isRequired
};
