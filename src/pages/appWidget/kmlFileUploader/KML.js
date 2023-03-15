import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import MapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import axios from "axios";
import "./kml.css";
import socketIOClient from "socket.io-client";

import {version} from '../../../url'
setDefaultOptions({ version: version })

const ENDPOINT = "http://gis.tes.com.pk:5001";

const socket = socketIOClient(ENDPOINT);

export default function KML(props) {
  let context = useContext(MapContext);
  let graphicLayerKML = context.view.graphicLayerKML;

  let [selectedFile, updateSelectedFile] = useState(null);

  const [isModalOpen, UpdateIsModalOpen] = useState(false);

  const [data, UpdateData] = useState(null)
  const [error, setError] = useState("");

  const pointValues = []
  const polylineValues = []
  const polygonValues = []

  const colors= []


  let empty = (arr) => (arr.length = 0);

  let toggleModal = () => {
    UpdateIsModalOpen(!isModalOpen);

    if (isModalOpen) {
      props.fileName(null);
    }

  };
  

  useEffect(() => {

    toggleModal();


    if (data) {

      empty(colors)
      empty(pointValues)
      empty(polylineValues)
      empty(polygonValues)
      
      data.map((x, y) => {

        graphicLayerKML.graphics.removeAll();

        pointValues.push(x.properties.styleHash);
        polylineValues.push(x.properties.styleHash);
        polygonValues.push(x.properties.styleHash);

        if (x.geometry.type === "Point") {
          loadModules(
            [
              "esri/layers/GeoJSONLayer",
              "esri/Graphic",
              "esri/layers/GraphicsLayer",
              "esri/PopupTemplate",
            ],
            { css: false }
          ).then(([GeoJSONLayer, Graphic, GraphicsLayer, PopupTemplate]) => {
            let point = {
              type: "point",
              longitude: x.geometry.coordinates[0],
              latitude: x.geometry.coordinates[1],
            };

            let markerSymbol = {
              type: "simple-marker",
              style: "circle",
             // color: `${colors[y]}`,
              size: "8px",
              outline: {
                color: [255, 255, 255, 1],
                width: 0.4,
              },
            };
  
            pointValues.map(e=>{
              if(x.properties.styleHash === e) markerSymbol.color = e  
            })

            let pointGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol,
              attributes: x.properties,
              sourceLayer: graphicLayerKML,
            });

            let popupTemplate = {
              title: "KML Layer",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "name",
                      label: "Name",
                    },
                  ],
                },
              ],
            };

            pointGraphic.popupTemplate = popupTemplate;
            graphicLayerKML.graphics.add(pointGraphic);

            let textSymbol = {
              type: "text",
              color: "black",
              haloColor: "orange",
              haloSize: 1,
              text: x.properties.name,
              xoffset: 0,
              yoffset: 12,
              font: {
                family: "Playfair Display",
                size: 8,
                weight: "bold",
              },
              labelPlacement: "above-center",
            };

            let graphicLabel = new Graphic({
              geometry: pointGraphic.geometry,
              symbol: textSymbol,
              labelPlacement: "above-along",
            });

            graphicLayerKML.graphics.add(graphicLabel);
            // props.view.graphics.add(graphicLabel);
          });
        }

        if (x.geometry.type === "LineString") {
          let arr = [];

          loadModules(
            ["esri/Graphic", "esri/layers/GraphicsLayer", "esri/PopupTemplate"],
            { css: false }
          ).then(([Graphic, GraphicsLayer, PopupTemplate]) => {
            x.geometry.coordinates.map((i) => {
              arr.push([i[0], i[1]]);
            });

            const polyline = {
              type: "polyline",
              paths: arr,
              spatialReference: { wkid: 4326 },
            };

            const lineSymbol = {
              type: "simple-line",
              //color: [247, 25, 8],
              width: 2,
            };

            polylineValues.map(e=>{
              if(x.properties.styleHash === e) lineSymbol.color = e  
            })

            let polylineGraphic = new Graphic({
              geometry: polyline,
              symbol: lineSymbol,
              attributes: x.properties,
              //sourceLayer: graphicLayer,
            });

            let popupTemplate = {
              title: "KML Layer",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "name",
                      label: "Name",
                    },
                  ],
                },
              ],
            };

            polylineGraphic.popupTemplate = popupTemplate;
            // props.view.graphics.add(polylineGraphic)
            graphicLayerKML.graphics.add(polylineGraphic);
          });
        }

        if (x.geometry.type === "Polygon") {
          let arr = [];

          loadModules(
            ["esri/Graphic", "esri/layers/GraphicsLayer", "esri/PopupTemplate"],
            { css: false }
          ).then(([Graphic, GraphicsLayer, PopupTemplate]) => {
            x.geometry.coordinates.map((res) => {
              // arr.push([i[0], i[1]]);
              res.map((i) => {
                arr.push([i[0], i[1]]);
              });
            });

            const polygon = {
              type: "polygon",
              rings: arr,
              spatialReference: { wkid: 4326 },
            };

            const polygonSymbol = {
              type: "simple-fill",
              //color: [200, 133, 68, 0.7],
              style: "solid",
              outline: {
                color: "white",
                width: 0.5,
              },
            };

            polygonValues.map(e=>{
              if(x.properties.styleHash === e)  polygonSymbol.color = e  
            })

            let polygonGraphic = new Graphic({
              geometry: polygon,
              symbol: polygonSymbol,
              attributes: x.properties,
            });

            let popupTemplate = {
              title: "KML Layer",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "name",
                      label: "Name",
                    },
                    /*  {
                    fieldName: "styleHash",
                    label: "styleHash",
                  },  */
                  ],
                },
              ],
            };

            polygonGraphic.popupTemplate = popupTemplate;
            graphicLayerKML.graphics.add(polygonGraphic);

              let labelPolygon = {
                type: "text",
                color: "black",
                haloColor: "orange",
                haloSize: 1,
                text: x.properties.name,
                xoffset: 0,
                yoffset: 12,
                font: {
                  family: "Playfair Display",
                  size: 8,
                  weight: "bold",
                },
                labelPlacement: "above-center",
              };

              let point = {
                type: "point",
                longitude: polygonGraphic.geometry.centroid.longitude
                ,
                latitude: polygonGraphic.geometry.centroid.latitude,
              };
              
              let pointGraphic = new Graphic({
                geometry: point,
                sourceLayer: graphicLayerKML,

                });

                let graphicLabel = new Graphic({
                  geometry: pointGraphic.geometry,
                  symbol: labelPolygon,
                  labelPlacement: "above-along",
                });

                props.view.watch(["stationary"], function () {     
                  
                  let scale = Math.round(props.view.scale * 1) / 1
                  
                  if (scale < 36114) {
      
                    graphicLayerKML.graphics.add(graphicLabel);
      
                  } if (scale > 36114) {
                  
                    graphicLayerKML.graphics.remove(graphicLabel);
                  }
      
              });
             
  
              
          });
        }
    
      });

      graphicLayerKML.listMode = "show"
    }
    
   
     while (colors.length < 50) {
      do {
        var color = Math.floor(Math.random() * 1000000 + 1);
      } while (colors.indexOf(color) >= 0);
      colors.push("#" + ("000000" + color.toString(16)).slice(-6));
    }  

  
  }, [data]);


  let onClickHandler = async () => {
    graphicLayerKML.graphics.removeAll();

    const data = new FormData();
    data.append("file", selectedFile);

    try {
      const response = await axios.post("http://gis.tes.com.pk:5001/upload", data);

      UpdateData(response.data.features);

    } catch (error) {
      setError(error.message);
    }

    UpdateIsModalOpen(!isModalOpen);
    props.fileName(null);

    /*     axios
      .post("http://gis.tes.com.pk:5001/upload", data, {
        // receive two parameter endpoint url ,form data
      })
      .then((res) => {
       
        console.log(res.data.features)
      }); */
  };

  let onChangeHandler = (event) => {
    // updateSelectedFile(event.target.files[0])
    if (event.target.files[0]) {
      let name = event.target.files[0].name;

      let extension = name.substring(name.lastIndexOf(".") + 1); // OR name.split('.').pop();
     
      if (extension !== "kml") {
        alert("File is not supportive");
        updateSelectedFile(null);
      } else {
        updateSelectedFile(event.target.files[0]);
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader>Add KML File</ModalHeader>
      <ModalBody>
        <input
          type="file"
          name="file"
          accept=".kml"
          onChange={(e) => onChangeHandler(e)}
        />
        <br />
        <br />

        <p style={{ fontSize: "0.8em", color: "#b4b417" }}>
          The file with .KML extension is supported to reflect on the map.
        </p>

        <br />

        <Button
          disabled={!selectedFile}
          color="primary"
          onClick={(e) => onClickHandler(e)}
        >
          Upload
        </Button>
      </ModalBody>
    </Modal>
  );
}
