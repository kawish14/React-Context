import React, { useContext, useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Badge, Col } from "reactstrap";
import MapContext from "../context/mapContext";
import { loadModules, setDefaultOptions } from 'esri-loader';

import {version} from '../url'
setDefaultOptions({ version: version })

export default function ODBDown(props) {
  let mapContext = useContext(MapContext);
  let context = mapContext.view
  
 /*  const removeDuplicates = (data,key) => {
    return [
      ...new Map(
        data.map(x => [key(x),x])
      ).values()
    ]
} */

  const South = () => {
    // removeDuplicates(props.vehicle, v_id => v_id.index, )

    if (
      context.loginRole.role === "SouthDEVuser" ||
      context.loginRole.role === "Admin"
    ) {
      let graphicLayer = context.graphicLayer;

      /*  const uniqueIds = [];

      const unique = props.vehicle.filter(element => {
        const isDuplicate = uniqueIds.includes(element.index);
      
        if (!isDuplicate) {
          uniqueIds.push(element.index);
      
          return true;
        }
      
        return false;
      });

      loadModules(
        ["esri/Graphic", "esri/layers/GraphicsLayer", "esri/PopupTemplate"],
        { css: false }
      ).then(([Graphic, GraphicsLayer, PopupTemplate]) => {
   
        const vehicle = new GraphicsLayer({
          title: "Nearest_Vehicle",
          listMode: "hide",
          labelsVisible: false,
          minScale: 1155581,
        });
        
        vehicle.graphics.removeAll();

        graphicLayer.graphics.items.map(_v =>{
          unique.map(v_id =>{
            if(_v.attributes.reg_no === v_id.reg_no){
              // _v.symbol = markerSymbol
               console.log(_v.geometry.latitude)

              let point = {
                type: "point",
                longitude: _v.geometry.longitude,
                latitude: _v.geometry.latitude,
              };
        
              let markerSymbol = {
                type: "picture-marker",
                url: "images/information.png",
                color: "red",
                width: "17px",
                height: "17px",
              };
        
              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
              // sourceLayer: graphicLayer,
              });

              vehicle.graphics.add(pointGraphic);

            }
          })
        })

        props.view.map.add(vehicle)
      }) */

      return (
        <>
          {/*********************** LOSi *****************************/}
          <CardBody style={styles.cardBody}>
            {props.DC_DetailLOSi !== null
              ? props.DC_DetailLOSi.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="cardbody"
                      style={styles.cardBodyDiv}
                    >
                      <div className="cardbody-key">
                        <strong>
                          <div
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            title={`${e.attributes.id}`}
                            onClick={(e) => props.locationGo(e)}
                          >
                            {e.attributes.id}{" "}
                            <span
                              title={`${e.attributes.id}`}
                              style={styles.los}
                            >
                              (LOSi)
                            </span>
                          </div>
                        </strong>

                        {/********************* DC/ODB Name & Address ******************/}
                        <p style={{ fontSize: "11px" }}>
                          <strong>{e.attributes.name} </strong>
                          <br />

                          <span style={{ fontSize: "10px", color: "#7fb5e3" }}>
                            {`Plot # ${e.attributes.plot}, ${e.attributes.street},
                            ${e.attributes.block_phase_sector}, ${e.attributes.area}`}
                          </span>
                        </p>

                        {/********************* Vehicle Info ******************/}
                        {/*   <p style={{ fontSize: "11px" }} >
                                <span
                                    style={{ fontSize: "10px", color: "#7fb5e3" }}
                                  >
                                    
                                    {
                                    unique.forEach(e => {
                                      return <p>{`Vehicle No: ${e.reg_no} DC: ${e.dc_id}`}</p>
                                      
                                    })}
                                  </span>
                            </p>  */}
                      </div>

                      <div className="cardbody-value" style={styles.percent}>
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  );
                })
              : null}

            {/*********************** LOP *****************************/}
            {props.DC_DetailLOP !== null
              ? props.DC_DetailLOP.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="cardbody"
                      style={styles.cardBodyDiv}
                    >
                      <div className="cardbody-key">
                        <strong>
                          <div
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            title={`${e.attributes.id}`}
                            onClick={(e) => props.locationGo(e)}
                          >
                            {e.attributes.id}{" "}
                            <span
                              title={`${e.attributes.id}`}
                              style={styles.lop}
                            >
                              (LOP)
                            </span>
                          </div>
                        </strong>
                        <p style={{ fontSize: "11px" }}>
                          <strong>{e.attributes.name} </strong>
                          <br />

                          <span style={{ fontSize: "10px", color: "#7fb5e3" }}>
                            {`Plot # ${e.attributes.plot}, ${e.attributes.street}, 
                                ${e.attributes.block_phase_sector}, ${e.attributes.area}`}
                          </span>
                        </p>
                      </div>

                      <div
                        className="cardbody-value"
                        style={{ color: "yellow" }}
                      >
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  );
                })
              : null}
          </CardBody>
        </>
      );
    }
  };

  const North = () =>{
    if(context.loginRole.role === "NorthDEVuser"||
    context.loginRole.role === "Admin" ){
      return (
        <>
        {/*********************** LOSi *****************************/}
        <CardBody style={styles.cardBody}>
          {props.North_DC_DetailLOSi !== null
            ? props.North_DC_DetailLOSi.map((e, i) => {
                return (
                  <div
                    key={i}
                    className="cardbody"
                    style={styles.cardBodyDiv}
                  >
                    <div className="cardbody-key">
                      <strong>
                        <div
                          style={{ cursor: "pointer", fontSize: "16px" }}
                          title={`${e.attributes.id}`}
                          onClick={(e) => props.locationGo(e)}
                        >
                          {e.attributes.id}{" "}
                          <span title={`${e.attributes.id}`} style={styles.los}>(LOSi)</span>
                        </div>
                      </strong>
                      <p style={{ fontSize: "11px" }}>
                        <strong>{e.attributes.name} </strong>
                        <br />
  
                        <span
                          style={{ fontSize: "10px", color: "#7fb5e3" }}
                        >
                          {`Plot # ${e.attributes.plot}, ${e.attributes.street},
                      ${e.attributes.block_phase_sector}, ${e.attributes.area}`}
                        </span>
                      </p>
                    </div>
  
                    <div className="cardbody-value" style={styles.percent}>
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                );
              })
            : null}
  
  
        {/*********************** LOP *****************************/}
            {props.North_DC_DetailLOP !== null
            ? props.North_DC_DetailLOP.map((e, i) => {
                return (
                  <div
                    key={i}
                    className="cardbody"
                    style={styles.cardBodyDiv}
                  >
                    <div className="cardbody-key">
                      <strong>
                        <div
                          style={{ cursor: "pointer", fontSize: "16px" }}
                          title={`${e.attributes.id}`}
                          onClick={(e) => props.locationGo(e)}
                        >
                          {e.attributes.id}{" "}
                          <span title={`${e.attributes.id}`} style={styles.lop}>(LOP)</span>
                        </div>
                      </strong>
                      <p style={{ fontSize: "11px" }}>
                        <strong>{e.attributes.name} </strong>
                        <br />
  
                        <span
                          style={{ fontSize: "10px", color: "#7fb5e3" }}
                        >
                          {`Plot # ${e.attributes.plot}, ${e.attributes.street}, 
                          ${e.attributes.block_phase_sector}, ${e.attributes.area}`}
                        </span>
                      </p>
                    </div>
  
                    <div
                      className="cardbody-value"
                      style={{ color: "yellow" }}
                    >
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                );
              })
            : null}
        </CardBody>
      
      </>
      )
    }
   
  }
  
  return (
    <>

    {/************************* SOUTH USER *****************************/}
      {context.loginRole.role === "SouthDEVuser" ? (
        <div
          style={{
            overflow: "auto",
            width: props.width,
            background: "#343a40",
            display:'flex',
            flexDirection:'column',
            width:'13%'
          }}
        >
          <Card
            className="list-group"
            style={{ border: "none", backgroundColor: "#343a40" }}
          >
            <CardHeader
              className="list-group-item list-group-item-danger"
              style={{ display: "flex", justifyContent: "space-around" }}
            >

            <div className="downCount">
              <span className="south" style={{fontSize: '1.0em'}}> Outage - </span>
              {props.DC_DetailLOSi !== null ? <span style={{color:'red'}}><strong>{props.DC_DetailLOSi.length}</strong></span>  : null}
              {/* {props.DC_DetailLOP !== null ? <span style={{color:'yellow'}}><strong>{props.DC_DetailLOP.length}</strong></span>  : null} */}
            
              <button
                type="button"
                onClick={() => props.buttonPlayPress()}
                style={{
                  marginLeft: "12px",
                  border: "0px",
                  outline: "none",
                  backgroundColor: "#f5c6cb",
                  color: "#343a40",
                }}
              >
                <i className={props.playButtonIconClass} aria-hidden="true"></i>
              </button>

            </div>

            </CardHeader>

            <South />
          </Card>
        </div>
      ) : null}
      

     {/************************* NORTH USER *****************************/}
      {context.loginRole.role === "NorthDEVuser"  ? (
        <div
          style={{
            overflow: "auto",
            width: props.width,
            background: "#343a40",
          }}
        >
          <Card
            className="list-group"
            style={{ border: "none", backgroundColor: "#343a40" }}
          >
            <CardHeader
              className="list-group-item list-group-item-danger"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span className="south"> Outage/Low Power </span>

              <button
                type="button"
                onClick={() => props.buttonPlayPress()}
                style={{
                  marginLeft: "7px",
                  border: "0px",
                  outline: "none",
                  backgroundColor: "#f5c6cb",
                  color: "#343a40",
                }}
              >
                <i className={props.playButtonIconClass} aria-hidden="true"></i>
              </button>
            </CardHeader>

            <North />
          </Card>
        </div>
      ) : null}
      

    </>
  );
}

const styles = {
  cardBody: {
    background: "#343a40",
    color: "#2085dc",
  },
  cardBodyDiv: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  percent: {
    paddingLeft: "3px",
    paddingRight: "3px",
    borderRadius: "5px",
    fontSize: "13px",
    color: "red",
  },
  lop: {
    color: "#dfdf0f",
    fontSize: "9px",
  },
  los: {
    color: "#d35151",
    fontSize: "9px",
  },
};
