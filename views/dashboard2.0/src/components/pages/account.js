import React, {Component} from "react";
import ImageUpload from "../pageSlaves/imageUpload";
import ProfilePicUpload from "../pageSlaves/profilePicUpload";
import MediaContainerCell from "../pageSlaves/mediaContainerCell";
import $ from 'jquery'



class Account extends React.Component {
  constructor(){
    super();
    this.state = {
      newMediaPostButton:false,
      editAccountMode:false,
      temp_profile:{
        bio:"",
        location:"",
        job:"",
        school:"",
        sin_weed:0,
        sin_alch:0,
        sin_nicc:0
      },
      profilePicRef:"",
      freeMediaSlot:true,
      mediaObjects:[]
    }
    this.getMediaRefs = this.getMediaRefs.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.profilePicUploadCallback = this.profilePicUploadCallback.bind(this);
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

  getProfile(bypass){
   if(this.props.user.account_name == "" || bypass==true){
     console.log("user not found in redux store, fetching...")
     $.ajax({
      type:"GET",
      url:"/api/userByid",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log(response)
        if(response=="EC.1"){
          console.log("no profile data found")
          this.setState({newUser:true})
        }else{
          this.setState({user_profile:response});
          this.props.UPDATE_USER(response);
          let link="/api/mediaObject/"+response.profile_pic_ref;
          this.setState({profilePicRef:link})
        }
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
   }else{
    console.log("user found in redux store")
    let link="/api/mediaObject/"+this.props.user.profile_pic_ref;
          this.setState({profilePicRef:link})
   }
  }

  getMediaRefs(bypass){
    if(this.props.userImages.length == 0 || bypass==true){
      $.ajax({
        type:"GET",
        url:"/api/allAccountMediaRefs",
        token:this.getCookie("token"),
        headers:{user_id:this.getCookie("user_id")},
        success:(response) =>{
          console.log("user media refs");
          console.log(response)
          this.setState({mediaObjects:response})
          this.props.UPDATE_USER_IMAGES(response)
          if(response.length == 9){
            this.setState({freeMediaSlot:false});
          }
          },
        error:(response)=>{
          console.log(response)
        }
      }
      )
    }else{
      console.log("user media refs found in redux store")
    }
  }

  editProfile(){
    if(this.state.editAccountMode == false){
      this.setState({editAccountMode:true})
      this.setState({temp_profile:this.props.user})
    }else{
      this.setState({editAccountMode:false})
      this.saveProfile();
    }
  }

saveProfile(){
  this.setState({user_profile:this.state.temp_profile})
  let x = this.state.temp_profile;
  let data = {
      user_id:this.getCookie("user_id"),
      bio:x.bio,
      location:x.location,
      job:x.job,
      school:x.school,
      sin_weed:x.sin_weed? 1:0,
      sin_alch:x.sin_alch? 1:0,
      sin_nicc:x.sin_nicc? 1:0
  }
    $.ajax({
      type:"PUT",
      url:"/api/updateAccountBio",
      token:this.getCookie("token"),
      data:data,
      success:(response) =>{
        console.log(response)
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
}

  handleProfileEdits(e){
    let x = this.state.temp_profile;
    x[e.target.name] = e.target.value;
    this.setState({temp_profile:x});
  }

  handleCheckboxs(e){
    let x = this.state.temp_profile
    x[e.target.name] = e.target.checked;
    this.setState({temp_profile:x})
  }

  profilePicUploadCallback(){
    this.setState({initProfileExists:true})
  }

  render(){
    return (
      <div id="account" className="foreGround ">
        <div id="wakzakbak">
          <div id="accountUnchanging">
                <img src={this.state.profilePicRef}></img>
                <div>
                  <h1>{this.props.user.proper_name}</h1>
                  <h3>{this.props.user.account_name}</h3>
                  <h3>{this.props.user.age}</h3>
                  {this.state.editAccountMode ?(
                      <button id="editAccModeButton" onClick={()=>{this.editProfile()}}>Save</button>
                    ):(
                      <button id="editAccModeButton" onClick={()=>{this.editProfile()}}>Edit Profile</button>
                  )}
                </div>
            </div>

            <div id="accountChanging">
              {this.state.editAccountMode ?(
                <div id="editMode">
                  <ProfilePicUpload callback={this.getProfile}></ProfilePicUpload>
                  <h4>Biography</h4>
                  <textarea id="editBio" rows="10" cols ="20"  name="bio" value={this.state.temp_profile.bio} onChange={(e)=>{this.handleProfileEdits(e)}}></textarea>
                  <h4>Location</h4>
                  <input type="text" name="location"  value={this.state.temp_profile.location} onChange={(e)=>{this.handleProfileEdits(e)}}></input>
                  <h4>Job</h4>
                  <input type="text"  name="job" value={this.state.temp_profile.job} onChange={(e)=>{this.handleProfileEdits(e)}}></input>
                  <h4>School</h4>
                  <input type="text"  name="school" value={this.state.temp_profile.school} onChange={(e)=>{this.handleProfileEdits(e)}}></input>
                  <h3>Sins</h3>
                  <div className="sinOption">
                    <h3>That sticky icky icky</h3>
                    <input type="checkbox"  name="sin_weed" checked={this.state.temp_profile.sin_weed} onClick={(e)=>{this.handleCheckboxs(e)}}></input>
                  </div>
                  <div className="sinOption">
                    <h3>Bottles *clink*</h3>
                    <input type="checkbox" name="sin_alch" checked={this.state.temp_profile.sin_alch} onClick={(e)=>{this.handleCheckboxs(e)}}></input>
                  </div>
                  <div className="sinOption">
                    <h3>Ciggys *cringe*</h3>
                    <input type="checkbox" name="sin_nicc" checked={this.state.temp_profile.sin_nicc} onClick={(e)=>{this.handleCheckboxs(e)}}></input>
                  </div>
                </div>
              ):(
                <div id="displayMode">
                  <h3>{this.props.user.bio}</h3>
                  <h3><b>Located near: </b> {this.props.user.location}</h3>
                  <h3><b>Occupation: </b> {this.props.user.job}</h3>
                  <h3><b>Education: </b> {this.props.user.school}</h3>
                  <h3><b>Sins: </b></h3>
                    {this.props.user.sin_weed ?(
                      <h4>That sticky icky icky</h4>
                    ):(null)}
                    {this.props.user.sin_alch ?(
                      <h4>Bottles *clink*</h4>
                    ):(null)}
                    {this.props.user.sin_nicc ?(
                      <h4>Ciggys *cringe*</h4>
                    ):(null)}
                </div>
              )}
            </div>
          </div>
        <div id="mediaContainer">
          {this.props.userImages.map((item,index)=>{
            let link="/api/mediaObject/"+item.ref
            return(
              <MediaContainerCell refresh={this.getMediaRefs} link={link} img_ref={item.ref}></MediaContainerCell>
            )
          })}
          {this.state.freeMediaSlot ?(
            <div className="mediaContainerCell" id="freeMediaSlotCell">
              <ImageUpload refresh={this.getMediaRefs}></ImageUpload>
            </div>
          ):(null)}
        </div>
        <footer></footer>
      </div>
    );
  }

}

export default Account;
