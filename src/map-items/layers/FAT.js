import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";

export default function FAT(props) {
  const context = useContext(MapContext);
  const { FAT } = context.view;

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

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
            url: "images/pink_fat.png",
            width: "17px",
            height: "17px",
          },
        },
        /************************  Design Network ***********************/
        {
          value: "Status-Design", //02F Design
          symbol: {
            type: "picture-marker",
            url: "images/black_fat.png",
            width: "13px",
            height: "13px",
          },
        },
      ],
    };

    let labelClassFAT = {
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: 1,
        font: {
          family: "Arial",
          size: 8,
          weight: "bold",
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: `$feature.name + " - " + $feature.id`,
      },
    };

    FAT.renderer = rendererCheck;
    FAT.labelingInfo = labelClassFAT;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
        },
        (error) => {
          console.log(error);
        }
      );
  },[]);

  return null;
}
