import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery'

export default class ProfilePicUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      selectedFile: '',
      uploadPrompt:false,
    };
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
  onChange = (e) => {
    var output = document.getElementById('blah');
    output.src = URL.createObjectURL(e.target.files[0]);

    
    switch (e.target.name) {
      case 'selectedFile':
        this.setState({ selectedFile: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { description, selectedFile } = this.state;
    let formData = new FormData();

    formData.append('description', description);
    formData.append('selectedFile', selectedFile);



    axios.post('/uploadProfilePic', formData)
    .then((result) => {
      // access results...
      console.log(result)
      this.props.callback(true);
      this.setState({uploadPrompt:false})
    });
  }
  toggleUploadPrompt(){
    if(this.state.uploadPrompt == true){
      this.setState({uploadPrompt:false})
    }else{
      this.setState({uploadPrompt:true})
    }
  }
  render() {
    return (
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
              <button type="submit">Submit</button>
            </form>
            <img id="blah"></img>
          </div>
   
        ):(null)}

      </div>
 
    );
  }
}
