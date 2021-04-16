import React, {Component} from "react";
import $ from 'jquery'
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import mapStyle from "../mapStyles/firesideDarkMap"
import reactDom from "react-dom";

class Map extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      publicFiresides:[],
      friendsFiresides:[],
      privateFiresides:[],
      invites:[],
      selectedFireside:null,
      menuOpen:false,
      noInvites:false,
      showPublic:true,
      showFriends:false,
      showPrivate:false,
    }
    this.toggleInvites = this.toggleInvites.bind(this);
    this.toggleMapOptions = this.toggleMapOptions.bind(this);
    this.removeInviteFromClient = this.removeInviteFromClient.bind(this);
  }

  componentDidMount(){
    this.getFiresides();
    this.getInvites();
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

  getInvites(){
    $.ajax({
      type:"GET",
      url:"/api/firesideInvites",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log("invites")
        console.log(response);
          this.setState({invites:response})
          if(response.length == 0){
            this.setState({noInvites:true})
          }else{
            this.setState({noInvites:false})

          }
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  getFiresides(){
    //public
    $.ajax({
      type:"GET",
      url:"/api/publicFiresides",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log("public firesides")
        console.log(response);
          this.setState({publicFiresides:response})
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
    //friends
    $.ajax({
      type:"GET",
      url:"/api/friendsOnlyFiresides",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log("friends firesides")
        console.log(response);
          this.setState({friendsFiresides:response})
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
    //private
    $.ajax({
      type:"GET",
      url:"/api/privateFiresides",
      token:this.getCookie("token"),
      headers:{user_id:this.getCookie("user_id")},
      success:(response) =>{
        console.log("private firesides")
        console.log(response);
          this.setState({privateFiresides:response})
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  acceptInvite(fireside_id){
    let data ={
      user_id: this.getCookie("user_id"),
      fireside_id:fireside_id,
      type:"accept"
    }
    console.log(data);
    $.ajax({
      type:"POST",
      url:"/api/handleInvites",
      token:this.getCookie("token"),
      data:data,
      success:(response) =>{
        console.log(response);
        this.removeInviteFromClient(fireside_id)
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  declineInvite(fireside_id){
    let data ={
      user_id: this.getCookie("user_id"),
      fireside_id:fireside_id,
      type:"decline"
    }
    console.log(data);
    $.ajax({
      type:"POST",
      url:"/api/handleInvites",
      token:this.getCookie("token"),
      data:data,
      success:(response) =>{
        console.log(response);
        this.removeInviteFromClient(fireside_id)
        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }

  removeInviteFromClient(fireside_id){
    let x = this.state.invites;
    x.map((item,index)=>{
      if(item.fireside_id == fireside_id){
        x.splice(index,1);
      }
    })
    this.setState({invites:x});
    if(x.length == 0){
      this.setState({noInvites:true})
    }
  }
  
  navHostProfile(user_id){
    window.location.href = "/dashboard/user/"+user_id;
  }

  toggleInvites(){
    if(this.state.menuOpen == true){
      this.setState({menuOpen:false})
    }else{this.setState({menuOpen:true})}
  }

  toggleMapOptions(e){
    console.log(e.target.name +" "+ this.state[e.target.name])
      if(this.state[e.target.name] == true){
        this.setState({[e.target.name]:false})
        $("#"+e.target.name).removeClass("activeMapOption");
      }else{
        this.setState({[e.target.name]:true})
        $("#"+e.target.name).addClass("activeMapOption");
      }
  }

  render(){
    return(
      <div id="ziggyb">
        <div id="mapOptions">
          <div>
            <button id="showPublic" onClick={(e)=>{this.toggleMapOptions(e)}} name="showPublic" className ="mapButton activeMapOption" >Show Public</button>
            <button id="showFriends" onClick={(e)=>{this.toggleMapOptions(e)}} name="showFriends" className ="mapButton ">Show Friends</button>
            <button id="showPrivate" onClick={(e)=>{this.toggleMapOptions(e)}} name="showPrivate" className ="mapButton">Show Private</button>
          </div>
          <div id="mapOptionsDropDownContainer" className="dropDownContainer">
            <button onClick={()=>{this.toggleInvites()}}>Invites</button>
            {this.state.menuOpen ?(
              <div id="invitesDropDown">
                {this.state.noInvites ?(
                  <div id="noInvitesCard">
                    <h1>No Invites</h1>
                  </div>
                ):(
                  <div>
                    {this.state.invites.map((item,index)=>{
                      return(
                        <div key={index} className="firesideInviteCard">
                          <h3>{item.proper_name}</h3>
                          <h4>{item.account_name}</h4>
                          <h4>{item.vibe}</h4>
                          <h4>{item.location_address}</h4>
                          <div>
                            {item.allowFriends ? (
                              <h4>Friends</h4>
                            ):(null)}
                            {item.allow_public ? (
                              <h4>Public</h4>
                            ):(null)}
                          </div>
                          <div>
                            <button onClick={()=>{this.acceptInvite(item.fireside_id)}}>Accept</button>
                            <button onClick={()=>{this.declineInvite(item.fireside_id)}}>Decline</button>
                            <button onClick={()=>{this.navHostProfile(item.user_id)}}>Host Profile</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ):(null)}
          </div>
        </div>
        <GoogleMap 
          defaultZoom={10} 
          defaultCenter={{lat:29.424, lng:-98.493}}
          defaultOptions={{styles:mapStyle}}
        >
        {this.state.showPublic ?(
          <div>
            {this.state.publicFiresides.map((item,index)=>{
                  return(
                    <Marker
                      key={index}
                      position={
                        {
                          lat:parseFloat(item.lat),
                          lng:parseFloat(item.lng)
                        }
                      }
                      onClick={
                        ()=>{this.setState({selectedFireside:item})}
                      }
                      icon={
                        {
                          url:"/campfiregif.gif",
                          scaledSize: new window.google.maps.Size(35,35)
                        }
                      }
                    ></Marker>
                  )
              })}
          </div>
        ):(null)}
        {this.state.showPrivate ?(
          <div>
            {this.state.privateFiresides.map((item,index)=>{
                  return(
                    <Marker
                      key={index}
                      position={
                        {
                          lat:parseFloat(item.lat),
                          lng:parseFloat(item.lng)
                        }
                      }
                      onClick={
                        ()=>{this.setState({selectedFireside:item})}
                      }
                      icon={
                        {
                          url:"/campfiregif.gif",
                          scaledSize: new window.google.maps.Size(35,35)
                        }
                      }
                    ></Marker>
                  )
              })}
          </div>
        ):(null)}
        {this.state.showFriends ?(
          <div>
            {this.state.friendsFiresides.map((item,index)=>{
                  return(
                    <Marker
                      key={index}
                      position={
                        {
                          lat:parseFloat(item.lat),
                          lng:parseFloat(item.lng)
                        }
                      }
                      onClick={
                        ()=>{this.setState({selectedFireside:item})}
                      }
                      icon={
                        {
                          url:"/campfiregif.gif",
                          scaledSize: new window.google.maps.Size(35,35)
                        }
                      }
                    ></Marker>
                  )
              })}
          </div>
        ):(null)}
        {this.state.selectedFireside && (
          <InfoWindow    
          position={
            {
              lat:parseFloat(this.state.selectedFireside.lat),
              lng:parseFloat(this.state.selectedFireside.lng)
            }
          }
          onCloseClick ={
            ()=>{this.setState({selectedFireside:null})}
          }
          >
            <div className="mapPopup">
              <h4>{this.state.selectedFireside.proper_name}</h4>
              <h5>{this.state.selectedFireside.account_name}</h5>
              <h4>{this.state.selectedFireside.vibe}</h4>
              <h4>Located Near: {this.state.selectedFireside.location_address}</h4>
              <div>
                <button onClick={()=>{this.navHostProfile(this.state.selectedFireside.user_id)}}>Host Profile</button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      </div>
    )
  }
}

const WrappedMap = withScriptjs(withGoogleMap(Map))

class Firesides extends React.Component{
  constructor(props){
    super(props);
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
  render(){
    return (
      <div id="firesidesPage" className="foreGround">
        <div id="logzogpog">
          <WrappedMap 
            googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=`+this.getCookie("google_key")+`&map_ids=3c46cb13965c159e`}
            loadingElement={<div style={{height:"100%" }}></div>}
            containerElement={<div style={{height:"100%" }}></div>}
            mapElement={<div style={{height:"100%" }}></div>}
          ></WrappedMap>
        </div>
      </div>
    );
  }
}

export default Firesides;
