import React, { useContext, useEffect, useState,useCallback, useRef } from "react";
import MapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button 
} from "reactstrap";

import './csv.css'

import {version} from '../../../url'
setDefaultOptions({ version: version })

let csvLayer;

export default function CSV(props) {

  let context = useContext(MapContext);

  const [isModalOpen, UpdateIsModalOpen] = useState(false);
  let [selectedFile, updateSelectedFile] = useState(null);

  const [url, updateURL] = useState()

  let toggleModal = () => {

    UpdateIsModalOpen(!isModalOpen)

    if(isModalOpen){
      props.fileName(null)
    }

/*     var colors = [];
    while (colors.length < 10) {
        do {
            var color = Math.floor((Math.random()*1000000)+1);
        }
         while (colors.indexOf(color) >= 0);
        colors.push("#" + ("000000" + color.toString(16)).slice(-6));
    }
    console.log(colors); */
  }

  useEffect(() => {

    toggleModal()

  },[])

  let fileUpload = (e) => {

    const url = URL.createObjectURL(e.target.files[0]);

    updateURL(url)

    if (csvLayer) {
      props.view.map.remove(csvLayer);
    }

    if(e.target.files[0]){

      let name = e.target.files[0].name;
      let extension = name.substring(name.lastIndexOf(".") + 1); // OR name.split('.').pop();
  
      if (extension !== "csv") {
        alert("File is not supportive");
        updateSelectedFile(null);
      } else {
        updateSelectedFile(e.target.files[0]);
      }

    }

  };

  let fileSubmit = () =>{

    let view = props.view;

    loadModules(["esri/layers/CSVLayer"], { css: false }).then(([CSVLayer]) => {
      csvLayer = new CSVLayer({
        title: "CSV Layer",
        url: url,
        refreshInterval: 0.2,
        renderer: {
          type: "simple",
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
      });

      if (csvLayer) {
        view.map.remove(csvLayer);
      }

      view.map.add(csvLayer);

      csvLayer.when(function(){
        props.fileName(null)
      })
      
    });

    view.on("click", function (event) {
      view.hitTest(event).then(function (response) {
        if (response.results.length) {
          response.results.map((e) => {
            if (e.graphic.layer) {
              if (e.graphic.layer.title === "CSV Layer") {
                if (e.graphic.attributes) {
                  let popupTemplate = {
                    title: "CSV Layer",
                    content: [
                      {
                        type: "fields",
                        fieldInfos: [],
                      },
                    ],
                  };

                  Object.keys(e.graphic.attributes).map((e) => {
                    popupTemplate.content[0].fieldInfos.push({
                      fieldName: e,
                    });
                  });

                  csvLayer.popupTemplate = popupTemplate;
                }
              }
            }
          });
        }
      });
    });

  }

  return (

          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader>Add CSV File</ModalHeader>
            <ModalBody>
            <br />
            <input
              type="file"
              id="file-input"
              name="files[]"
              accept="text/csv"
              onChange={(e) => fileUpload(e)}
            />

            <br />
            <br />

            <p style={{fontSize: '0.8em', color:'#b4b417'}}>
              This widget is compatible for point layer so, Keep note that CSV file should contain two fields 
              with alias of Latitude and Longitude.
            </p>

            <br/>

            <Button disabled={!selectedFile} color="primary" onClick={(e) => fileSubmit(e)} >OK</Button>
            </ModalBody>
          </Modal>
    
  );
}
