import React, { useContext, useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";
import MapContext from "../../context/mapContext";

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function BaseMap(props) {
  let view = props.view;
  var basemapToggle;


  useEffect(() => {
    loadModules(["esri/layers/WMSLayer","esri/widgets/BasemapToggle"], { css: false }).then(
      ([WMSLayer, BasemapToggle]) => {

        basemapToggle = new BasemapToggle({
          view: view, // The view that provides access to the map's "streets" basemap
          nextBasemap: "osm", // Allows for toggling to the "hybrid" basemap
        });

        view.ui.add(basemapToggle, "bottom-left");

       /*  let layer = new WMSLayer({
          url: "http://gis.tes.com.pk:28881/geoserver/ShapeFiles/wms",
          title: "CARTOGRAPHY",
          sublayers: [
            {
              name: "CARTOGRAPHY",
              
            }
          ],
        });
        view.map.add(layer) */
      }
    );

    return () => {
      view.ui.remove(basemapToggle);
    };
  }, []);
  return null;
}
