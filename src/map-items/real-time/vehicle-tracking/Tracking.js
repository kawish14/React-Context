import React, { useContext, useState, useEffect } from "react";
import MapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import { socket } from "../socket";
import { version } from "../../../url";

setDefaultOptions({ version: version });

export default function Tracking(props) {
  let context = useContext(MapContext);
  let {graphicLayer,vehicleLayer} = context.view;

  useEffect(() => {
    socket.on("tracking", async (data) => {
        
    props.searchUpdateFun(data);
      featureLayer(data)
      await data.map((e) => {
        let vehicleAttributes = {
          Ignition_On_Off: e.Ignition_On_Off,
          Speed: e.Speed,
          vehicle_model: e.vehicle_model,
          Location: e.Location,
          Tracker_Time: e.Tracker_Time,
          vehicle_make: e.vehicle_make,
          engine_no: e.engine_no,
          reg_no: e.reg_no,
          Longitude:e.Longitude,
          Latitude:e.Latitude
        };

      //  console.log(vehicleAttributes)

        updateVehicle(vehicleAttributes);

      });
    });

    return () =>{
      socket.disconnect();
    }
  }, []);

  const updateVehicle = (vehicleAttributes) => {

    graphicLayer.graphics.forEach(existingGraphic => {
        if(existingGraphic.attributes && existingGraphic.attributes.reg_no === vehicleAttributes.reg_no){
            graphicLayer.remove(existingGraphic)
        }
    });
    loadModules(["esri/Graphic"], { css: false }).then(([Graphic]) => {
      
      if (
        vehicleAttributes.vehicle_model === "TRUCK" ||
        vehicleAttributes.vehicle_model === "SHEHZORE" ||
        vehicleAttributes.vehicle_model === "FOTON" ||
        vehicleAttributes.vehicle_model === "CARRIER" ||
        vehicleAttributes.vehicle_model === "FORLAND" ||
        vehicleAttributes.vehicle_model === "MEGA CARRY"
      ) {
        if (vehicleAttributes.Ignition_On_Off === "OFF") {
          let point = {
            type: "point",
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
        }
        else{
            let point = {
                type: "point",
                longitude: vehicleAttributes.Longitude,
                latitude: vehicleAttributes.Latitude,
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
      }

      else if (
        vehicleAttributes.vehicle_model === "HIACE"
        ) {
        if (vehicleAttributes.Ignition_On_Off === "OFF") {
          let point = {
            type: "point",
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
      }

      else if (
        vehicleAttributes.vehicle_model === "BOLAN" ||
        vehicleAttributes.vehicle_model === "RAVI"
      ) {
        if (vehicleAttributes.Ignition_On_Off === "OFF") {
          let point = {
            type: "point",
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
      }

      else {
        if (vehicleAttributes.Ignition_On_Off === "OFF") {
          let point = {
            type: "point",
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
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
    
  };

  const featureLayer = (data) =>{
    vehicleLayer.source = []

    loadModules(["esri/Graphic"], { css: false }).then(([Graphic]) => {
      let graphic = data.map(e =>{

        let vehicleAttributes = {
          Ignition_On_Off: e.Ignition_On_Off,
          Speed: e.Speed,
          vehicle_model: e.vehicle_model,
          Location: e.Location,
          Tracker_Time: e.Tracker_Time,
          vehicle_make: e.vehicle_make,
          engine_no: e.engine_no,
          reg_no: e.reg_no,
          Longitude:e.Longitude,
          Latitude:e.Latitude
        };
  
        let point = {
          type: "point",
          longitude: vehicleAttributes.Longitude,
          latitude: vehicleAttributes.Latitude,
        };
  
        return new Graphic({
          geometry: point,
          attributes: vehicleAttributes,
        });
  
      })

      vehicleLayer.source = graphic

    });   
  }

  return null;
}
