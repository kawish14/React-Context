import React, { useEffect,useState, useRef } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";
import {version} from '../../../url'
import './basemap.css'
setDefaultOptions({ version: version })

const BaseMap = (props) => {
  var basemapToggle;

  const [display, SetDisplay] = useState(false)
  
  useEffect(() =>{

    loadModules(["esri/layers/WMSLayer","esri/widgets/BasemapToggle"], { css: false }).then(
      ([WMSLayer, BasemapToggle]) => {

        basemapToggle = new BasemapToggle({
          view: props.view, // The view that provides access to the map's "streets" basemap
          nextBasemap: "osm", // Allows for toggling to the "hybrid" basemap
        });

      //  props.view.ui.add(basemapToggle, "bottom-left");
      
        if (window.innerWidth >= 1366) {        
          props.view.ui.add(basemapToggle, "bottom-left");
          SetDisplay(false)

        } else {
          props.view.ui.remove(basemapToggle, "bottom-left");
          SetDisplay(true)
        }

        window.addEventListener("resize", () => {
          
          if (window.innerWidth >= 1366) {        
            props.view.ui.add(basemapToggle, "bottom-left");
            SetDisplay(false)

          } else {
            props.view.ui.remove(basemapToggle, "bottom-left");
            SetDisplay(true)
          }
        })

      }
    );

  },[])

  const baseMap = (event) =>{
    props.view.map.basemap = event.target.value
  }
  return (
    <>
      {display ? (
        <>
          <div class="sb-sidenav-menu-heading">BaseMap Gallery</div>
          <button
            className="basemap nav-link collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#collapseLayouts"
            aria-expanded="false"
            aria-controls="collapseLayouts"
          >
            <div className="sb-nav-link-icon"></div>
            Basemap
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </button>

          <div className="basemap-item collapse" id="collapseLayouts">
            <nav className="sb-sidenav-menu-nested nav">
              <button
                className="basemap-button nav-link"
                value="satellite"
                onClick={baseMap}
              >
                Satellite
              </button>
              <button
                className="basemap-button nav-link"
                value="osm"
                onClick={baseMap}
              >
                OSM
              </button>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
};

export default BaseMap;
