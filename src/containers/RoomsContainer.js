import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Rooms from '../components/Rooms';
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

export default connect( mapStateToProps, mapDispatchToProps )( Rooms );
