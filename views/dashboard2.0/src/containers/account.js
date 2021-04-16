import { connect } from 'react-redux'
import Account from '../components/pages/account'

import { UPDATE_USER, UPDATE_USER_IMAGES } from '../redux/actions'

const mapStateToProps = (state) => {
    return {
        user: state.user,
        userImages: state.userImages
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UPDATE_USER: (payload) => dispatch(UPDATE_USER(payload)),
        UPDATE_USER_IMAGES: (payload) => dispatch(UPDATE_USER_IMAGES(payload))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)