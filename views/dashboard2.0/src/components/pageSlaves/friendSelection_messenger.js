import React, {Component} from "react";


function FriendSelection(data){
    console.log(data.data);
    return (
    <div id="friendSelection">
        <h3>My Friends</h3>
            {data.data.map((item,index)=>{
            let link = "/api/mediaObject/"+item.profile_pic_ref;
            return(
                <div className="friendSelectionOption" onClick = {()=>{this.getThread(this.state.friends.users_data[index].id)}}>
                    <img src={link}></img>
                   <div className="dumbboi">
                     <h3>{item.account_name}</h3>
                     <h3>{item.proper_name}</h3>
                   </div>
                </div>
    
            )
            })}
    </div>
    );
}

export default FriendSelection;
