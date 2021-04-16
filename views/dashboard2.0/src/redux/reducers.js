import { act } from 'react-dom/test-utils';
import { combineReducers } from 'redux'

const user = (state = {},action) => {
    switch(action.type){
        case "UPDATE_USER":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const userImages = (state ={},action)=>{
    switch(action.type){
        case "UPDATE_USER_IMAGES":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const friends = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_FRIENDS":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const friendRequests = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_FRIEND_REQUESTS":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const sentFriendRequests = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_SENT_FRIEND_REQUESTS":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const hostedFireside = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_HOSTED_FIRESIDE":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const firesides = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_FIRESIDES":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const firesideInvites = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_FIRESIDE_INVITES":
            let x = action.value;
            return x;
        default:
            return state
    }
}

const sentFiresideInvites = (state=[],action)=>{
    switch(action.type){
        case "UPDATE_SENT_FIRESIDE_INVITES":
            let x = action.value;
            return x;
        default:
            return state
    }
}
export default combineReducers({
    user,
    userImages,
    friends,
    friendRequests,
    sentFriendRequests,
    hostedFireside,
    firesides,
    firesideInvites,
    sentFiresideInvites
})