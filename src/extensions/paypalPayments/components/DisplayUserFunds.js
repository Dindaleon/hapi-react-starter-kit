import React, { Component, PropTypes } from 'react';

export default class DisplayUserFunds extends Component {
  render() {
    const { paypalPayments } = this.props;
    return (
      <div>
        USER FUNDS: { paypalPayments.user_payments.funds }
      </div>
    );
  }
}

DisplayUserFunds.propTypes = {
  paypalPayments: PropTypes.object.isRequired
};
