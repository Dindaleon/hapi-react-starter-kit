import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import ExecutePayment from '../containers/ApprovedPaymentContainer';
// Check approved transaction and deposit credits into user's account
export default class PaymentApproved extends Component {
  render() {
    const { paymentId, PayerID } = this.props.location.query;
    return (
      <StyleRoot id="CreatePaymentPayoutPage">
        <Helmet title="Payment Approved!" />
        <ExecutePayment paymentId={ paymentId } payerID={ PayerID } />
      </StyleRoot>
    );
  }
}

PaymentApproved.propTypes = {
  paymentId: PropTypes.string,
  PayerID: PropTypes.string,
  location: PropTypes.object.isRequired
};
