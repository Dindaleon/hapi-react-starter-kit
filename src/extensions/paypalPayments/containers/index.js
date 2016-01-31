import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DisplayUserFunds from '../components/DisplayUserFunds';
import * as PaymentsActions from '../actions';

const mapStateToProps = ( state ) => {
  return {
    paypalPayments: state.paypalPayments,
    user: state.user.data
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( PaymentsActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( DisplayUserFunds );
