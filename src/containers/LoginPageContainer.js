import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginPage from '../pages/Login';
import * as ExtensionsActions from '../actions/extensionsActions';
import * as UserActions from '../actions/userActions';
import * as LocaleActions from '../actions/localeActions';

const mapStateToProps = ( state ) => {
  return {
    user: state.user.data,
    extensions: state.extensions
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ ...ExtensionsActions, ...UserActions, ...LocaleActions }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( LoginPage );
