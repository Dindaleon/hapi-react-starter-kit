import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Hall from '../components/Hall';
import * as RoomsActions from '../actions/roomsActions';

const mapStateToProps = ( state ) => {
  return {
    rooms: state.rooms,
    user: state.user.data
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators( RoomsActions, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Hall );
