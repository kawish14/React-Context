import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import {outage,olt,cpeCount} from '../../url'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button 
} from "reactstrap";
import './editor.css'
import axios from "axios";

let sketchViewModel, debouncedRunQuery,sketchGeometry

export default function Editor(props) {
  const context = useContext(MapContext);
  const {customer,loginRole, Outage,Feeder} = context.view
  const editForms = useRef();
  const [display, SetDisplay] = useState('none')
  const [sketchLayer, SetSketchLayer] = useState(null)
  const [ bufferLayer, SetBufferLayer] = useState(null)
  const [geometry, SetGeometry] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [OLT, SetOLT] = useState([])
  const [FSP, SetFSP] = useState([])
  const [selectedFSP, setSelectedFSP] = useState([]);
  const [selectedCableTypes, setSelectedCableTypes] = useState([]);
  const cableTypes = [
    "288F Duct OFC",
    "144F Duct OFC",
    "96F Duct OFC",
    "72F Duct OFC",
    "48F Duct OFC",
    "24F Duct OFC",
    "12F Duct OFC",
    "24F CLT OFC",
    "12F CLT OFC", 
    "04F CLT OFC",
    "02F CLT OFC",
  ];
  const selectedCableTypesText = selectedCableTypes.join(', ');
  const selectedFSPText = selectedFSP.join(', ');

  const [formData, setFormData] = useState({
    cableType: "",
    olt:"",
    fsp:"",
    outageTime: "",
    reolveTime: "",
    landmark:"",
    affetedCPE:"",
    category:"",
    sub_category:"",
    geom:geometry,
    createdUser:loginRole.username,
    createdDate:"",
    region:loginRole.region,
    comment:""

  });

 useEffect(() =>{

  if(loginRole.region === 'South' || loginRole.region === 'North' || loginRole.region === 'Central'){
    axios.get(`http://localhost:2000/olt?region='${loginRole.region}'`)
    .then(response =>{

      SetOLT(response.data)
    })
    .catch((error) => {
      console.error(error);
      // Handle errors here
    });
  }
  else {
    axios.get("http://localhost:2000/olt?regionin('South', 'North', 'Central')")
    .then(response =>{
      SetOLT(response.data)
    })
    .catch((error) => {
      console.error(error);
      // Handle errors here
    })
  }

    loadModules(["esri/layers/GraphicsLayer", "esri/widgets/Expand"], {
      css: false,
    }).then(([GraphicsLayer, Expand]) => {

      SetSketchLayer(new GraphicsLayer({
        listMode: "hide",
      }));
      SetBufferLayer(new GraphicsLayer({
        listMode: "hide",
      }));

     
      let layerListExpand = new Expand({
        expandIconClass: "esri-icon-edit",
        view: props.view,
        content: editForms.current,
        group: "bottom-right",
        expanded: false,
        expandTooltip: "Outage Form",
      });

      customer.when(function(){
        SetDisplay('block')
        props.view.ui.add(layerListExpand, "top-right");
       
      })


    })
 },[])

 useEffect(() =>{

  validateForm();

 },[isFormValid,geometry]);
 
 function formatDateTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const addPoint = (event) =>{
  props.view.map.addMany([sketchLayer,bufferLayer]);
  
  let geom
  sketchLayer.removeAll()
  const geometryType = event.target.value;

  loadModules(
    [
      "esri/widgets/Sketch/SketchViewModel",
      "esri/core/promiseUtils",
      "esri/geometry/geometryEngine",
      "esri/Graphic",
    ],
    { css: false }
  ).then(([SketchViewModel, promiseUtils, geometryEngine, Graphic]) => {

    sketchViewModel = new SketchViewModel({
      layer: sketchLayer,
      creationMode: "update",
      defaultUpdateOptions: {
        tool: "reshape",
        toggleToolOnClick: true,
      },
      view: props.view,
      defaultCreateOptions: { hasZ: false },
    });

    sketchViewModel.create(geometryType);

    sketchViewModel.on("create", (event) => {
      if (event.state === "complete") {
        sketchGeometry = event.graphic.geometry;

        if (sketchGeometry.type === "point") {
          
          sketchLayer.graphics.items[0].symbol = {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "images/olt2.png",
            width: "17px",
            height: "25px"
          };

          sketchLayer.graphics.items.map(e =>{
            geom = `Point(${e.geometry.longitude} ${e.geometry.latitude})`
            SetGeometry(`Point(${e.geometry.longitude} ${e.geometry.latitude})`);

          });
        
        }

        const bufferGeometry = geometryEngine.geodesicBuffer(
          sketchGeometry, // Point geometry
          20, // Buffer distance in meters
          "meters"
        );
        
        findFiber(bufferGeometry)
 
      }
    
    });

    sketchViewModel.on("update", (event) => {
      if (
        event.toolEventInfo &&
        (event.toolEventInfo.type.includes("scale-stop") ||
          event.toolEventInfo.type.includes("reshape-stop") ||
          event.toolEventInfo.type === "move-stop")
      ) {
        sketchGeometry = event.graphics[0].geometry;
        
        const bufferGeometry = geometryEngine.geodesicBuffer(
          sketchGeometry, // Point geometry
          20, // Buffer distance in meters
          "meters"
        );
        
        findFiber(bufferGeometry)
      }
    })
  
  })

  return geom
}

const findFiber = (bufferGeometry) =>{

  const query = Feeder.createQuery();
  query.geometry = bufferGeometry

  Feeder.queryFeatures(query).then(function(result) {
    result.features.forEach(function(feature) {
      console.log(feature.attributes)
    })

  })
}

const cableTypeFun = (event) =>{

  const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
  setSelectedCableTypes(selectedOptions);
 
}

const OLTSelect = (event) =>{
  formData.olt = event.target.value
  setFormData(formData);

  axios.get(`${olt}?olt='${event.target.value}'`)
  .then(res =>{

    let fsp = res.data;
    fsp.sort((a, b) => {
      const aParts = a.nce_fsp.split("/").map(Number); // Convert parts to numbers
      const bParts = b.nce_fsp.split("/").map(Number);

      // Compare the numeric values of the parts
      for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
        if (aParts[i] !== bParts[i]) {
          return aParts[i] - bParts[i];
        }
      }

      // If parts are equal up to this point, use length to break the tie
      return aParts.length - bParts.length;
    });

    SetFSP(fsp)
  })
  .catch((error) => {
    console.error(error);
    // Handle errors here
  });
}

const FSPSelect = (event) =>{
  const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
  setSelectedFSP(selectedOptions);

  axios.post(`${cpeCount}`, {olt:`${formData.olt}`, fsp:selectedOptions})
  .then(res=>{
    if(res.data.message !== "Fetch data successfully"){
      alert(res.data.message)
    }
    else{
    
     formData.affetedCPE = parseInt(res.data.count)
     setFormData(formData)
    }
    
  })
 
}

 const handleInputChange = (event) => {
  const { name, value } = event.target;

  setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
  }));
};

const categoryFun = (event) =>{
  formData.category = event.target.value;
  setFormData(formData);

  const subCategoriesMap = {
    'Force Majeure': ['Animal Attacks (e.g mice & squirrel)', 'Weather Conditions (e.g rain, extreme heat)',
                      'Network Element Degradation','Hazards like Fire, Flood and Earthquake'],
    'Vandalism': ['Fire attacks', 'Theft','Malice Cut','Resident Activity','Pedestrian Activity','Vehicle Activity'],
    'Construction':['Road Construction','Sewage Construction','Building Construction'],
    'ROW Authority': ['DHA', 'Cantonment', 'KMC Karachi', 'CDA Islamabad', 'LESCO Lahore', 'KE Karachi',
                    'TMA Lahore','PHA Lahore', 'Other Local Authority'],
    'PAR': ['Joint Replacement','Network Maintenance Activities', 'OFC Termination']
  }

  setSubCategories(subCategoriesMap[event.target.value] || []);

  setShowCommentInput(event.target.value === "PAR");
}

const sub_categoryFun = (event) =>{
  formData.sub_category = event.target.value;
  setFormData(formData);
}

const validateForm = () => {
  const requiredFields = ["cableType", "dcDown", "outageTime", "reolveTime", "landmark", "affetedCPE", "outageCause"];
  const areAllFieldsFilled = requiredFields.every(field => formData[field] !== "");
  if(geometry !== null && areAllFieldsFilled) {
    setIsFormValid(areAllFieldsFilled);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  formData.geom = geometry;
  formData.affetedCPE = parseInt(formData.affetedCPE)
  formData.cableType = selectedCableTypesText
  formData.fsp = selectedFSPText
  const currentDate = new Date();
  const formattedDate = formatDateTime(currentDate);
  formData.createdDate = formattedDate

  axios
    .post(outage, formData)
    .then((response) => {

      alert(response.data.message)
      if(response.data.message === "Data inserted successfully"){
        sketchLayer.removeAll()
        setFormData({
          cableType: "",
          olt:"",
          fsp:"",
          outageTime: "",
          reolveTime: "",
          landmark:"",
          affetedCPE:"",
          category:"",
          sub_category:"",
          geom:geometry,
          createdUser:loginRole.username,
          region:loginRole.region,
          createdDate:new Date().toISOString().replace("T", " ").replace("Z", ""),
          comment:""
        });
        SetGeometry(null);
        setIsFormValid(false)
        setShowCommentInput(false);
        setSubCategories([]);
        setSelectedCableTypes([])
        setSelectedFSP([])

        Outage.refresh()
      }
     
    })
    .catch((error) => {
      console.error("Error submitting data:", error);
      // Handle errors here
    });
};

  return (
    <div ref={editForms} className="geometry-add" style={{ display: display }}>
      <div className="addpoint">
        <button
          className="Edit-Point"
          id="point-geometry-button"
          value="point"
          title="point"
          onClick={addPoint}
        >
          <i class="fa-solid fa-map-location-dot"></i>Add Point
        </button>
      </div>

      <div className="form">
        <label>Cable Type/Capacity</label>
        <p className="cableTypes">{selectedCableTypesText}</p>
        <select
          className="cableTypesDropDown"
          multiple
          onChange={cableTypeFun}
          value={selectedCableTypes}
        >
          <option disabled value="">
            select cable
          </option>
          {cableTypes.map((cable, index) => {
            return (
              <option key={index} value={cable}>
                {cable}
              </option>
            );
          })}
        </select>
        <label>Select OLT</label>
        <select className="olt" onChange={OLTSelect} value={formData.olt}>
          <option disabled value="">
            select olt
          </option>
          {OLT.map((data, index) => {
            return (
              <option key={index} value={data.olt}>
                {data.olt}
              </option>
            );
          })}
        </select>
        <p className="fspSelect">{selectedFSPText}</p>
        <label>Select FSP</label>
        <select
          className="fsp"
          multiple
          onChange={FSPSelect}
          value={selectedFSP}
        >
          <option disabled value="">
            select fsp
          </option>
          {FSP.map((data, index) => {
            return (
              <option key={index} value={data.nce_fsp}>
                {data.nce_fsp}
              </option>
            );
          })}
        </select>

        <label>Affected Customers</label>
        <div>
          <input
            type="text"
            name="affetedCPE"
            value={formData.affetedCPE}
            readonly
          />
        </div>

        <label>Outage Time</label>
        <input
          type="datetime-local"
          name="outageTime"
          value={formData.outageTime}
          onChange={handleInputChange}
        />
        <label>Resolve Time</label>
        <input
          type="datetime-local"
          name="reolveTime"
          value={formData.reolveTime}
          onChange={handleInputChange}
        />
        <label>Category (Outage Reason)</label>
        <select onChange={categoryFun} value={formData.category}>
          <option disabled value="">
            select category
          </option>
          <option value="Force Majeure">Force Majeure</option>
          <option value="Vandalism">Vandalism</option>
          <option value="Construction">Construction</option>
          <option value="ROW Authority">ROW Authority</option>
          <option value="PAR">PAR</option>
        </select>
        <label>Sub Category (Outage Reason)</label>
        <select onChange={sub_categoryFun} value={formData.sub_category}>
          <option disabled value="">
            select sub category
          </option>
          {subCategories.map((sub_category, index) => {
            return (
              <option value={sub_category} key={index}>
                {sub_category}
              </option>
            );
          })}
        </select>
        <label>Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
        />
        {showCommentInput ? (
          <>
            <label>Comment</label>
            <textarea
              className="comment"
              name="comment"
              placeholder="e.g. civil work by other operator"
              value={formData.comment}
              onChange={handleInputChange}
            />
          </>
        ) : null}
        <br /> <br />
        <button type="button" className="formSubmit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
