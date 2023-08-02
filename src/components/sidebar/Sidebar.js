import React, { useContext, useEffect, useRef, useState } from "react";
import "./sidebar.css";
import LayerList from "../../widgets/layerlist/LayerList";
import BaseMap from "./basemap/BaseMap";

export default function Sidebar(props) {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div class="nav ">
              {/******************  LAYER LIST ************/}
              <div class="sb-sidenav-menu-heading">Layers List</div>
                <LayerList className="layer" view={props.view} />
           
              
              <BaseMap view={props.view} />
          </div> 
        </div>

        <div className="sb-sidenav-footer">
          <div className="small">Version 2.3</div>
        </div>
      </nav>
    </div>
  );
}
