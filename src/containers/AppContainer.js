import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import App from '../components/App';
import * as UserActions from '../actions/userActions';
import * as LocaleActions from '../actions/localeActions';
import radium from 'radium';
const mapStateToProps = ( state ) => {
  return {
    user: state.user.data,
    userAgent: state.user.agent,
    pushState,
    router: state.router
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ ...UserActions, ...LocaleActions, pushState, dispatch }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( radium(App) );
