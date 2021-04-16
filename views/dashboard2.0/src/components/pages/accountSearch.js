import React, {Component} from "react";
import $ from 'jquery'

class Search extends React.Component {
  constructor(){
    super();
    this.state = {
      searchName:"",
      results:{
        profiles:[],
        media:[]
      },
      noResults:false
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

  search(name){
    if(name !=""){
      $.ajax({
        type:"GET",
        url:"/api/userByUsername",
        token:this.getCookie("token"),
        headers:{account_name:name},
        success:(response) =>{
          if(response=="EC.1"){
            console.log("no profile data found")
            this.setState({noResults:true})
          }else{
            this.setState({results:response})
            this.setState({noResults:false})
            console.log(response);
          }
          },
        error:(response)=>{
          console.log(response)
        }
      }
      )
    }
  }

  followRequest(user_id){
    console.log(user_id);
    let data ={
      requester_id:this.getCookie("user_id"),
      requestee_id:user_id
    }
    $.ajax({
      type:"POST",
      url:"/api/friendRequest",
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

  navProfile(user_id){
    window.location.href = "/dashboard/user/"+user_id;
  }

  render(){
      return (
        <div id="search" className="foreGround">
            <div id="searchBar">
              <input type="text" placeholder="Search by username" value={this.state.searchName} onChange={(e)=>{this.setState({searchName:e.target.value})}}></input>
              <button onClick={(e)=>{this.search(this.state.searchName)}}>Search</button>
            </div>
            {this.state.noResults ? (
              <div id="noSearchResultsPrompt">
                <h1>No results</h1>
              </div>
            ):(
              <div>
              {this.state.results.profiles.map((item,index)=>{
                if(item.user_id != this.getCookie("user_id")){
                  let link="/api/mediaObject/"+item.profile_pic_ref
                  return(
                    <div className="searchResult">
                      <img src={link}></img> 
                      <div>
                        <h1>{item.account_name}</h1>
                        <h3>{item.proper_name}</h3>
                        <h3>{item.age}</h3>
                      </div>
                      <div>
                        <button onClick={()=>{this.followRequest(item.user_id)}}>Follow</button>
                        <button onClick={()=>{this.navProfile(item.user_id)}}>Profile</button>
                      </div> 
                    </div>
                  )
                }
              })}
            </div>
            )}
        </div>
      );
    }
}

export default Search;
