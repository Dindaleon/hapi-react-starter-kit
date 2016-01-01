import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import * as UserActions from '../actions/userActions';
import * as RoomsActions from '../actions/roomsActions';

const mapStateToProps = ( state ) => {
  return {
    user: state.user.data,
    rooms: state.rooms
  };
};

const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ ...UserActions, ...RoomsActions }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Dashboard );
