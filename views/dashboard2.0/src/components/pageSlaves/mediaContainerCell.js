import React, {Component} from "react";

import $ from 'jquery'



class MediaContainerCell extends React.Component {
  constructor(){
    super();
    this.state = {
        showOptions:false
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
  delete(img_ref){
    //delete from userimages where media ref = img_ref
    console.log(img_ref);
    $.ajax({
      type:"DELETE",
      url:"/deleteFile",
      token:this.getCookie("token"),
      headers:{img_ref:img_ref},
      success:(response) =>{
  
        console.log(response)
        this.props.refresh(true);

        },
      error:(response)=>{
        console.log(response)
      }
    }
    )
  }
  toggle(){
      if(this.state.showOptions == false){
          this.setState({showOptions:true});
      }else{
        this.setState({showOptions:false});
    }
  }
  render(){

      return (
        <div className="mediaContainerCell">
        <img src={this.props.link}></img>
        <button className="mediaOptionsButton" onClick={()=>{this.toggle()}} >*</button>
        {this.state.showOptions?(
            <div className="mediaOptionsPrompt">
                <button onClick={()=>{this.delete(this.props.img_ref)}}>Delete</button>
            </div>
        ):(null)}
      </div>
      );
    }

}

export default MediaContainerCell;
