import { connect } from 'react-redux'
import AccountSearch from '../components/pages/accountSearch'

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSearch)