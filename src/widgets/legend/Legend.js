import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import {version} from '../../url'

setDefaultOptions({ version: version });
export default function Legend(props) {
    const context = useContext(MapContext);

    let {customer,InactiveCPE,DC_ODB,FAT,Joint,POP,Distribution,Feeder,Zone,Backhaul,graphicLayer} = context.view;

  useEffect(() => {
    let legend;
    loadModules(["esri/widgets/Legend", "esri/widgets/Expand"], {
      css: false,
    }).then(([Legend, Expand]) => {
        legend = new Expand({
          content: new Legend({
            view: props.view,
            layerInfos: [
              {
                layer: POP,
                title: "POP",
              },
              {
                layer:customer,
                title:'Active Customers'
              },
              {
                layer:InactiveCPE,
                title:'In Active Customers'
              },
              {
                layer:Backhaul,
                title:'Backhaul'
              },
              {
                layer:Feeder,
                title:'OFC'
              },
              {
                layer:DC_ODB,
                title:'DC/ODB'
              },
              {
                layer:FAT,
                title:'FAT'
              },
              {
                layer:Joint,
                title:'Joint'
              },
              {
                layer:Zone,
                title:'Zones'
              },
              {
                layer:graphicLayer,
                title:"Vehicle"
              }
            ],
          }),
          view: props.view,
          group: "bottom-right",
          expanded: false,
          expandTooltip: "Legend",
        });
    });

    props.view.on(["pointer-down", "pointer-move"], function (evt) {
        props.view.ui.add(legend, "top-left")
      });

  }, []);
  return null;
}