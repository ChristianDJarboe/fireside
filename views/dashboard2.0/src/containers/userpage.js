import React from 'react';
import { useParams } from 'react-router';
import UserPage from "../components/pages/userpage"
// import material ui components here //

// Container, Paper, Chip //

const UserPageContainer = (props) => {
    let params = useParams();
    console.log(params);


    return (
        <UserPage data={params}></UserPage>
    )
}

export default UserPageContainer