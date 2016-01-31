import React from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import CreatePayout from '../containers/CreatePayoutContainer';

export default class CreatePaymentPage extends React.Component {
  render() {
    return (
      <StyleRoot id="CreatePaymentPage">
        <Helmet title="Create Payment" />
        <CreatePayout />
      </StyleRoot>
    );
  }
}
