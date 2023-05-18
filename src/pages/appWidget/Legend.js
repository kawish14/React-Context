import React, { useContext, useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";
import MapContext from "../../context/mapContext";

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function Legend(props) {
  let {
   view
  } = useContext(MapContext);

  let loginRole = view.loginRole
  let  northPOP = view.northPOP      
  let  northZone = view.northZone
  let  northFeeder = view.northFeeder
  let  northDC = view.northDC
  let  northFAT = view.northFAT
  let  northJoint = view.northJoint
  let  southPOP = view.southPOP
  let  southZone = view.southZone
  let  southFeeder = view.southFeeder
  let  southDC = view.southDC
  let  southFAT = view.southFAT
  let  southJoint = view.southJoint
  let  centralPOP = view.centralPOP
  let  centralZone = view.centralZone
  let  centralFeeder = view.centralFeeder
  let  centralDC = view.centralDC
  let  centralFAT = view.centralFAT
  let  centralJoint = view.centralJoint
  let southBackhaul = view.southBackhaul
  let csvLayer = view.csvLayer

  useEffect(() => {
    let view = props.view;
    let legend;

    loadModules(["esri/widgets/Legend", "esri/widgets/Expand"], {
      css: false,
    }).then(([Legend, Expand]) => {
      if (loginRole.role !== null) {

        if (loginRole.role === "SouthDEVuser") {
          legend = new Expand({
            content: new Legend({
              view: view,
              layerInfos: [
                {
                  layer: southPOP,
                },
                {
                  layer:southBackhaul,
                  title:'Backhaul'
                },
                {
                  layer: southFeeder,
                  title: "Fiber Optical Cable",
                },
                {
                  layer: southDC,
                  title: "Distribution Cabinet (DC/ODB)",
                },
                {
                  layer: southFAT,
                  title: "FAT",
                },
                {
                  layer: southJoint,
                  title: "Joint",
                },
                {
                  layer: southZone,
                  title: "Zones",
                },
                {
                  layer:csvLayer,
                  title:"CSV"
                }
              ],
            }),
            view: view,
            group: "bottom-right",
            expanded: false,
            expandTooltip:"Legend"
          });
        }

        if (loginRole.role === "NorthDEVuser") {
          legend = new Expand({
            content: new Legend({
              view: view,
              layerInfos: [
                {
                  layer: northPOP,
                },
                {
                  layer: northFeeder,
                  title: "Fiber Optical Cable",
                },
                {
                  layer: northDC,
                  title: "Distribution Cabinet (DC/ODB)",
                },
                {
                  layer: northFAT,
                  title: "FAT",
                },
                {
                  layer: northJoint,
                  title: "Joint",
                },
                {
                  layer: northZone,
                  title: "Zones",
                },
                {
                  layer:csvLayer,
                  title:"CSV"
                }
              ],
            }),
            view: view,
            group: "bottom-right",
            expanded: false,
            expandTooltip:"Legend"
          });
        }

        if (loginRole.role === "CentralDEVuser") {
          legend = new Expand({
            content: new Legend({
              view: view,
              layerInfos: [
                {
                  layer: centralPOP,
                },
                {
                  layer: centralFeeder,
                  title: "Fiber Optical Cable",
                },
                {
                  layer: centralDC,
                  title: "Distribution Cabinet (DC/ODB)",
                },
                {
                  layer: centralFAT,
                  title: "FAT",
                },
                {
                  layer: centralJoint,
                  title: "Joint",
                },
                {
                  layer: centralZone,
                  title: "Zones",
                },
                {
                  layer:csvLayer,
                  title:"CSV"
                }
              ],
            }),
            view: view,
            group: "bottom-right",
            expanded: false,
            expandTooltip:"Legend"
          });
        }

        if (loginRole.role === "Admin" || loginRole.role === "CSD") {
          legend = new Expand({
            content: new Legend({
              view: view,
              layerInfos: [
                {
                  layer: northPOP,
                },
                {
                  layer:southBackhaul,
                  title:'Backhaul'
                },
                {
                  layer: northFeeder,
                  title: "Fiber Optical Cable",
                },
                {
                  layer: northDC,
                  title: "Distribution Cabinet (DC/ODB)",
                },
                {
                  layer: northFAT,
                  title: "FAT",
                },
                {
                  layer: northJoint,
                  title: "Joint",
                },
                {
                  layer: northZone,
                  title: "Zones",
                },
                {
                  layer:csvLayer,
                  title:"CSV"
                }
              ],
            }),
            view: view,
            group: "bottom-right",
            expanded: false,
            expandTooltip:"Legend"
          });
        }
        
      }

      view.on(["pointer-down", "pointer-move"], function (evt) {
        view.ui.add(legend, "top-left")
      });

    });

  }, []);

  return null;
}
