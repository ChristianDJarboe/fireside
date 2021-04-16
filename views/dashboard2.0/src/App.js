import './App.css';
import React, {Component} from "react";
import Router from "./router.js";
import { BrowserRouter } from "react-router-dom";
import Header from "./containers/headerContainer";
import { Provider } from 'react-redux'
import store from './redux/store'

class App extends React.Component {
  constructor(){
    super();

  }

  render(){

      return (
        <div className="App primary">
          <Provider store={store}>
            <BrowserRouter>
              <div>
                <Header></Header>
                <Router></Router>
              </div>
            </BrowserRouter>
          </Provider>
        </div>
      );
    }

}

export default App;
