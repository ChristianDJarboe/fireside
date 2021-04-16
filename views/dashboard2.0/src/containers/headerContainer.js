import { connect } from 'react-redux'
import Header from '../components/siteHeader'

import { UPDATE_USER } from '../redux/actions'

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UPDATE_USER: (payload) => dispatch(UPDATE_USER(payload)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)