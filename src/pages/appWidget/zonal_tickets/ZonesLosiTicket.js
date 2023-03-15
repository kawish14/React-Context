import React from "react";
import MapContext from "../../../context/mapContext";
import SouthZoneTicket from "./SouthZoneTicket";
import NorthZoneTicket from "./NorthZoneTicket";
import CentralZoneTicket from "./CentralZoneTicket";
import AdminZoneTicket from './AdminZoneTicket'
import "../widget.css";

export default class ZonesLosiTicket extends React.Component {
  static contextType = MapContext;

 /*  componentDidMount() {
    let { loginRole } = this.context;

    if (loginRole.role === "SouthDEVuser") {
      return <SouthZoneTicket />;
    } else if (loginRole.role === "NorthDEVuser") {
      return <NorthZoneTicket />;
    } else if (loginRole.role === "CentralDEVuser") {
      return <CentralZoneTicket />;
    } else if (loginRole.role === "Admin") {
      return (
        <>
          <SouthZoneTicket />
          <NorthZoneTicket />
          <CentralZoneTicket />
        </>
      );
    }
  } */

  render() {

    let { view } = this.context;
    let loginRole = view.loginRole

    return (
      <>
        {loginRole.role === "SouthDEVuser" && (
          <SouthZoneTicket view={this.props.view} />
        )}

        {loginRole.role === "NorthDEVuser" && (
          <NorthZoneTicket view={this.props.view} />
        )}

        {loginRole.role === "CentralDEVuser" && (
          <CentralZoneTicket view={this.props.view} />
        )}

        {loginRole.role === "Admin" ? (
          <>
            <AdminZoneTicket view={this.props.view} />
          </>
        ): null }
      </>
    )
  }
}
