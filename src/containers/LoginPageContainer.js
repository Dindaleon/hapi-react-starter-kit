import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginPage from '../pages/Login';
import * as UserActions from '../actions/userActions';
import * as LocaleActions from '../actions/localeActions';

const mapStateToProps = ( state ) => {
  return {
    user: state.user.data,
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ ...UserActions, ...LocaleActions }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( LoginPage );
