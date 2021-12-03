import React, { Component } from "react";
import { Switch, Route, Router } from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import history from "../history";
import SouthComponent from "./south/SouthComponent";
import NorthMap from "./NorthMap";
import mapContext from '../context/mapContext'
import { authenticationService } from "../_services/authentication";

class Main extends Component {
  static contextType = mapContext
  constructor(props) {
    super(props);
    this.state = {
      role: null,
      roleAccess: false,
    };
  }
  componentDidMount() {

    authenticationService.currentUser.subscribe((x) => {
      return this.setState({
        role: x,
        roleAccess: true,
      });
    });
  }
  render() {

    const {loginRole} =this.context;

    const Map = () => {
      
      if (loginRole.role !== null) {
        if (loginRole.role === "SouthDEVuser") return <SouthComponent />;
        else if (loginRole.role === "NorthDEVuser") return <NorthMap />;
      }
      return null
    };

    return (
      <div>
        <Router history={history}>
          <Switch>
            <PrivateRoute exact path="/" component={Map} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default Main;
