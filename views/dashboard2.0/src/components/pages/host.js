import React, {Component} from "react";
import $, { data } from 'jquery'




class Host extends React.Component {
  constructor(){
    super();
    this.state = {
      noFiresides:true,
      fireside:{},
      vibe:"",
      location_address:"",
      allow_friends:0,
      allow_public:0,
      invitePrompt:false,
      friends:{
        users_data:[],
        friends_data:[]
      },
      noFriends:true,
      noInvited:true,
      updateFiresideView:false,

      newVibe:"",
      newLoc:"",
      newAllow_friends:0,
      newAllow_public:0
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
    //check for existing fireside
     this.getMyFireside()
     this.getFriends();
  }
  getMyFireside(bypass){
    if(this.props.hostedFireside.fireside.location_address == "" || bypass==true){
      $.ajax({
        type:"GET",
        url:"/api/getMyFiresides",
        token:this.getCookie("token"),
        headers:{user_id:this.getCookie("user_id")},
        success:(response) =>{
          console.log(response)
          if(response !="ec3"){
            this.setState({fireside:response})
            this.setState({noFiresides:false})
            this.props.UPDATE_HOSTED_FIRESIDE(response)
          }else{
            this.setState({noFiresides:true})
          }
        },
        error:(response)=>{
          console.log(response)
        }
      }
      )
    }else{
      console.log("hosted fireside found in redux")
      this.setState({fireside:this.props.hostedFireside});
      this.setState({noFiresides:false})
    }
  }
 
  createFireside(){
    let data={
      user_id: this.getCookie("user_id"),
      vibe:this.state.vibe,
      location_address:this.state.location_address,
      allow_friends:this.state.allow_friends? 1:0,
      allow_public:this.state.allow_public? 1:0
    }
    if(data.vibe =="" || data.location_address =="" || data.access==""){
      alert("please fill out all form values ty")
    }else{
      $.ajax({
        type:"POST",
        url:"/api/createNewFireside",
        token:this.getCookie("token"),
        data:data,
        success:(response) =>{
          console.log(response)
         
          this.getMyFireside()
        },
        error:(response)=>{
          console.log(response)
        }
      }
      )
    }
  }

  deleteFireside(){
    let x = prompt("enter y to confirm");
    if(x == "y"){
      $.ajax({
        type:"DELETE",
        url:"/api/deleteFireside",
        token:this.getCookie("token"),
        headers:{
          fireside_id:this.state.fireside.fireside.id
        },
        success:(response) =>{
          this.getMyFireside()
        },
        error:(response)=>{
          console.log(response)
        }
      }
      )
    }
  }

  getFriends(){//store in redux aswell b
    $.ajax({
      type:"GET",
      url:"/api/getFriends",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        if(response =="ec2"){
          this.setState({noFriends:true})
        }else{
          this.setState({friends:response})
          this.setState({noFriends:false})
        }
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  toggleInviteList(){
    if(this.state.invitePrompt == false){
      this.setState({invitePrompt:true});
      $("#inviteFriendsButton").addClass("active")
    }else{
      this.setState({invitePrompt:false});
      $("#inviteFriendsButton").removeClass("active")
    }
  }

  cancelInvite(id){
    console.log(id);
    $.ajax({
      type:"DELETE",
      url:"/api/cancelInvite",
      token:this.getCookie("token"),
      headers:{
        user_id:id,
        fireside_id:this.state.fireside.fireside.id
      },
      success:(response) =>{
        this.getMyFireside(true)
      },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }


  inviteFriend(id){
    let data ={
      user_id:id,
      fireside_id:this.state.fireside.fireside.id
    }
    $.ajax({
      type:"POST",
      url:"/api/inviteToFireside",
      token:this.getCookie("token"),
      data:data,
      success:(response) =>{
        this.getMyFireside(true)
      },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  toggleFiresideUpdateView(){
    if(this.state.updateFiresideView == false){
      this.setState({updateFiresideView:true});
      $("#editFiresideButton").addClass("active")
    }else{
      this.setState({updateFiresideView:false});
      $("#editFiresideButton").removeClass("active")
    }
  }

  updateFireside(){
    let data ={
      fireside_id:this.state.fireside.fireside.id, 
      vibe:this.state.newVibe,
      location_address: this.state.newLoc,
      oldAddress:this.state.fireside.fireside.location_address,
      allow_friends: this.state.newAllow_friends ? 1:0,
      allow_public: this.state.newAllow_public ? 1:0
    }
    $.ajax({
      type:"PUT",
      url:"/api/updateFireside",
      token:this.getCookie("token"),
      data:data,
      success:(response) =>{       
        this.getMyFireside()
        this.setState({updateFiresideView:false})
      },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  render(){
      return (
        <div id="Host" className="foreGround">
            {this.state.noFiresides ?(
              <div id="createFiresidePrompt">
                <h1>Host a fireside!</h1>
                <div id="formHeader">
                  <h3>Vibe</h3>
                  <h3>Location Address</h3>
                  <h3>Access</h3>
                </div>
                <form id="hostFiresideForm" onSubmit={(e)=>{e.preventDefault()}}>
                  <input value={this.state.vibe} onChange={(e)=>{this.setState({vibe:e.target.value})}} type="text" placeholder="vibe"></input>
                  <input value={this.state.location_address} onChange={(e)=>{this.setState({location_address:e.target.value})}} type="text" placeholder="location address"></input>
                  <div>
                    <h4>Allow Friends?</h4>
                    <input type="checkbox" value={this.state.allow_friends} onChange={(e)=>{this.setState({allow_friends:e.target.checked})}}></input>
                  </div>
                  <div>
                    <h4>Allow Public?</h4>
                    <input type="checkbox" value={this.state.allow_public} onChange={(e)=>{this.setState({allow_public:e.target.checked})}}></input>
                  </div>
                </form>
                <button onClick={()=>{this.createFireside()}}>Create</button>
                <div id="guidelines">
                  <h3>Guidelines</h3>
                  <p>Don't be an asshole. Don't trick people into tresspassing. Don't harm your guests.
                    If you have any covid symptoms don't host a fireside.
                    Don't spit on people. Know the risks when sharing food/drink/smoke.
                    Just be responsible, its not that hard. If you can't define what "responsible" is on your own
                    then don't host a fireside.
                  </p>
                </div>
              </div>
            ):(
              <div>
                  <div id="firesideDetails">
                    <h1>My Fireside</h1>
                    <div>
                      <div>
                        {this.state.updateFiresideView ? (
                          <div>
                            <input type="text" placeholder={this.state.fireside.fireside.vibe} value={this.state.newVibe} onChange={(e)=>{this.setState({newVibe:e.target.value})}}></input>
                            <input type="text" placeholder={this.state.fireside.fireside.location_address} value={this.state.newLoc}  onChange={(e)=>{this.setState({newLoc:e.target.value})}}></input>
                            <div>
                              <h4>Allow Friends?</h4>
                              <input type="checkbox" checked={this.state.newAllow_friends} onChange={(e)=>{this.setState({newAllow_friends:e.target.checked})}}></input>
                            </div>
                            <div>
                              <h4>Allow Public?</h4>
                              <input type="checkbox" checked={this.state.newAllow_public} onChange={(e)=>{this.setState({newAllow_public:e.target.checked})}}></input>
                            </div>
                            <button onClick={()=>{this.updateFireside()}}>Save</button>
                          </div>
                        ):(
                           <div>
                            <h3>Vibe: {this.state.fireside.fireside.vibe}</h3>
                            <h3>Location: {this.state.fireside.fireside.location_address}</h3>
                            <h3>Allow friends? {this.state.fireside.fireside.allow_friends ?("True"):("False")}</h3>
                            <h3>Allow public? {this.state.fireside.fireside.allow_public ?("True"):("False")}</h3>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4>Invites: {this.state.fireside.invites.length}</h4>
                        <h4>Attendance: {this.state.fireside.attendance.length}</h4>
                      </div>
                    </div>
                  </div>

                <div id="firesideOptions">
                  <button id="editFiresideButton" onClick={()=>{this.toggleFiresideUpdateView()}}>Edit</button>
                  <button id="inviteFriendsButton" onClick={()=>{this.toggleInviteList()}}>Invite Friends</button>
                  <button onClick={()=>{this.deleteFireside()}}>End Fireside</button>
                </div>

                <div id="firesideListsDisplay">

                  <div id="attendanceDisplay">
                    <h2>Attending</h2>
                    {this.state.fireside.attendance.map((item,index)=>{
                      return(
                      <div>
                        <h4>{item.proper_name}</h4>
                        <h4>{item.account_name}</h4>
                      </div>
                      )
                    })}
                  </div>

                  <div id="invitesDisplay">
                    <h2>Invited</h2>
                    {this.state.fireside.invites.map((item,index)=>{
                        return(
                          <div>
                            <h4>{item.proper_name}</h4>
                            <h4>{item.account_name}</h4>
                            <button onClick={()=>{this.cancelInvite(item.user_id)}}>Cancel Invite</button>
                          </div>
                        )
                      })}
                  </div>

                </div>
              </div>
            )}
            {this.state.invitePrompt ?(
              <div id="inviteToFiresidePrompt">
                {this.state.noFriends ?(
                  <div id="noFriendsPrompt">
                    <h2>RIP somebody has no friends</h2>
                  </div>
                ):(
                  <div id="friendSelection">
                    <h3>My Friends</h3>
                    {this.state.friends.friends_data.map((item,index)=>{
                      let existsInInvites = false;
                      let existsInAttending = false;
                      existsInInvites = this.state.fireside.invites.map((item2,index)=>{
                        if(item2.user_id == item.id){
                          return true;
                        }
                      })
                      existsInAttending = this.state.fireside.attendance.map((item2,index)=>{
                        if(item2.user_id == item.id){
                          return true;
                        }
                      })
                      console.log("attending: "+existsInAttending+" invited: "+existsInInvites)
                      if(existsInAttending == false && existsInInvites ==false){
                        return(
                          <div className="friendSelectionOption" >
                            <div>
                              <h3>{item.account_name}</h3>
                              <h3>{item.proper_name}</h3>
                            </div>
                            <button onClick={()=>{this.inviteFriend(item.id)}}>Invite</button>
                          </div>
                          )
                      }
                    })}
                  </div>
                )}
              </div>
            ):(null)}
        </div>
      );
    }
}

export default Host;
