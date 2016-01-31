import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ExecutePayment from '../components/ExecutePayment';
import * as PaymentsActions from '../actions';

const mapStateToProps = ( state ) => {
  return {
    payments: state.paypalPayments,
    params: state.router.params,
    user: state.user.data
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( PaymentsActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( ExecutePayment );
