import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import App from '../components/App';
import * as UserActions from '../actions/userActions';
import * as LocaleActions from '../actions/localeActions';

const mapStateToProps = ( state ) => {
  return {
    user: state.user.data,
    pushState
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ ...UserActions, ...LocaleActions, pushState }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( App );
