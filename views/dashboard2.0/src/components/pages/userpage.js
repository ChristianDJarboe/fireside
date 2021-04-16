import React, {Component} from "react";
import $ from 'jquery'


class UserPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        user:{},
        mediaObjects:[],
        profilePic:"",
    }
    console.log(props)
    this.getMediaRefs = this.getMediaRefs.bind(this);
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

    this.getProfile();
    this.getMediaRefs();
  }
  getProfile(){
 
     console.log("user not found in redux store, fetching...")
     $.ajax({
      type:"GET",
      url:"/api/userByid",
      token:this.getCookie("token"),
      headers:{user_id:this.props.data.id},
      success:(response) =>{
        console.log(response)
        if(response=="EC.1"){
          console.log("no profile data found")
          alert("User not found")
        }else{
          this.setState({user:response})
          let link="/api/mediaObject/"+response.profile_pic_ref
          this.setState({profilePic:link});
        }
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
 
  }
  getMediaRefs(){
    $.ajax({
      type:"GET",
      url:"/api/allAccountMediaRefs",
      token:this.getCookie("token"),
      headers:{user_id:this.props.data.id},
      success:(response) =>{
        console.log(response)
        this.setState({mediaObjects:response})
      
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
}

  render(){
      return (
        <div id="userpage" className="foreGround primary">
            <div id="wakzakbak">
                <div id="accountUnchanging">
                  <img src={this.state.profilePic}></img>
                  <div>
                    <h1>{this.state.user.proper_name}</h1>
                    <h3>{this.state.user.account_name}</h3>
                    <h3>{this.state.user.age}</h3>
                  </div>
                </div>
                <div id="displayMode">
                    <h3>{this.state.user.bio}</h3>
                    <h3><b>Located near: </b> {this.state.user.location}</h3>
                    <h3><b>Occupation: </b> {this.state.user.job}</h3>
                    <h3><b>Education: </b> {this.state.user.school}</h3>
                    <h3><b>Sins: </b></h3>
                        {this.state.user.sin_weed ?(
                        <h4>That sticky icky icky</h4>
                        ):(null)}
                        {this.state.user.sin_alch ?(
                        <h4>Bottles *clink*</h4>
                        ):(null)}
                        {this.state.user.sin_nicc ?(
                        <h4>Ciggys *cringe*</h4>
                        ):(null)}
                </div>
            </div>
            <div id="mediaContainer">
                {this.state.mediaObjects.map((item,index)=>{
                  let link="/api/mediaObject/"+item.ref
                  return(
                    <div className="mediaContainerCell">
                      <img src={link}></img>
                    </div>
                  )
                })}
            </div>    
        </div>
      );
    }
}

export default UserPage;
