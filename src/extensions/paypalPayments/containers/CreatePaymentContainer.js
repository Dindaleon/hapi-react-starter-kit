import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreatePayment from '../components/CreatePayment';
import * as PaymentsActions from '../actions';

const mapStateToProps = ( state ) => {
  return {
    payments: state.paypalPayments,
    user: state.user.data
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( PaymentsActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( CreatePayment );
