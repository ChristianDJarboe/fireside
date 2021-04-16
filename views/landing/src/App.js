import './App.css';
import React, {Component} from "react";
import $ from 'jquery'
import axios from 'axios';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      loginOpen:true,

      loginCred:{
        username:"",
        pass:""
      },

      newAcc:{
        username:"",
        age:0,
        proper_name:"",
        pass:"",
        pass_repeat:"",
        bio:"",
        location:"",
        job:"",
        school:"",
        sin_alch:false,
        sin_nicc:false,
        sin_weed:false
      },

      description: '',
      selectedFile: '',
      uploadPrompt:false,
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

  setCookies(user_id,token,google_key) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = "user_id" + '=' + user_id + ';expires=' + expires.toUTCString();
    document.cookie = "token" + '=' + token + ';expires=' + expires.toUTCString();
    document.cookie = "google_key" + '=' + google_key + ';expires=' + expires.toUTCString();

  }

  updateForms(parent,e){
    let x = this.state[parent];
    x[e.target.name] = e.target.value;
    this.setState({[parent]:x})
    console.log(e.target.value)
  }

  login(){
    var data = {
      username: this.state.loginCred.username, 
      password: this.state.loginCred.pass
    }
    $.ajax({
        type:"POST",
        url:"/auth/login",
        data:JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success:(response) =>{
          this.setCookies(response.user_id,response.token,response.google_key);
          console.log("Login Successful")
          window.location.href ="/dashboard/firesides";
        },
        error:(response)=>{
          console.log("error:");
          console.log(response);
        }
    }
    )
  }

  checkSignup(data){
    if(data.username ===""){return false};
    if(data.password ==="" || data.password != data.passwordRepeat ){return false};
    if(data.age ==0){return false};
    if(data.proper_name ==""){return false};
    if(this.state.profilePicUploaded == false){return false};
    return true;
  }
  
  signUp(){
    let data ={
      username:this.state.newAcc.username,
      password:this.state.newAcc.pass,
      passwordRepeat:this.state.newAcc.pass_repeat,
      age:this.state.newAcc.age,
      proper_name:this.state.newAcc.proper_name,
      bio:this.state.newAcc.bio,
      location:this.state.newAcc.location,
      school:this.state.newAcc.school,
      job:this.state.newAcc.job,
      sin_weed:this.state.newAcc.sin_weed ? 1:0,
      sin_alch:this.state.newAcc.sin_alch ? 1:0,
      sin_nicc:this.state.newAcc.sin_nicc ? 1:0
    }
    if(this.checkSignup(data)){
        $.ajax({
            type:"POST",
            url:"/auth/signup",
            data:JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success:(response) =>{  //create user, user_profile, user credentials
              if(response.msg =="user created"){
                let x = this.state.loginCred
                x.username=data.username;
                x.pass=data.password

              this.setCookies(response.insertId,"");
              const { description, selectedFile } = this.state;
              let formData = new FormData();
                formData.append('description', description);
                formData.append('selectedFile', selectedFile);
              axios.post('/uploadProfilePic', formData)
              .then((result) => {
                this.setState({loginOpen:true});
                this.setState({loginCred:x});
              });
              }
        
            },
            error:(response)=>{
                console.log("error:");
                console.log(response);
            }
        }
        )
    }else{
        alert("Check your signup form. Something important is missing.")
    }
}

handleCheckboxs(e){
  let x = this.state.newAcc
  x[e.target.name] = e.target.checked;
  this.setState({newAcc:x})
}

onChange = (e) => {
  var output = document.getElementById('blah2');
  output.src = URL.createObjectURL(e.target.files[0]);
  switch (e.target.name) {
    case 'selectedFile':
      this.setState({ selectedFile: e.target.files[0] });
      break;
    default:
      this.setState({ [e.target.name]: e.target.value });
  }
  this.setState({uploadPrompt:false})
  this.setState({profilePicUploaded:true});
}

onSubmit = (e) => {
  e.preventDefault();
}

toggleUploadPrompt(){
  if(this.state.uploadPrompt == true){
    this.setState({uploadPrompt:false})
  }else{
    this.setState({uploadPrompt:true})
  }
}

  render(){
      return (
        <div className="App">
          <h1>FireSide</h1>
          <h3>Attend or host local FireSides</h3>
          <div id="poopy">
            {this.state.loginOpen ?
            (
              <div className="formContainer"> 
                <h2>Login</h2>
                <form>
                  <input name="username" value ={this.state.loginCred.username} onChange={(e)=>{this.updateForms("loginCred",e)}} placeholder="Username"></input>
                  <input type="password" name="pass" value ={this.state.loginCred.pass} onChange={(e)=>{this.updateForms("loginCred",e)}} placeholder="Password"></input>
                  <h3 className="fauxButton" onClick={()=>{this.login()}}>Login</h3>
                </form>
                <h3 className="fauxButton" onClick={()=>{this.setState({loginOpen:false})}}>Create Account</h3>
              </div>
            ):(
              <div className="formContainer">
                <h2>Create Account</h2>
                <p>Choose wisely. Top 5 fields cannot be changed.</p>
                <div>
                  <button id="profilePicUploadButton" onClick={()=>{this.toggleUploadPrompt()}}>Change Profile Pic</button>
                  {this.state.uploadPrompt ?(
                    <div id="uploadPrompt">
                      <form onSubmit={this.onSubmit} >
                        <button onClick={()=>{this.toggleUploadPrompt()}}> Cancel </button>
                        <input
                          type="file"
                          name="selectedFile"
                          accept="image/*"
                          onChange={this.onChange}
                        />
                      </form>
                    </div>
                  ):(null)}
                </div>
                <img id="blah2"></img>
                <form id="createAccountForm" onSubmit>
                  <input name="username" value={this.state.newAcc.username} onChange={(e)=>{this.updateForms("newAcc",e)}} placeholder="Unique Username"></input>
                  <input name="proper_name" value={this.state.newAcc.proper_name} onChange={(e)=>{this.updateForms("newAcc",e)}} placeholder="Your proper name" ></input>
                  <div>
                    <h3>Age</h3>
                    <input type="number" name="age" value={this.state.newAcc.age} onChange={(e)=>{this.updateForms("newAcc",e)}} placeholder="Age"></input>
                  </div>
                  <input  name="pass" value={this.state.newAcc.pass} onChange={(e)=>{this.updateForms("newAcc",e)}}  placeholder="Password"></input>
                  <input name="pass_repeat" value={this.state.newAcc.pass_repeat} onChange={(e)=>{this.updateForms("newAcc",e)}}   placeholder="Repeat Password"></input>
                  <textarea id="editBio" rows="10" cols ="20"  name="bio" placeholder="Biography" value={this.state.bio} onChange={(e)=>{this.updateForms("newAcc",e)}}></textarea>
                  <input type="text" name="location" placeholder="Location" value={this.state.location} onChange={(e)=>{this.updateForms("newAcc",e)}}></input>
                  <input type="text"  name="job" placeholder="Job" value={this.state.job} onChange={(e)=>{this.updateForms("newAcc",e)}}></input>
                  <input type="text"  name="school" placeholder="School" value={this.state.school} onChange={(e)=>{this.updateForms("newAcc",e)}}></input>
                  <h3>Sins</h3>
                  <div className="sinOption">
                    <h3>That sticky icky icky</h3>
                    <input type="checkbox"  name="sin_weed" checked={this.state.newAcc.sin_weed} onClick={(e)=>{this.handleCheckboxs(e)}}></input>
                  </div>
                  <div className="sinOption">
                    <h3>Bottles *clink*</h3>
                    <input type="checkbox" name="sin_alch" checked={this.state.newAcc.sin_alch} onClick={(e)=>{this.handleCheckboxs(e)}}></input>
                  </div>
                  <div className="sinOption">
                    <h3>Ciggys *cringe*</h3>
                    <input type="checkbox" name="sin_nicc" checked={this.state.newAcc.sin_nicc} onClick={(e)=>{this.handleCheckboxs(e)}}></input>
                  </div>
                  <h3 className="fauxButton"onClick={()=>{this.signUp()}}>Create</h3>
                </form>
                <h3 className="fauxButton" onClick={()=>{this.setState({loginOpen:true})}}>Already a user?</h3>
              </div>
            )}
          </div>
        </div>
      );
    }
}

export default App;
