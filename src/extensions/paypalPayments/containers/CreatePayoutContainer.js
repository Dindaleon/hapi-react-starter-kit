import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreatePayout from '../components/CreatePayout';
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

export default connect( mapStateToProps, mapDispatchToProps )( CreatePayout );
