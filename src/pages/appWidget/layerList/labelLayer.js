import React from 'react';
import { loadModules, setDefaultOptions } from "esri-loader";
import './css/layerlist.css'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label,

} from "reactstrap";

let isModalOpen = 0

const labelLayer = (
  id,
  layers,
  view,
  south_Layer,
  KHI_Layers,
  north_Layer,
  ISB_Layers,
  central_Layer,
  LHR_Layers
) => {


  if (id === "full-extent KHI") {
    view
      .goTo({
        target: [67.050987, 24.842437],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    south_Layer.visible = true;
    KHI_Layers.visible = true;

    layers.recentDownSouth.visible = true

    if(layers.loginRole.role === 'Admin'){
      north_Layer.visible = false;
      ISB_Layers.visible = false;
  
      central_Layer.visible = false;
      LHR_Layers.visible = false;

      layers.recentDownNorth.visible = false
      layers.recentDownCentral.visible = false
    }
   
  }

  if (id === "full-extent ISB") {
    view
      .goTo({
        target: [73.088438, 33.605487],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    north_Layer.visible = true;
    ISB_Layers.visible = true;

    layers.recentDownNorth.visible = true

    if(layers.loginRole.role === 'Admin'){
      south_Layer.visible = false;
      KHI_Layers.visible = false;
  
      central_Layer.visible = false;
      LHR_Layers.visible = false;

      layers.recentDownSouth.visible = false
      layers.recentDownCentral.visible = false
      
    }

  }

  if (id === "full-extent LHR") {
    view
      .goTo({
        target: [74.385495, 31.479528],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    central_Layer.visible = true;
    LHR_Layers.visible = true;

    layers.recentDownCentral.visible = true
    
    if(layers.loginRole.role === 'Admin'){
      south_Layer.visible = false;
      KHI_Layers.visible = false;
  
      north_Layer.visible = false;
      ISB_Layers.visible = false;

      layers.recentDownSouth.visible = false
      layers.recentDownNorth.visible = false
    }
  
  }

  if (id === "label-Zone") {
    if (layers.southZone.labelsVisible === false) {
      layers.southZone.labelsVisible = true;
    } else {
      layers.southZone.labelsVisible = false;
    }
  }

  if (id === "label-north-Zone") {
    if (layers.northZone.labelsVisible === false) {
      layers.northZone.labelsVisible = true;
    } else {
      layers.northZone.labelsVisible = false;
    }
  }

  if (id === "label-central-Zone") {
    if (layers.centralZone.labelsVisible === false) {
      layers.centralZone.labelsVisible = true;
    } else {
      layers.centralZone.labelsVisible = false;
    }
  }

  if (id === "label-south-pop") {
    if (layers.southPOP.labelsVisible === false) {
      layers.southPOP.labelsVisible = true;
    } else {
      layers.southPOP.labelsVisible = false;
    }
  }

  if (id === "label-north-pop") {
    if (layers.northPOP.labelsVisible === false) {
      layers.northPOP.labelsVisible = true;
    } else {
      layers.northPOP.labelsVisible = false;
    }
  }

  if (id === "label-central-pop") {
    if (layers.centralPOP.labelsVisible === false) {
      layers.centralPOP.labelsVisible = true;
    } else {
      layers.centralPOP.labelsVisible = false;
    }
  }

  if (id === "label-south-DC") {
    if (layers.southDC.labelsVisible === false) {
      layers.southDC.labelsVisible = true;
    } else {
      layers.southDC.labelsVisible = false;
    }
  }

  if (id === "label-north-DC") {
    if (layers.northDC.labelsVisible === false) {
      layers.northDC.labelsVisible = true;
    } else {
      layers.northDC.labelsVisible = false;
    }
  }

  if (id === "label-central-DC") {
    if (layers.centralDC.labelsVisible === false) {
      layers.centralDC.labelsVisible = true;
    } else {
      layers.centralDC.labelsVisible = false;
    }
  }

  if (id === "symbology") {
      styling(layers,view)
  }
  
};

const colorGenerator = function () {
  // return '#' + Math.floor(Math.random() * 1677).toString(16);
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  
  // calculate the sum of the RGB components
  let sum = r + g + b;
  
  // if the sum is less than 382 (i.e. 256 * 1.5), darken the color
  if (sum < 256) {
    let factor = 0.5 + Math.random() * 0.5;
    r *= factor;
    g *= factor;
    b *= factor;
  }
  
  // convert the RGB values to a hex string
  return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
};

const styling = (layers,view) =>{
  let csvLayer = layers.csvLayer
  
  let select = document.createElement("select");

  // add an event listener to the select element
  select.addEventListener("change", (e) => {
    updateRenderer(e, csvLayer);
  });

  // create an option element for each field in the layer
  csvLayer.fields.forEach(function (field) {
    let option = document.createElement("option");
    option.text = field.name;
    select.add(option);
  });

  // add the select element to the DOM
  document.body.appendChild(select);

  view.ui.add(select, 'top-left')
}

const updateRenderer = (e,csvLayer) => {

  var field = e.target.value;
  var uniqueValueInfos = [];

    loadModules([ "esri/renderers/UniqueValueRenderer","esri/symbols/SimpleMarkerSymbol","esri/Color"], 
    { css: false }).then(([UniqueValueRenderer, SimpleMarkerSymbol, Color]) => {

      csvLayer.createQuery();
      csvLayer.queryFeatures().then(function (results) {
        results.features.forEach((e) => {
   
        var attributeValue = e.attributes[field];
        var symbol = new SimpleMarkerSymbol({
          color: new Color(colorGenerator()),
          size: "8px",
          outline: {
            color: new Color("#FFFFFF"),
            width: 1
          }
        });
  
        var uniqueValueInfo = {
          value: attributeValue,
          symbol: symbol
        };
        uniqueValueInfos.push(uniqueValueInfo);
  
        var renderer = new UniqueValueRenderer({
          field: field,
          uniqueValueInfos: uniqueValueInfos
        });
     //   console.log(attributeValue)
        csvLayer.renderer = renderer;

        })

      })
     

    });

 }

export { labelLayer };
