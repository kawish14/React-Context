import React, {useContext, useState, useEffect } from "react";
import MapContext from "../context/mapContext";
import { loadModules, setDefaultOptions } from 'esri-loader';
import socketIOClient from "socket.io-client";
import {ENDPOINT} from '../url'

import {version} from '../url'
setDefaultOptions({ version: version })

function Tracking (props) {

  let context = useContext(MapContext);

  let graphicLayer = context.view.graphicLayer;

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("tracking", async (data) => {
      props.searchUpdateFun(data);

      await data.map((e) => {
        graphicLayer.graphics.removeAll();
        // props.view.graphics.removeAll();

        loadModules(
          ["esri/Graphic", "esri/layers/GraphicsLayer", "esri/PopupTemplate"],
          { css: false }
        ).then(([Graphic, GraphicsLayer, PopupTemplate]) => {
          let vehicleAttributes = {
            Ignition_On_Off: e.Ignition_On_Off,
            Speed: e.Speed,
            vehicle_model: e.vehicle_model,
            Location: e.Location,
            Tracker_Time: e.Tracker_Time,
            vehicle_make: e.vehicle_make,
            engine_no: e.engine_no,
            reg_no: e.reg_no,
          };

          if (
            e.vehicle_model === "TRUCK" ||
            e.vehicle_model === "SHEHZORE" ||
            e.vehicle_model === "FOTON" ||
            e.vehicle_model === "CARRIER" ||
            e.vehicle_model === "FORLAND" ||
            e.vehicle_model === "MEGA CARRY"
          ) {
            if (e.Ignition_On_Off === "OFF") {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Truck_OFF.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              //props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            } else {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Truck_ON.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              //props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            }
          } else if (e.vehicle_model === "HIACE") {
            if (e.Ignition_On_Off === "OFF") {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Hiace_OFF.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              // props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            } else {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Hiace_ON.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              // props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            }
          } else if (
            e.vehicle_model === "BOLAN" ||
            e.vehicle_model === "RAVI"
          ) {
            if (e.Ignition_On_Off === "OFF") {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Bolan_OFF.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              // props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            } else {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Bolan_ON.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              // props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            }
          } else {
            if (e.Ignition_On_Off === "OFF") {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Car_OFF.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              // props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            } else {
              let point = {
                type: "point",
                longitude: e.Longitude,
                latitude: e.Latitude,
              };

              let markerSymbol = {
                type: "picture-marker",
                url: "images/tracking/Car_ON.png",
                color: "red",
                width: "17px",
                height: "17px",
              };

              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: vehicleAttributes,
                sourceLayer: graphicLayer,
              });

              pointGraphic.popupTemplate = {
                title: `Vehicle Information`,
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "reg_no",
                        label: "Registration No.",
                      },
                      {
                        fieldName: "Ignition_On_Off",
                        label: "Ignition",
                      },
                      {
                        fieldName: "vehicle_model",
                        label: "Model",
                      },
                      {
                        fieldName: "Speed",
                        label: "Speed",
                        format: {
                          digitSeparator: true,
                          places: 2,
                        },
                      },
                      {
                        fieldName: "Location",
                        label: "Location",
                      },
                    ],
                  },
                ],
              };

              // props.view.graphics.add(pointGraphic);
              graphicLayer.graphics.add(pointGraphic);
            }
          }
        });
      });
    });

    return () => socket.disconnect();
  }, []);

    return null
  
  };

export default Tracking