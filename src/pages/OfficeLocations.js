import React, { useContext, useEffect, useState } from "react";
import MapContext from "../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";

import {version} from '../url'
setDefaultOptions({ version: version })

export default function OfficeLocations(props) {
  let context = useContext(MapContext);

  useEffect(() => {
    loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"], {
      css: false,
    }).then(([Graphic, GraphicsLayer]) => {
      
      let markerSymbol = {
        type: "picture-marker",
        url: "images/pins/place.png",
        color: "red",
        width: "17px",
        height: "17px",
      };

      /************** SOUTH OFFICES ***************/   

      let korangiOffice = {
        type: "point",
        longitude: 67.096654,
        latitude: 24.833483,
      };

      let KhadaMarket = {
        type: "point",
        longitude: 67.051808,
        latitude: 24.813653,
      };

      let Dolmen = {
        type: "point",
        longitude: 67.029979,
        latitude: 24.801955,
      };

      let korangiGraphic = new Graphic({
        geometry: korangiOffice,
        symbol: markerSymbol,
      });

      let khadaMarketGraphic = new Graphic({
        geometry: KhadaMarket,
        symbol: markerSymbol,
      });

      let DolmenGraphic = new Graphic({
        geometry: Dolmen,
        symbol: markerSymbol,
      });


      /************** NORTH OFFICES ***************/

      let TESHQ_ISB = {
        type: "point",
        longitude: 73.086095,
        latitude: 33.717409,
      };

      let DHA2_ISB = {
        type: "point",
        longitude: 73.159536,
        latitude: 33.53108,
      };

      let TESHQGraphic = new Graphic({
        geometry: TESHQ_ISB,
        symbol: markerSymbol,
      });

      let DHA2_ISBGraphic = new Graphic({
        geometry: DHA2_ISB,
        symbol: markerSymbol,
      });

      context.view.graphicLayerOffice.graphics.addMany([
        korangiGraphic,
        khadaMarketGraphic,
        DolmenGraphic,
        TESHQGraphic,
        DHA2_ISBGraphic,
        
      ]);
    });
  }, []);
  return null;
}
