import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StyleSwitcher from '../components';
import * as ThemeActions from '../actions';

const mapStateToProps = ( state ) => {
  return {
    currentTheme: state.styleSwitcher.currentTheme
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( ThemeActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( StyleSwitcher );
