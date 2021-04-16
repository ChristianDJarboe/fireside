import { connect } from 'react-redux'
import Host from '../components/pages/host'

import { UPDATE_HOSTED_FIRESIDE, UPDATE_SENT_FIRESIDE_INVITES } from '../redux/actions'

const mapStateToProps = (state) => {
    return {
        hostedFireside: state.hostedFireside,
        sentFiresideInvites: state.sentFiresideInvites
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UPDATE_HOSTED_FIRESIDE: (payload) => dispatch(UPDATE_HOSTED_FIRESIDE(payload)),
        UPDATE_SENT_FIRESIDE_INVITES: (payload) => dispatch(UPDATE_SENT_FIRESIDE_INVITES(payload))
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Host)