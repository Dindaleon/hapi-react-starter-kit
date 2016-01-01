import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TestRedux from '../components/TestRedux';
import * as UserActions from '../actions/userActions';

function mapStateToProps( state ) {

  return {
    // isLoggedIn: state.user,
    theState: state.user,
    routerState: state.router
  };
}

function mapDispatchToProps( dispatch ) {
  return bindActionCreators( UserActions, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( TestRedux );
