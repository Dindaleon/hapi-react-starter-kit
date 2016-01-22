import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MyCounter from '../components/MyCounter';
import * as CounterActions from '../actions';

const mapStateToProps = ( state ) => {
  return {
    myCounterExample: state.myCounterExample,
    routerState: state.router
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( CounterActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( MyCounter );
