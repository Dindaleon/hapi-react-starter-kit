import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import App from '../components/App';
import * as ExtensionsActions from '../actions/extensionsActions';
import * as UserActions from '../actions/userActions';
import * as RoomsActions from '../actions/roomsActions';
import * as LocaleActions from '../actions/localeActions';
import radium from 'radium';
const mapStateToProps = ( state ) => {
  return {
    extensions: state.extensions,
    globalState: state,
    pushState,
    router: state.router,
    user: state.user.data,
    userAgent: state.user.agent,
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ ...ExtensionsActions, ...UserActions, ...RoomsActions, ...LocaleActions, pushState, dispatch }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( radium(App) );
