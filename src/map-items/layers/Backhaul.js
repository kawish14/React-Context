import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";

export default function Backhaul(props) {
  const context = useContext(MapContext);
  let { Backhaul } = context.view;

  useEffect(() => {
    const wf_status = "$feature.own";

    const valueExpression = `When( ${wf_status} == 'TES', 'TES', ${wf_status} == 'IRU', 'IRU', 'other' )`;

    var rendererCheck = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      valueExpression: valueExpression,
      uniqueValueInfos: [
        {
          value: "TES", //02F AsBuilt
          symbol: {
            type: "simple-line",
            color: "blue",
            width: "3px",
            style: "solid",
          },
        },
        {
          value: "IRU", // 04F AsBuilt
          symbol: {
            type: "simple-line",
            color: "yellow",
            width: "3px",
            style: "solid",
          },
        },
        {
          value: "other", // 04F AsBuilt
          symbol: {
            type: "simple-line",
            color: "white",
            width: "3px",
            style: "solid",
          },
        },
      ],
    };

    Backhaul.renderer = rendererCheck;
  }, []);
  return null;
}
