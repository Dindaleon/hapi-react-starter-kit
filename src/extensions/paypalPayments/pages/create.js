import React from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import CreatePayment from '../containers/CreatePaymentContainer';

export default class CreatePaymentPage extends React.Component {
  render() {
    return (
      <StyleRoot id="CreatePaymentPage">
        <Helmet title="Create Payment" />
        <CreatePayment />
      </StyleRoot>
    );
  }
}
