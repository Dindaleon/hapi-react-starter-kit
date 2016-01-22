import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

const mapStateToProps = ( state ) => {
  return {
    counter: state.counter,
    routerState: state.router
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( CounterActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Counter );
