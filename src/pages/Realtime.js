import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { loadModules, setDefaultOptions } from "esri-loader";

const ENDPOINT = "http://45.249.11.5:5001";
const socket = socketIOClient(ENDPOINT);

class Realtime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: [],
      Online: null,
      DyingGasp: null,
      LOS: null,
      GEMPack: null,
      LOP: null,
      intervalId: null,
    };
  }

  componentDidMount() {
    let _this = this;

    let loginRole = _this.props.loginRole.data.role;
    const socketServer = async() => {
       
        await socket.on("endpoint", async (data) => {

            if (loginRole === "SouthDEVuser") {
              console.log(data);
    
              let customerLayer = _this.props.item.customer.data;
    
              let real = customerLayer.createQuery();
    
              real.where = `alias = '${data.alias}'`;
    
              await customerLayer.queryFeatures(real).
              then(function (response) {
                response.features.map((e) => {
                  const attribute = {
                    OBJECTID: e.attributes.OBJECTID,
                    address: e.attributes.address,
                    alarminfo: data.alarminfo,
                    alarmstate: data.alarmstate,
                    alias: e.attributes.alias,
                    bandwidth: e.attributes.bandwidth,
                    block_phase_sector: e.attributes.block_phase_sector,
                    category: e.attributes.category,
                    city: e.attributes.city,
                    comments: e.attributes.comments,
                    id: e.attributes.id,
                    dc_id: e.attributes.dc_id,
                    fat_id: e.attributes.fat_id,
                    frame: data.frame,
                    lastdowntime: data.lastdowntime,
                    lastuptime: data.lastuptime,
                    name: e.attributes.name,
                    olt: e.attributes.olt,
                    ontid: e.attributes.ontid,
                    ontmodel: e.attributes.ontmodel,
                    plot: e.attributes.plot,
                    pop_id: e.attributes.pop_id,
                    port: data.port,
                    slot: data.slot,
                    status: e.attributes.status,
                    type: e.attributes.type,
                  };
    
                  loadModules(
                    [
                      "esri/Graphic",
                      "esri/layers/GraphicsLayer",
                      "esri/geometry/Point",
                    ],
                    { css: false }
                  ).then(([Graphic, GraphicsLayer, Point]) => {
                    const updateFeature = new Graphic({
                      geometry: e.geometry,
                      attributes: attribute,
                    });
    
                    const deleteFeature = new Graphic({
                      geometry: e.geometry,
                      attributes: e.attributes,
                    });
    
                    customerLayer.applyEdits({
                      deleteFeatures: [deleteFeature],
                      addFeatures: [updateFeature],
                    });
    
                    console.log(updateFeature);
                  });
                });
              });
    
              let southLOS = customerLayer.createQuery();
              let southOnline = customerLayer.createQuery();
              let southDyingGasp = customerLayer.createQuery();
              let southGEMPack = customerLayer.createQuery();
              let southLOP = customerLayer.createQuery();
    
              // LOS
              southLOS.where = "alarmstate = 2 AND status = 'Active'";
              await customerLayer.queryFeatures(southLOS).then(function (response) {
                _this.setState({
                  LOS: response.features.length,
                });
                _this.props.southCPEstatus(_this.state);
              });
    
              // Online
              southOnline.where = "alarmstate = 0 AND status = 'Active'";
              await customerLayer
                .queryFeatures(southOnline)
                .then(function (response) {
                  _this.setState({
                    Online: response.features.length,
                  });
                  _this.props.southCPEstatus(_this.state);
                });
    
              // Gying Gasp
              southDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
              await customerLayer
                .queryFeatures(southDyingGasp)
                .then(function (response) {
                  _this.setState({
                    DyingGasp: response.features.length,
                  });
                  _this.props.southCPEstatus(_this.state);
                });
    
              // GEMPack
              southGEMPack.where = "alarmstate = 3 AND status = 'Active'";
              await customerLayer
                .queryFeatures(southGEMPack)
                .then(function (response) {
                  _this.setState({
                    GEMPack: response.features.length,
                  });
                  _this.props.southCPEstatus(_this.state);
                });
    
              // LOP
              southLOP.where = "alarmstate = 4 AND status = 'Active'";
              await customerLayer.queryFeatures(southLOP).then(function (response) {
                _this.setState({
                  LOP: response.features.length,
                });
    
                _this.props.southCPEstatus(_this.state);
              });
            } 
            else if (loginRole === "NorthDEVuser") {
    
        console.log(data)
    
              let northCustomerLayer = _this.props.item.northCustomer.data;
    
              let northReal = northCustomerLayer.createQuery();
    
              northReal.where = `alias = '${data.alias}'`;
    
              await northCustomerLayer.queryFeatures(northReal)
                .then( function (response) {
                   response.features.map((e) => {
                    const attribute = {
                      OBJECTID: e.attributes.OBJECTID,
                      address: e.attributes.address,
                      alarminfo: data.alarminfo,
                      alarmstate: data.alarmstate,
                      alias: e.attributes.alias,
                      bandwidth: e.attributes.bandwidth,
                      block_phase_sector: e.attributes.block_phase_sector,
                      category: e.attributes.category,
                      city: e.attributes.city,
                      comments: e.attributes.comments,
                      id: e.attributes.id,
                      dc_id: e.attributes.dc_id,
                      fat_id: e.attributes.fat_id,
                      frame: data.frame,
                      lastdowntime: data.lastdowntime,
                      lastuptime: data.lastuptime,
                      name: e.attributes.name,
                      olt: e.attributes.olt,
                      ontid: e.attributes.ontid,
                      ontmodel: e.attributes.ontmodel,
                      plot: e.attributes.plot,
                      pop_id: e.attributes.pop_id,
                      port: data.port,
                      slot: data.slot,
                      status: e.attributes.status,
                      type: e.attributes.type,
                    };
    
                    loadModules(
                      [
                        "esri/Graphic",
                        "esri/layers/GraphicsLayer",
                        "esri/geometry/Point",
                      ],
                      { css: false }
                    ).then(([Graphic, GraphicsLayer, Point]) => {
                      const updateFeature = new Graphic({
                        geometry: e.geometry,
                        attributes: attribute,
                      });
    
                      const deleteFeature = new Graphic({
                        geometry: e.geometry,
                        attributes: e.attributes,
                      });
    
                      northCustomerLayer.applyEdits({
                        deleteFeatures: [deleteFeature],
                        addFeatures: [updateFeature],
                      });
    
                      console.log(updateFeature)
                    });
                  });
                });
    
              let southLOS = northCustomerLayer.createQuery();
              let southOnline = northCustomerLayer.createQuery();
              let southDyingGasp = northCustomerLayer.createQuery();
              let southGEMPack = northCustomerLayer.createQuery();
              let southLOP = northCustomerLayer.createQuery();
    
              // LOS
              southLOS.where = "alarmstate = 2 AND status = 'Active'";
              await northCustomerLayer
                .queryFeatures(southLOS)
                .then(function (response) {
                  _this.setState({
                    LOS: response.features.length,
                  });
                  _this.props.northCPEstatus(_this.state);
                });
    
              // Online
              southOnline.where = "alarmstate = 0 AND status = 'Active'";
              await northCustomerLayer
                .queryFeatures(southOnline)
                .then(function (response) {
                  _this.setState({
                    Online: response.features.length,
                  });
                  _this.props.northCPEstatus(_this.state);
                });
    
              // Gying Gasp
              southDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
              await northCustomerLayer
                .queryFeatures(southDyingGasp)
                .then(function (response) {
                  _this.setState({
                    DyingGasp: response.features.length,
                  });
                  _this.props.northCPEstatus(_this.state);
                });
    
              // GEMPack
              southGEMPack.where = "alarmstate = 3 AND status = 'Active'";
              await northCustomerLayer
                .queryFeatures(southGEMPack)
                .then(function (response) {
                  _this.setState({
                    GEMPack: response.features.length,
                  });
                  _this.props.northCPEstatus(_this.state);
                });
    
              // LOP
              southLOP.where = "alarmstate = 4 AND status = 'Active'";
              await northCustomerLayer
                .queryFeatures(southLOP)
                .then(function (response) {
                  _this.setState({
                    LOP: response.features.length,
                  });
    
                  _this.props.northCPEstatus(_this.state);
                });
            }
          });
    }

    _this.props.view.when( async function () {
        setTimeout(socketServer, 6000);
        
        });
  }

  componentWillUnmount() {
    return socket.disconnect();
  }

  render() {
    return null;
  }
}

export default Realtime;
