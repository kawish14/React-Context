import React, { Component } from "react";
import { Switch, Route, Router } from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import history from "../history";
import SouthMap from "./south/SouthMap";
import NorthMap from "./north/NorthMap";
import CentralMap from "./central/CentralMap";
import Admin from './admin/Admin'
import mapContext from '../context/mapContext'
import { authenticationService } from "../_services/authentication";
import routes from "../routes";


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

    const {loginRole} =this.context.view;

    const Map = () => {
      
      if (loginRole.role !== null) {
        if (loginRole.role === "SouthDEVuser") return <SouthMap />;
        else if (loginRole.role === "NorthDEVuser") return <NorthMap />;
        else if (loginRole.role === "CentralDEVuser") return <CentralMap />;
        else if (loginRole.role === "Admin") return <Admin />;
      }
      return null
    };

    return (
      <>
        <Router history={history}>
        <>
          <Switch>
              <React.Fragment>
                {routes.map((route, index) => {
                  return <PrivateRoute key={index} {...route} />;
                })}
              </React.Fragment>

              {/* <PrivateRoute exact path="/" component={Map} /> */}
              
            </Switch>
          <Route path="/login" component={LoginPage} />
        </>
          
        </Router>
      </>
    );
  }
}

export default Main;
