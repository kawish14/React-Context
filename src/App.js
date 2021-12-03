import React from 'react';
import Main from './components/MainComponent';
import './App.css'
import { authenticationService } from './_services/authentication';
import history from './history'
import MapState from './context/mapState'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      logginStatus: true,
      realTimeAlarms:[],
      logoutFromApp:false
    }
    this.event = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ]

    this.warn = this.warn.bind(this);
    this.logout = this.logout.bind(this)
    this.restTimeout = this.restTimeout.bind(this)

    for(var i in this.event){
      window.addEventListener(this.event[i], this.restTimeout)

    }

    this.setTimeout()
  }

  clearTimeout() {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);

    if (this.logoutTimeout) clearTimeout(this.logoutTimeout)
  }

  setTimeout() {

    //this.warnTimeout = setTimeout(this.warn, 53*1000);
    this.logoutTimeout = setTimeout(this.logout, 100*1000);
   
  }

  restTimeout(){
    this.clearTimeout();
    this.setTimeout()
  }

   warn(){

    //alert("You will be logged out automatically")
  } 

  logout(){

    authenticationService.logout();
    history.push('/login');
   
  }

  destroy(){
    this.clearTimeout();

    for(var i in this.event){
      window.removeEventListener(this.event[i], this.restTimeout)
    }
  }


  render() {
    return (
      
        <MapState>
           <div className="App">
            <Main />
          </div>
        </MapState>
         
       
    );
  }
}

export default App;
