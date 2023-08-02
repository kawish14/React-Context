import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";

export default function Joint(props) {
  const context = useContext(MapContext);
  let { Joint } = context.view;
  useEffect(() => {
    const wf_status = "$feature.wf_status";

    const valueExpression = `When (${wf_status} == 0 , 'Status-AsBuilt' ,${wf_status} == 1 , 'Status-Design','none')`;

    var rendererCheck = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      valueExpression: valueExpression,
      uniqueValueInfos: [
        /************************  As Built Network ***********************/
        {
          value: "Status-AsBuilt", //02F AsBuilt
          symbol: {
            type: "picture-marker",
            url: "images/jc1.png",
            width: "20px",
            height: "20px",
          },
        },
        /************************  Design Network ***********************/
        {
          value: "Status-Design", //02F Design
          symbol: {
            type: "picture-marker",
            url: "images/JC.png",
            width: "20px",
            height: "20px",
          },
        },
      ],
    };
    /* 
        view.watch(["stationary"], function () {     
                  
            let scale = Math.round(view.scale * 1) / 1
            
            if (scale < 9050) {

                jointLayer.definitionExpression = "1=1"

            } if (scale > 9050) {
            
                jointLayer.definitionExpression = "network='Feeder'"
            }

        }); */

    Joint.renderer = rendererCheck;
  },[]);
  return null;
}
