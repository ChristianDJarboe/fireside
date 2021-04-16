export const UPDATE_USER = (payload) =>{
    return{
        type:"UPDATE_USER",
        value:payload
    }
}

export const UPDATE_USER_IMAGES = (payload)=>{
    return{
        type:"UPDATE_USER_IMAGES",
        value:payload
    }
}

export const UPDATE_FRIENDS = (payload)=>{
    return{
        type:"UPDATE_FRIENDS",
        value:payload
    }
}

export const UPDATE_FRIEND_REQUESTS = (payload)=>{
    return{
        type:"UPDATE_FRIEND_REQUESTS",
        value:payload
    }
}

export const UPDATE_SENT_FRIEND_REQUESTS = (payload)=>{
    return{
        type:"UPDATE_SENT_FRIEND_REQUESTS",
        value:payload
    }
}

export const UPDATE_HOSTED_FIRESIDE = (payload)=>{
    return{
        type:"UPDATE_HOSTED_FIRESIDE",
        value:payload
    }
}

export const UPDATE_FIRESIDES = (payload)=>{
    return{
        type:"UPDATE_FIRESIDES",
        value:payload
    }
}

export const UPDATE_FIRESIDE_INVITES = (payload)=>{
    return{
        type:"UPDATE_FIRESIDE_INVITES",
        value:payload
    }
}

export const UPDATE_SENT_FIRESIDE_INVITES = (payload)=>{
    return{
        type:"UPDATE_SENT_FIRESIDE_INVITES",
        value:payload
    }
}





// export const fetchMakes = () => {
//     return (dispatch) => {
//         fetch(url)
//             .then(res => res.json())
//             .then(response => {
//                 const action = {
//                     type: 'FETCH_MAKES',
//                     value: response.Results
//                 }
//                 dispatch(action)
//             })
//     }
// }
