import React, { useContext, useEffect, useState,useCallback } from "react";
import MapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import { Card, CardHeader, CardBody, Badge, Col } from "reactstrap";
import "./notification.css";
import {version} from '../../../url';
import { socket } from "../../../map-items/real-time/socket";
import axios from 'axios'

setDefaultOptions({ version: version })
const allCPE = [];

export default function Notification (props) {
  const context = useContext(MapContext)
  const {graphicLayerLOPDC,graphicLayerLOSiDC, DC_ODB,customer,region} = context.view

  const [downDC, setDownDC] = useState([]);
  const [LOPDC, setLOPDC] = useState([]);

  const [LOSiDcArray, setLOSiDcArray] = useState([]);
  const [LOSiLength, setLOSiLength] = useState(0)

  const empty = (arr) => (arr.length = 0);

  const handleDcDown = useCallback((data) => {
   // console.log(data);
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

  useEffect(() => {
    console.log(LOSiDcArray)
    handleDcDown(LOSiDcArray)
  }, [LOSiLength]);

  useEffect(() =>{
    const placeholders = region.map((region, index) => `'${region}'`).join(',');
    axios.get(`http://gis.tes.com.pk:28881/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ACustomers&maxFeatures=1000000&outputFormat=application%2Fjson&CQL_FILTER=region in (${placeholders})`)
    .then(function (response) {
      // handle success
      allCPE.push(response.data.features)

      socketFun()
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

    window.$(".toggle").click(function () {
      //  console.log("toggling sidebar");
        window.$(".sidebar").toggleClass("active");
      });
      window.$(".cancel").click(function () {
      //  console.log("toggling visibility");
        window.$(this).parent().toggleClass("gone");
      });

      return () =>{
        socket.disconnect();
      }
  },[]);

  const socketFun = () =>{
    const dcIds = [...new Set(allCPE[0].map((customer) => customer.properties.dc_id))];
    socket.on("endpoint", async (data) => {
      if (data.alarmstate == 2 ) {
        let LOS = customer.createQuery();
        customer.queryFeatures(LOS).then(async function(response){
          const updatedDcArray = []
            dcIds.forEach((dcId) => {
              const downPercentage = calculateDownPercentage(response.features, dcId);
              if (downPercentage > 40) {
                let dcDownStatus = {
                  'dc_id': parseInt(dcId),
                  'downPercentage': parseFloat(downPercentage.toFixed(2)),
                  'Status': 'DC Down'
                };
                updatedDcArray.push(dcDownStatus);
              }
            });
            setLOSiDcArray(updatedDcArray);
            setLOSiLength(updatedDcArray.length)

            console.log("LOSiLength:",updatedDcArray.length)
        })
      }
    })
  }

  const calculateDownPercentage = (customers, dcId) => {

    const totalCustomers = allCPE[0].filter((customer) => customer.properties.dc_id === dcId).length;
    const downCustomers = customers.filter((customer) => customer.attributes.dc_id === dcId && customer.attributes.alarmstate == 2).length;
   // console.log(downCustomers,'/',totalCustomers)
    return (downCustomers / totalCustomers) * 100;
  }
  
  const location = (e) =>{
    const {DC_ODB} = context.view
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
               {/*  <div className="losi-count-icon">
                  <i
                    className="fa fa-exclamation-circle losi"
                    aria-hidden="true"
                  ></i>{" "}
                  <span className="losi-count">{downDC.length}</span>
                </div> */}
                Outage{" "}
               {/*  <div className="lop-count-icon">
                  <span className="lop-count">{LOPDC.length}</span>{" "}
                  <i
                    className="fa fa-exclamation-circle lop"
                    aria-hidden="true"
                  ></i>
                </div> */}
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