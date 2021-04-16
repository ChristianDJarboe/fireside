import React, {Component} from "react";
import $ from 'jquery'
import { Link } from "react-router-dom"

class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    this.getProfile();
    this.setActive();
  }
  setActive(){
    let x = window.location.pathname;
    if(x == "/dashboard/firesides"){
      $("#mapButton").toggleClass("active")
    }
    if(x == "/dashboard/accountsearch"){
      $("#searchButton").toggleClass("active")
    }
    if(x == "/dashboard/host"){
      $("#hostButton").toggleClass("active")
    }
    if(x == "/dashboard/messenger"){
      $("#contactsButton").toggleClass("active")
    }
    if(x == "/dashboard/account"){
      $("#accountButton").toggleClass("active")
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
  logout(){
    console.log("logout");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "fb_ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/";
}
getProfile(){
  if(this.props.user.account_name == ""){
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
         this.setState({user_profile:response})
         this.props.UPDATE_USER(response)
       }
       },
     error:(response)=>{
       console.log(response)
     }
   }
   )
  }else{
   console.log("user found in redux store")
  }

 }


focus(e){
  $(".active").toggleClass("active");
  $("#"+e.target.id).toggleClass("active");
}


  render(){
    return (
        <header className="accentTwo">
          <div>
            <h2 id="rightHeader">Fireside</h2>
            <div id="centerHeader">
            <Link  name="searchButton"id="searchButton" to="/dashboard/accountsearch" className="fauxButton">
                <button className="headerButton" onClick={(e)=>{this.focus(e)}} name="searchButton" id="searchButton">Friend Search</button>
              </Link>
              <Link  name="mapButton"id="mapButton" to="/dashboard/firesides" className="fauxButton">
                <button className="headerButton" onClick={(e)=>{this.focus(e)}} name="mapButton" id="mapButton">Firesides</button>
              </Link>
              <Link  name="hostButton"id="hostButton" to="/dashboard/host" className="fauxButton">
                <button className="headerButton" onClick={(e)=>{this.focus(e)}} name="hostButton" id="hostButton">Host</button>
              </Link>
              <Link  name="contactsButton" id="contactsButton" to="/dashboard/messenger" className="fauxButton">
                <button className="headerButton" onClick={(e)=>{this.focus(e)}} name="contactsButton" id="contactsButton">Messenger</button>
              </Link>
              <Link  name="accountButton" id="accountButton" to="/dashboard/account" className="fauxButton">
                <button className="headerButton" onClick={(e)=>{this.focus(e)}} name="accountButton" id="accountButton">Account</button>

              </Link>
            </div>
            <div id="leftHeader">
              <h4>{this.props.user.account_name}</h4>
              <button onClick={()=>{this.logout()}}>Logout</button>
            </div>
          </div>

        </header>
    );
  }
}

export default Header;
