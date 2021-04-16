import React, {Component} from "react";
import $, { data } from 'jquery'

class Messenger extends React.Component {
  constructor(){
    super();
    this.state = {
      friends:{
        users_data:[],
        friends_data:[]
      },
      requests:[],
      thread:[],
      selectedThreadUserData:{},
      thread_id:null,
      friendsMode:true,
      requestsMode:false,
      newMessage:"",

      threadSelected:false,
      threadOptionsOpen:false,

    }
  }
  getCookie(name) 
  {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return(match[2])
    }
    else{
        console.log('--could not find cookie---');
    }
  }
  componentDidMount(){
     this.getRequests();
     this.getFriends();
  }
  getFriends(){
    $.ajax({
      type:"GET",
      url:"/api/getFriends",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log(response);
        if(response !="ec2")
        this.setState({friends:response})
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }
  getRequests(){
    $.ajax({
      type:"GET",
      url:"/api/getIncomingFriendRequests",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log(response);
        this.setState({requests:response})
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }
  getThread(thread_id,user_id){
    var objDiv = document.getElementById("threadDisplay");
    objDiv.scrollTop = objDiv.scrollHeight;
    console.log(thread_id)
      $.ajax({
        type:"GET",
        url:"/api/thread",
        token:this.getCookie("token"),
        headers:{thread_id:thread_id},
        success:(response) =>{
          console.log(response)
         
          this.setState({thread_id:thread_id})
          this.setState({thread:response});

          this.state.friends.friends_data.map((item,index)=>{
            console.log(user_id)
            if(item.id == user_id){
              this.setState({selectedThreadUserData:item})
              if(this.state.threadSelected==false){
                this.setState({threadSelected:true});
              }
              console.log(item);
            }
          })
          },
        error:(response)=>{
          console.log(response)
        }
      }
      )
  }
  acceptFriendRequest(requester_id){
    let data = {
      user_1_id:requester_id,
      user_2_id:this.getCookie("user_id")
    }
    $.ajax({
      type:"POST",
      url:"/api/acceptFriendRequest",
      token:this.getCookie("token"),
      data:data,
      success:(response) =>{
        console.log(response);

        let x = this.state.requests
        x.map((item,index)=>{
          if(item.requester == requester_id && item.requestee == this.getCookie("user_id")){
            x.splice(index,1);
          }
        })
        this.setState({requests:x});
        this.getFriends();
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }
  denyFriendRequest(requester_id){
    $.ajax({
      type:"POST",
      url:"/api/denyFriendRequest",
      token:this.getCookie("token"),
      headers:{
        requester:requester_id,
        requestee:this.getCookie("user_id")
      },
      success:(response) =>{
        console.log(response);
  
        let x = this.state.requests
        x.map((item,index)=>{
          if(item.requester == requester_id && item.requestee == this.getCookie("user_id")){
            x.splice(index,1);
          }
        })
        this.setState({requests:x});
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }
  swap(e){
    console.log(e.target.name+" "+e.target.id)
    $(".messengerLeftPanelActive").removeClass("messengerLeftPanelActive");
  if(e.target.name =="friendsMode"){
    this.setState({friendsMode:true})
    $("#"+e.target.id).addClass("messengerLeftPanelActive");
  }else{
    this.setState({friendsMode:false})
  }

  if(e.target.name =="requestsMode"){
    this.setState({requestsMode:true})
    $("#"+e.target.id).addClass("messengerLeftPanelActive");

  }else{
    this.setState({requestsMode:false})}
  }

  sendMessage(thread_id){
    if(thread_id == null){
      alert("select a thread")
    }else{
      let data ={
        sender_id:this.getCookie("user_id"),
        thread_id:this.state.thread_id ,
        message:this.state.newMessage
      }
      console.log(data);
      $.ajax({
        type:"POST",
        url:"/api/newMessage",
        token:this.getCookie("token"),
        data:data,
        success:(response) =>{
          console.log(response);
          this.setState({newMessage:""})
          this.getThread(thread_id);
          },
        error:(response)=>{
          console.log(response)
        }
      }
      )
    }
    
  }
  toggleOptions(){
    if(this.state.threadOptionsOpen == true){
      this.setState({threadOptionsOpen:false})
    }else{
      this.setState({threadOptionsOpen:true});
    }
  }

  removeFriend(thread_id){  //thread_id is a reference to the friends table. deleting from friends by thread_id is the same as unfriending.
    console.log(thread_id);
  }

  render(){

      return (
        <div id="messenger" className="foreGround">
            <div id ="messengerLeftPanel">
              <div id="messengerLeftPanelHeader">
                <button id="friendsModeButton" className="messengerLeftPanelActive"  name="friendsMode" onClick={(e)=>{this.swap(e)}}>Friends</button>
                <button id="requestsModeButton" name="requestsMode" onClick={(e)=>{this.swap(e)}}>Requests</button>
              </div>
              {this.state.friendsMode ?(
                <div id="friendSelection" className="leftPanelHeader">
                <h3>My Friends</h3>
                    {this.state.friends.friends_data.map((item,index)=>{
                    let link = "/api/mediaObject/"+item.profile_pic_ref;
                    return(
                        <div className="leftPanelCard" onClick = {()=>{this.getThread(this.state.friends.users_data[index].id, item.id)}}>
                            <img src={link}></img>
                            <div className="dumbboi">
                              <h3>{item.account_name}</h3>
                              <h3>{item.proper_name}</h3>
                            </div>
                        </div>
                    )
                    })}
                </div>
              ):(null)}
              {this.state.requestsMode ?(
              <div id="friendRequestSelection"  className="leftPanelHeader">
              <h3>Friend Requests</h3>
              {this.state.requests.map((item,index)=>{
                let link = "/api/mediaObject/"+item.profile_pic_ref;
                return(
                  <div className="leftPanelCard">
                    <img src={link}></img>
                    <div className="dumbboi">
                      <h3>{item.account_name}</h3>
                      <h3>{item.proper_name}</h3>
                    </div>
                    <div>
                      <button onClick={()=>{this.acceptFriendRequest(item.requester)}}>Accept</button>
                      <button onClick={()=>{this.denyFriendRequest(item.requester)}}>Deny</button>
                    </div>
                  </div>
                )
              })}
            </div>
              ):(null)}
            </div>
            <div id="messengerMain">
              {this.state.threadSelected ?(
                <div id="threadHeader">
                  <div>
                    <img src={`/api/mediaObject/${this.state.selectedThreadUserData.profile_pic_ref}`}></img>
                    <div className="dumbboi">
                      <h3>{this.state.selectedThreadUserData.account_name}</h3>
                      <h3>{this.state.selectedThreadUserData.proper_name}</h3>
                    </div>
                  </div>
                  <button onClick={()=>{this.toggleOptions()}}>Options</button>
                  {this.state.threadOptionsOpen ?(
                    <div id="threadOptionsContainer">
                      <button onClick={()=>{this.removeFriend(this.state.thread_id)}}>Unfriend</button>
                    </div>
                  ):(null)}
                </div>
              ):(null)}
                  <div id="threadDisplay">
                    {this.state.thread.map((item,index)=>{
                      if(item.sender_id == this.getCookie("user_id")){
                        return(
                          <div className="message sent">
                          <p>{item.message}</p>
                        </div>
                        )
                      }else{
                        return(
                          <div className="message received">
                            <img src={`/api/mediaObject/${this.state.selectedThreadUserData.profile_pic_ref}`}></img>
                            <p>{item.message}</p>
                          </div>
                        )
                      }
                    })}
                  </div>
                  <div id="inputDisplay">
                    <textarea value={this.state.newMessage} onChange={(e)=>{this.setState({newMessage:e.target.value})}}rows={16} cols={32}></textarea>
                    <button onClick={()=>{this.sendMessage(this.state.thread_id)}}>Send</button>
                  </div>
            </div>
        </div>
      );
    }

}

export default Messenger;
