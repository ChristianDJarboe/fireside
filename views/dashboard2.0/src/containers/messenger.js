import { connect } from 'react-redux'
import Messenger from '../components/pages/messenger'

import { 
    UPDATE_FRIENDS, 
    UPDATE_FRIEND_REQUESTS,
    UPDATE_SENT_FRIEND_REQUESTS
} from '../redux/actions'

const mapStateToProps = (state) => {
    return {
        user: state.user,
        friends: state.friends,
        friendRequests: state.friendRequests,
        sentFriendRequests: state.sentFriendRequests
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UPDATE_FRIENDS: (payload) => dispatch(UPDATE_FRIENDS(payload)),
        UPDATE_FRIEND_REQUESTS: (payload) => dispatch(UPDATE_FRIEND_REQUESTS(payload)),
        UPDATE_SENT_FRIEND_REQUESTS: (payload) => dispatch(UPDATE_SENT_FRIEND_REQUESTS(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messenger)