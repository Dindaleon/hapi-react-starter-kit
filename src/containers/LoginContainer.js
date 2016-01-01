import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from '../components/Login';
import * as UserActions from '../actions/userActions';
import * as LocaleActions from '../actions/localeActions';

const mapStateToProps = ( state ) => {
  return {
    routerState: state.router
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( { ...UserActions, ...LocaleActions }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Login );
