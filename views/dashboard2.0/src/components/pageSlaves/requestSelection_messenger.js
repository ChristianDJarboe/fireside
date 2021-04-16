import React, {Component} from "react";


function RequestSelection(data, accept, deny){
    console.log(data.data)
    return (
        <div id="friendRequestSelection">
        <h3>Friend Requests</h3>
        {data.data.map((item,index)=>{
          let link = "/api/mediaObject/"+item.profile_pic_ref;
          return(
            <div className="friendRequestSelectionOption">
              <img src={link}></img>
              <div className="dumbboi">
                <h3>{item.account_name}</h3>
                <h3>{item.proper_name}</h3>
              </div>
              <div>
                <button onClick={()=>{accept(item.requester)}}>Accept</button>
                <button onClick={()=>{deny(item.requester)}}>Deny</button>
              </div>
            </div>
          )
        })}
      </div>
    );
}

export default RequestSelection;
