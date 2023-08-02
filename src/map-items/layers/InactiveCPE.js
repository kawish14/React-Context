import React, { useContext, useEffect, useState } from "react";
import MapContext from "../../context/mapContext";

export default function InactiveCPE(props) {
  let context = useContext(MapContext);

  useEffect(() => {
    let InactiveCPE = context.view.InactiveCPE;

    let symbol = {
      type: "simple-marker",
      size: 6,
      color: "teal",
      outline: {
        color: "white",
        width: 0.5,
      },
    };

    const render = {
      type: "simple",
      symbol: symbol,
    };

    InactiveCPE.renderer = render;

    InactiveCPE.featureReduction = {
      type: "cluster",
      clusterMinSize: 16.5,

      labelingInfo: [
        {
          deconflictionStrategy: "none",
          labelExpressionInfo: {
            expression: "Text($feature.cluster_count, '#,###')",
          },
          symbol: {
            type: "text",
            color: "white",
            font: {
              family: "Noto Sans",
              size: "12px",
            },
          },
          labelPlacement: "center-center",
        },
      ],
      // information to display when the user clicks a cluster
      popupTemplate: {
        title: "Cluster Summary",
        content: "This cluster represents <b>{cluster_count}</b> features.",
        fieldInfos: [
          {
            fieldName: "cluster_count",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
        ],
      },
    };
  },[]);
  return null;
}
