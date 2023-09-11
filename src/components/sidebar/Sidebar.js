import React, { useContext, useEffect, useRef, useState } from "react";
import "./sidebar.css";
import LayerList from "../../widgets/layerlist/LayerList";
import BaseMap from "./basemap/BaseMap";
import OLTReports from "../../widgets/reports/OLTReports";

export default function Sidebar(props) {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div class="nav ">
              {/******************  LAYER LIST ************/}
              <div class="sb-sidenav-menu-heading">layer List</div>
                <LayerList className="layer" view={props.view} />
           
              
              <BaseMap view={props.view} />

          {/*     <div class="sb-sidenav-menu-heading">Reports</div>
              <button
                className="basemap nav-link collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#collapseLayouts"
                aria-expanded="false"
                aria-controls="collapseLayouts"
              >
                <div className="sb-nav-link-icon"></div>
                Reports
                <div className="sb-sidenav-collapse-arrow">
                  <i className="fas fa-angle-down"></i>
                </div>
              </button>
              <div className="basemap-item collapse" id="collapseLayouts">
                <nav className="sb-sidenav-menu-nested nav">
                  <OLTReports view={props.view} />
                </nav>
              </div> */}
            
          </div> 
        </div>

        <div className="sb-sidenav-footer">
          <div className="small">Version 2.3</div>
        </div>
      </nav>
    </div>
  );
}
