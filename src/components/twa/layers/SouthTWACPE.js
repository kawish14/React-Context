import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../../context/mapContext";

export default function SouthTWACPE(props) {
  let { southCPELayer, northCPELayer, centralCPELayer } =
    useContext(MapContext);

  let view = props.view;

  useEffect(() => {
    var queryExpression =
      "id LIKE 'CIR%' AND alarmstate in (0,1,2,3,4) AND status = 'Active'";

    southCPELayer.definitionExpression = queryExpression;
    northCPELayer.definitionExpression = queryExpression;
    centralCPELayer.definitionExpression = queryExpression;

    let dates = new Date();

    let lastSevenDays = new Date(dates);
    lastSevenDays.toDateString();
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);

    let year = lastSevenDays.getFullYear();

    let month = (date) => {
      const m = date.getMonth() + 1;
      if (m.toString().length === 1) {
        return `0${m}`;
      } else {
        return m;
      }
    };
    let date = ("0" + lastSevenDays.getDate()).slice(-2);

    let complete_date = year + "-" + month(lastSevenDays) + "-" + date;

    const name = "$feature.alarmstate";
    const week = "$feature.lastdowntime";
    const ticketStatus = "$feature.ticketstatus";

    const valueExpression = `When( 
    
            ${name} == 0, 'zero',

            ${name} == 1, 'one',

            ${name} == 2 && ${week} >= '${complete_date}', 'two',

            ${name} == 2 && ${week} <= '${complete_date}', 'two_1',

            ${name} == 3, 'three',
    
            ${name} == 4, 'four',

            5
            )`;

    var rendererCheck = {
      type: "unique-value",
      //field: "alarminfo",
      valueExpression: valueExpression,
      uniqueValueInfos: [
        {
          value: "zero",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "green",
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "one",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "blue",
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "two",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "red",
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "two_1",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: [255, 170, 0],
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "three",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "black",
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "four",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "yellow",
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "5",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "white",
            size: "8px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
      ],
    };

    southCPELayer.renderer = rendererCheck;
    northCPELayer.renderer = rendererCheck;
    centralCPELayer.renderer = rendererCheck;
  }, []);

  return null;
}
