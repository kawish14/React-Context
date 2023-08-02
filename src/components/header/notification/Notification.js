import React, { useContext, useEffect, useState,useCallback } from "react";
import MapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import { Card, CardHeader, CardBody, Badge, Col } from "reactstrap";
import "./notification.css";
import {version} from '../../../url';
import {socketData} from './socketData'

setDefaultOptions({ version: version })
export default function Notification (props) {
  const context = useContext(MapContext)
  const {graphicLayerLOPDC,graphicLayerLOSiDC, DC_ODB} = context.view
  const dcOutage = context.dcOutage

  const [downDC, setDownDC] = useState([])
  const [LOPDC, setLOPDC] = useState([])

  const handleDcDown = useCallback((data) => {
    console.log(data);
    let query = DC_ODB.createQuery();
  
    // Create an array of promises to fetch features for each data element
    const fetchFeaturePromises = data.map((element) => DC_ODB.queryFeatures(query).then((result) => {
      const features = result.features;
      return features.find((e) => e.attributes.id === element.dc_id);
    }));
  
    // Wait for all promises to resolve
    Promise.all(fetchFeaturePromises).then((newFeatures) => {
      // Filter the new features to exclude null values (features not found)
      const filteredNewFeatures = newFeatures.filter(Boolean);
  
      // Filter the current downDC state to only keep items that are present in the data array
      setDownDC((prevDcDown) => prevDcDown.filter((item) => data.some((element) => element.dc_id === item.attributes.id)));
  
      // Add new features to the downDC state (if they are not already present)
      filteredNewFeatures.forEach((newFeature) => {
        if (!downDC.some((item) => item.attributes.id === newFeature.attributes.id)) {
          setDownDC((prevDcDown) => [...prevDcDown, newFeature]);
          addDownGraphic(newFeature)
        }
        addDownGraphic(newFeature)
        
      });
    });
  }, [downDC]);

  const handleDcUP = useCallback((data) => {
    console.log(data);
    let query = DC_ODB.createQuery();
  
    // Create an array of promises to fetch features for each data element
    const fetchFeaturePromises = data.map((element) => DC_ODB.queryFeatures(query).then((result) => {
      const features = result.features;
      return features.find((e) => e.attributes.id === element.dc_id);
    }));
  
    // Wait for all promises to resolve
    Promise.all(fetchFeaturePromises).then((newFeatures) => {
      // Filter the new features to exclude null values (features not found)
      const filteredNewFeatures = newFeatures.filter(Boolean);
  
      // Filter the current downDC state to only keep items that are present in the data array
      setLOPDC((prevDcDown) => prevDcDown.filter((item) => data.some((element) => element.dc_id === item.attributes.id)));
  
      // Add new features to the downDC state (if they are not already present)
      filteredNewFeatures.forEach((newFeature) => {
        if (!LOPDC.some((item) => item.attributes.id === newFeature.attributes.id)) {
          setLOPDC((prevDcDown) => [...prevDcDown, newFeature]);
          addLOPGraphic(newFeature)
        }
        addLOPGraphic(newFeature)
      });
    });
  }, [LOPDC]);

  const addDownGraphic = (e) =>{
    graphicLayerLOSiDC.graphics.removeAll();
    loadModules(["esri/Graphic","esri/layers/GraphicsLayer","esri/geometry/Point",],
    { css: false }).then(async ([Graphic, GraphicsLayer, Point]) => {
      let point = {
        type: "point",
        longitude: e.geometry.longitude,
        latitude: e.geometry.latitude,
      };

      let markerSymbol = {
        type: "picture-marker",
        url: "images/down-arrow-red.gif",
        width: "35px",
        height: "40px",
        xoffset: 0,
        yoffset: 12,
      };

      let attr = {
        name:e.attributes.name,
        id:e.attributes.id,
        pop:e.attributes.pop_id
      }
      
      let pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes:attr
      });

      graphicLayerLOSiDC.graphics.add(pointGraphic);
    })
  }

  const addLOPGraphic = (e) =>{
    graphicLayerLOPDC.graphics.removeAll();
    loadModules(["esri/Graphic","esri/layers/GraphicsLayer","esri/geometry/Point",],
    { css: false }).then(async ([Graphic, GraphicsLayer, Point]) => {
      let point = {
        type: "point",
        longitude: e.geometry.longitude,
        latitude: e.geometry.latitude,
      };

      let markerSymbol = {
        type: "picture-marker",
        url: "images/down-arrow-yellow.gif",
        width: "35px",
        height: "40px",
        xoffset: 0,
        yoffset: 12,
      };

      let pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
      });

      graphicLayerLOPDC.graphics.add(pointGraphic);
    })
  }
  useEffect(() => {
   
    if(Object.keys(dcOutage).length > 0){
      handleDcDown(dcOutage.dcDown)
      handleDcUP(dcOutage.dcLOP)
    }
  }, [dcOutage]);

  useEffect(() =>{

    socketData().then((res) => {
      handleDcDown(res.dcDown)
      handleDcUP(res.dcLOP)
    });

    window.$(".toggle").click(function () {
      //  console.log("toggling sidebar");
        window.$(".sidebar").toggleClass("active");
      });
      window.$(".cancel").click(function () {
      //  console.log("toggling visibility");
        window.$(this).parent().toggleClass("gone");
      });
  },[]);

  const location = (e) =>{
    const dataId = e.currentTarget.getAttribute("data-id");
    const queryParamsDC = DC_ODB.createQuery();

     queryParamsDC.where = `id in (${dataId})`;

    DC_ODB.queryFeatures(queryParamsDC).then(function (result) {
      props.view.goTo({
        center: [
          result.features[0].geometry.longitude,
          result.features[0].geometry.latitude,
        ],
        zoom: 17,
      });
    }); 
  }

    return (
      <>
        <div className="toggle">
          {downDC.length > 0 || LOPDC.length > 0 ? (
            <span className="notification-count">
              {downDC.length + LOPDC.length}
            </span>
          ) : null}{" "}
          <i class="fa-solid fa-bell"></i>
        </div>
        {downDC.length > 0 || LOPDC.length > 0 ? (
          <div className="sidebar">
            <Card className="DC-Card">
              <CardHeader className="DC-Card-Header">
                <div className="losi-count-icon">
                  <i
                    className="fa fa-exclamation-circle losi"
                    aria-hidden="true"
                  ></i>{" "}
                  <span className="losi-count">{downDC.length}</span>
                </div>
                Outage{" "}
                <div className="lop-count-icon">
                  <span className="lop-count">{LOPDC.length}</span>{" "}
                  <i
                    className="fa fa-exclamation-circle lop"
                    aria-hidden="true"
                  ></i>
                </div>
              </CardHeader>
              <CardBody className="DC-Card-Body">
                {downDC.length > 0 && (
                  <>
                    {downDC.map((feature, index) => (
                      <div
                        key={feature.attributes.id}
                        className="cardbody-div"
                        data-id={`${feature.attributes.id}`}
                        onClick={location}
                      >
                        <div className="cardbody-key">
                          <strong>
                            <div className="dc-id">
                              {feature.attributes.id}{" "}
                              <span className="splitter_id">{feature.attributes.splitter_id}</span>
                              <span className="los">(LOSi)</span>
                            </div>
                          </strong>

                          {/********************* DC/ODB Name & Address ******************/}
                          <p className="DC-name-address">
                            <strong>{feature.attributes.name} </strong>
                            <br />

                            <span className="DC-address">
                              {`Plot # ${feature.attributes.plot}, ${feature.attributes.street},
                            ${feature.attributes.sub_area}, ${feature.attributes.area}`}
                            </span>
                          </p>
                        </div>
                        <div className="icon">
                          <i
                            class="fa fa-exclamation-circle"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {LOPDC.length > 0 && (
                  <>
                    {LOPDC.map((feature, index) => (
                      <div
                        key={feature.attributes.id}
                        className="cardbody-div"
                        data-id={`${feature.attributes.id}`}
                        onClick={location}
                      >
                        <div className="cardbody-key">
                          <strong>
                            <div className="dc-id">
                              {feature.attributes.id}{" "}
                              <span className="splitter_id">{feature.attributes.splitter_id}</span>
                              <span className="lop">(LOP)</span>
                            </div>
                          </strong>

                          {/********************* DC/ODB Name & Address ******************/}
                          <p className="DC-name-address">
                            <strong>{feature.attributes.name} </strong>
                            <br />

                            <span className="DC-address">
                              {`Plot # ${feature.attributes.plot}, ${feature.attributes.street},
                            ${feature.attributes.sub_area}, ${feature.attributes.area}`}
                            </span>
                          </p>
                        </div>
                        <div className="icon-lop">
                          <i
                            class="fa fa-exclamation-circle"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        ) : null}
      </>
    );
  
}