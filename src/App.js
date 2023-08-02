import React from 'react';
import Main from './components/MainComponent';
import './App.css'
import { authenticationService } from './_services/authentication';
import history from './history'
import MapState from './context/mapState'
import axios from 'axios'


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      logginStatus: true,
      realTimeAlarms:[],
      
      logoutFromApp:false,
      
      role: null,
      roleAccess: false,
      ip:null,
      district:null,
      latitude:null,
      longitude:null
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
 
   // this.warnTimeout = setTimeout(this.warn, 1600*1000);
    this.logoutTimeout = setTimeout(this.logout, 1800*1000); 

/*     this.warnTimeout = setTimeout(this.warn, 12000);
    this.logoutTimeout = setTimeout(this.logout, 25000);
    */
  }

  restTimeout(){
    this.clearTimeout();
    this.setTimeout()
  }

   warn(){

    /* console.log(authenticationService.currentUserValue)
    console.log("You will be logged out automatically") */
  } 

  logout(){
/* 
    if(authenticationService.currentUserValue){
      axios.post('http://gis.tes.com.pk:28200/user/logout', {
          username:authenticationService.currentUserValue.username,
          role:authenticationService.currentUserValue.role,
          region:authenticationService.currentUserValue.region,
          token:authenticationService.currentUserValue.token,
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    } */
      
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
