import { connect } from 'react-redux'
import Firesides from '../components/pages/firesides'

import { 
    UPDATE_FIRESIDES, 
    UPDATE_FIRESIDE_INVITES,
    UPDATE_SENT_FIRESIDE_INVITES,
    UPDATE_HOSTED_FIRESIDE
} from '../redux/actions'

const mapStateToProps = (state) => {
    return {
        user: state.user,
        firesides: state.firesides,
        hostedFireside: state.hostedFireside,
        firesideInvites: state.firesideInvites,
        sentFiresideInvites: state.sentFiresideInvites
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UPDATE_FIRESIDES: (payload) => dispatch(UPDATE_FIRESIDES(payload)),
        UPDATE_FIRESIDE_INVITES: (payload) => dispatch(UPDATE_FIRESIDE_INVITES(payload)),
        UPDATE_SENT_FIRESIDE_INVITES: (payload) => dispatch(UPDATE_SENT_FIRESIDE_INVITES(payload)),
        UPDATE_HOSTED_FIRESIDE: (payload) => dispatch(UPDATE_HOSTED_FIRESIDE(payload))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Firesides)