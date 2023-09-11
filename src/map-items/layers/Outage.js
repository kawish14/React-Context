import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";

export default function Outage(props) {
  const context = useContext(MapContext);
  const { Outage } = context.view;

  useEffect(() => {
    const category = "$feature.category";
    const valueExpression = `When (
            ${category} == 'Force Majeure' , 'Force Majeure' ,${category} == 'Vandalism' , 'Vandalism',
            ${category} == 'Construction' , 'Construction', ${category} == 'ROW Authority' , 'ROW Authority',
            ${category} == 'PAR' , 'PAR','none'
            )`;

    var rendererCheck = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      valueExpression: valueExpression,
      uniqueValueInfos: [
        {
          value: "Force Majeure",
          symbol: {
            type: "picture-marker",
            url: "images/danger.png",
            width: "30px",
            height: "30px",
          },
        },
        {
          value: "Vandalism",
          symbol: {
            type: "picture-marker",
            url: "images/Vandalism.png",
            width: "30px",
            height: "30px",
          },
        },
        {
          value: "Construction",
          symbol: {
            type: "picture-marker",
            url: "images/Construction.png",
            width: "30px",
            height: "30px",
          },
        },
        {
          value: "ROW Authority",
          symbol: {
            type: "picture-marker",
            url: "images/auth.png",
            width: "30px",
            height: "30px",
          },
        },
        {
          value: "PAR",
          symbol: {
            type: "picture-marker",
            url: "images/network.png",
            width: "30px",
            height: "30px",
          },
        },
      ],
    };

    Outage.renderer = rendererCheck;

  }, []);

  return null;
}
