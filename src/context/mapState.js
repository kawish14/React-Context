import React, {useContext, useEffect,useState}  from "react";
import MapContext from "./mapContext";
import { authenticationService } from "../_services/authentication";
import { loadModules, setDefaultOptions } from "esri-loader";
import {api} from '../url'
import axios from 'axios'

import {version} from '../url'
setDefaultOptions({ version: version })

//let url = "http://172.29.100.28:8081/";
//let url = "http://45.249.11.5:28881/";

//let url = "http://gis.tes.com.pk:28881/"

const MapState = (props) => {
  const view = {
    loginRole: {},

    province: {},
    cities: {},

    recentDownSouth:{},
    recentDownNorth:{},
    recentDownCentral:{},

    southCPELayer: {},
    southInactiveCPE:{},
    southDC: {},
    southFAT: {},
    southJoint: {},
    southPOP: {},
    southDistribution: {},
    southFeeder: {},
    southZone: {},
    southBackhaul:{},
    southGulshanHH: {},
    southGulshanConduit: {},

    northCPELayer: {},
    northInactiveCPE:{},
    northDC: {},
    northFAT: {},
    northJoint: {},
    northPOP: {},
    northDistribution: {},
    northFeeder: {},
    northZone: {},
    northBackhaul:{},

    centralCPELayer: {},
    centralInactiveCPE:{},
    centralDC: {},
    centralFAT: {},
    centralJoint: {},
    centralPOP: {},
    centralDistribution: {},
    centralFeeder: {},
    centralZone: {},
    centralBackhaul:{},

    graphicLayer: {},
    graphicLayerOffice: {},
    graphicLayerLOSiDC:{},
    graphicLayerLOPDC:{},
    graphicLayerKML:{},
    parcels:{},

    
  };

  authenticationService.currentUser.subscribe((x) => {
    if(x){

      if(x.role === 'SouthDEVuser') {
        SouthUser()
      }
      else if (x.role === 'NorthDEVuser'){
        NorthUser()
      }
      else if(x.role === 'CentralDEVuser'){
        CentralUser()
      }
      else if (x.role === 'Admin' || x.role === 'CSD' || x.role === 'NOC'){
        SouthUser() 
        NorthUser()
        CentralUser()
      }
    }
  
    return (view.loginRole = x);
  });

  loadModules(["esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer"], {
    css: false,
  }).then(([GeoJSONLayer, GraphicsLayer]) => {

    const province = new GeoJSONLayer({
      url:
      api +
        "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Aprovince_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
      labelsVisible: true,
      listMode: "hide",
      maxScale: 1155581,
      title: "Province",
    });

    view.province = province;

    const cities = new GeoJSONLayer({
      url:
      api +
        "/geoserver/ShapeFiles/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ShapeFiles%3ATES_Cities&maxFeatures=1000000&outputFormat=application%2Fjson",
      labelsVisible: true,
      listMode: "hide",
      minScale: 1155581,
      maxScale: 144448,
      title: "City",
    });

    view.cities = cities;

    const graphicLayer = new GraphicsLayer({
      title: "Vehicles",
      listMode: "show",
      labelsVisible: false,
      minScale: 1155581,
    });

    view.graphicLayer = graphicLayer;

    const graphicLayerOffice = new GraphicsLayer({
      title: "Office Location",
      listMode: "hide",
      labelsVisible: false,
      minScale: 1155581,
    });

    view.graphicLayerOffice = graphicLayerOffice;

    const graphicLayerLOSiDC = new GraphicsLayer({
      title: "DC Outage",
      listMode: "hide",
      labelsVisible: false,
      graphics:[],
      minScale: 1155581,
    });

    view.graphicLayerLOSiDC = graphicLayerLOSiDC;
    
    const graphicLayerLOPDC = new GraphicsLayer({
      title: "DC Outage",
      listMode: "hide",
      labelsVisible: false,
      graphics:[],
      minScale: 1155581,
    });

    view.graphicLayerLOPDC = graphicLayerLOPDC;

    const graphicLayerKML = new GraphicsLayer({
      title: "KML Layer",
      listMode: "hide",
      labelsVisible: true,
      minScale: 1155581,
    });

    view.graphicLayerKML = graphicLayerKML;

    const recentDownSouth = new GraphicsLayer({
      title: "RecentDown South",
      listMode: "hide",
      labelsVisible: false,
      graphics:[],
      minScale: 1155581,
    });

    const recentDownNorth = new GraphicsLayer({
      title: "RecentDown North",
      listMode: "hide",
      labelsVisible: false,
      graphics:[],
      minScale: 1155581,
    });

    const recentDownCentral = new GraphicsLayer({
      title: "RecentDown Central",
      listMode: "hide",
      labelsVisible: false,
      graphics:[],
      minScale: 1155581,
    });

    view.recentDownSouth = recentDownSouth;
    view.recentDownNorth = recentDownNorth;
    view.recentDownCentral = recentDownCentral

   
  });

     /**************************  SOUTH LAYERS  ****************************/

   function SouthUser() {
     loadModules(["esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer"], {
       css: false,
     }).then(([GeoJSONLayer, GraphicsLayer]) => {

       const southGulshanConduit = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Agulshan_conduit_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "Conduit",
         outFields: ["*"],
         popupTemplate: {
           title: "Conduit",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "road_name",
                   visible: true,
                   label: "Road",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "work_status",
                   visible: true,
                   label: "Work Status",
                 },
                 {
                   fieldName: "phase",
                   visible: true,
                   label: "Phase",
                 },
                 {
                   fieldName: "hdpe",
                   visible: true,
                   label: "HDPE (mm)",
                 },
                 {
                   fieldName: "date",
                   visible: true,
                   label: "Date",
                 },
                 {
                   fieldName: "distance",
                   visible: true,
                   label: "Length (m)",
                 },
                 {
                   fieldName: "contractor",
                   visible: true,
                   label: "Contractor",
                 },
                 {
                   fieldName: "area",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "sub_area",
                   visible: true,
                   label: "Sub Area",
                 },
               ],
             },
           ],
         },
       });

       const southGulshanHH = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Agulshan_hh_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "Hand hole",
         minScale: 18056,
         outFields: ["*"],
         popupTemplate: {
           title: "Hand hole",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "street",
                   visible: true,
                   label: "Street",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "south_sde_hh_area",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "block_phase_sector",
                   visible: true,
                   label: "Sub Area",
                 },
                 {
                   fieldName: "attachment",
                   visible: true,
                   label: "Attachment",
                 },
                 {
                   fieldName: "attachment_length",
                   visible: true,
                   label: "Attachment length",
                 },
               ],
             },
           ],
         },
       });

       const southCPELayer = new GeoJSONLayer({
         url:
         api +
           "/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Ance_gis_record&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "South Customer",
         minScale: 1155581,
         legendEnabled: false,
         editingEnabled: true,
         visible:false,
         outFields: [
           "OBJECTID",
           "pop_id",
           "name",
           "id",
           "address",
           "dc_id",
           "dc_name",
           "fat_id",
           "type",
           "area_town",
           "sub_area",
           "city",
           "alias",
           "olt",
           "nce_fsp",
           "frame",
           "slot",
           "port",
           "ontid",
           "ontmodel",
           "alarmstate",
           "alarminfo",
           "bandwidth",
           "lastuptime",
           "lastdowntime",
           "mobilenum",
           "activationdate",
           "statuschangedate",
           "ticketid",
           "ticketstatus",
           "tickettype",
           "ticketopentime",
           "ticketresolvetime",
           "downtime",
           "uptime"
         ],
         popupTemplate: {
           title: "Customer",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   visible: true,
                   label: "ID",
                 },
                 {
                   fieldName: "address",
                   visible: true,
                   label: "Address",
                 },
                 {
                   fieldName: "dc_id",
                   visible: true,
                   label: "DC/ODB ID",
                 },
                 {
                   fieldName: "fat_id",
                   visible: true,
                   label: "FAT ID",
                 },
                 {
                   fieldName: "activationdate",
                   visible: true,
                   label: "Activation Date",
                 },
                 {
                   fieldName: "mobilenum",
                   visible: true,
                   label: "Mobile No.",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "area_town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "sub_area",
                   visible: true,
                   label: "Sub Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 } /* {
                         fieldName: "fat",
                         visible: true,
                         label: "FAT",
                     }, {
                         fieldName: "dc_odb",
                         visible: true,
                         label: "DC/ODB",
                     }, {
                         fieldName: "pop_id",
                         visible: true,
                         label: "POP",
                     },*/,
                 {
                   fieldName: "ticketid",
                   visible: true,
                   label: "Ticket ID",
                 },
                 {
                   fieldName: "ticketstatus",
                   visible: true,
                   label: "Ticket Status",
                 },
                 {
                   fieldName: "tickettype",
                   visible: true,
                   label: "Ticket Type",
                 },
                 {
                   fieldName: "ticketopentime",
                   visible: true,
                   label: "Ticket Open Time",
                 },
                 {
                   fieldName: "ticketresolvetime",
                   visible: true,
                   label: "Ticket Resolve Time",
                 },

                 {
                   fieldName: "olt",
                   visible: true,
                   label: "OLT",
                 },
                 {
                   fieldName: "frame",
                   visible: true,
                   label: "Frame",
                 },
                 {
                   fieldName: "slot",
                   visible: true,
                   label: "Slot",
                 },
                 {
                   fieldName: "port",
                   visible: true,
                   label: "Port",
                 },
                 {
                   fieldName: "ontid",
                   visible: true,
                   label: "ONT ID",
                 },
                 {
                   fieldName: "ontmodel",
                   visible: true,
                   label: "ONT Model",
                 },
                 {
                   fieldName: "alarminfo",
                   visible: true,
                   label: "Alarm Info",
                 },
                 {
                   fieldName: "bandwidth",
                   visible: true,
                   label: "Bandwidth",
                 },
                 {
                   fieldName: "uptime",
                   visible: true,
                   label: "Last-UP-Time",
                 },
                 {
                   fieldName: "downtime",
                   visible: true,
                   label: "Last-Down-Time",

                 },
               ],
             },
           ],
         },
       });

       const southInactiveCPE = new GeoJSONLayer({
        url:
        api +
         "/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ASouth_Terminated_CPE&maxFeatures=1000000&outputFormat=application%2Fjson",
        title: "South InActive Customer",
        minScale: 1155581,
        legendEnabled: false,
        visible:false,
        selection:false,
        outFields:["name","id","address", "pop_id","mobilenum","type","area_town","sub_area","city","status"],
        popupTemplate: {
          title: "InActive Customer",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "name",
                  visible: true,
                  label: "Name",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "id",
                  visible: true,
                  label: "ID",
                },
                {
                  fieldName: "address",
                  visible: true,
                  label: "Address",
                },
                {
                  fieldName: "pop_id",
                  visible: true,
                  label: "POP ID",
                },
                {
                  fieldName: "mobilenum",
                  visible: true,
                  label: "Mobile No.",
                },
                {
                  fieldName: "type",
                  visible: true,
                  label: "Type",
                },
                {
                  fieldName: "area_town",
                  visible: true,
                  label: "Area",
                },
                {
                  fieldName: "sub_area",
                  visible: true,
                  label: "Sub Area",
                },
                {
                  fieldName: "city",
                  visible: true,
                  label: "City",
                }
              ],
            },
          ],
        },
       })

       const southDC = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3ASouth_dc_odb_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "South ODB/DC",
         // minScale: 36112,
         labelsVisible: false,
         visible: false,
         minScale: 1155581,
         outFields:["id","name","pop_id","placement","plot","area","block_phase_sector","city","capacity","Splitter_Type","splitter_count"],
         popupTemplate: {
           title: "ODB/DC",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "plot",
                   visible: true,
                   label: "Plot",
                 },
                 {
                   fieldName: "area",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "block_phase_sector",
                   visible: true,
                   label: "Sub Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "Splitter_Type",
                   visible: true,
                   label: "Splitter",
                 },
                 {
                   fieldName: "splitter_count",
                   visible: true,
                   label: "Splitter Count",
                 },
               ],
             },
             {
              type: "text",
              text:""
            }
           ],
         },
       });

       const southFAT = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3ASouth_FAT_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "South FAT",
         // minScale: 9050,
         labelsVisible: false,
         visible: false,
         minScale: 1155581,
         popupTemplate: {
           title: "FAT",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   label: "ID",
                   visible: true,
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "dc_id",
                   visible: true,
                   label: "DC ID",
                 },
                 {
                   fieldName: "pop_id",
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "splitter",
                   label: "Splitter Type",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "plot",
                   label: "Plot",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "area",
                   label: "Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "block_phase_sector",
                   label: "Sub Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "city",
                   label: "City",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
               ],
             },
           ],
         },
       });

       const southJoint = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3ASouth_jc_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "South JC",
         // minScale: 36112,
         visible: false,
         minScale: 1155581,
         popupTemplate: {
           title: "JC",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "id",
                   label: "ID",
                   visible: true,
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "pop_id",
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   label: "Network",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "plot",
                   label: "Plot",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "area",
                   label: "Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "block_phase_sector",
                   label: "Sub Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "city",
                   label: "City",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
               ],
             },
           ],
         },
       });

       const southPOP = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Apop_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "POP",
         // minScale: 1155581,
         labelsVisible: false,
         minScale: 1155581,
         popupTemplate: {
           title: "POP",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   visible: true,
                   label: "ID",
                 },
                 {
                   fieldName: "plot",
                   visible: true,
                   label: "Plot",
                 },
                 {
                   fieldName: "street",
                   visible: true,
                   label: "Street",
                 },
                 {
                   fieldName: "area",
                   visible: true,
                   label: "Area/Town",
                 },
                 {
                   fieldName: "block_phase_sector",
                   visible: true,
                   label: "block/Phase",
                 },
               ],
             },
           ],
         },
       });

       const southDistribution = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3ASouth_OFC_Distribution&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "South Distribution",
         // minScale: 9050,
         visible: false,
         minScale: 1155581,
         popupTemplate: {
           title: "Distribution",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "cable_id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   visible: true,
                   label: "Network",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "starting_point",
                   visible: true,
                   label: "Starting Point",
                 },
                 {
                   fieldName: "ending_point",
                   visible: true,
                   label: "Ending Point",
                 },
                 {
                   fieldName: "Town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
               ],
             },
           ],
         },
       });

       const southFeeder = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3ASouth_OFC_Feeder&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "South Feeder",
         minScale: 1155581,
         //visible: false,
         popupTemplate: {
           title: "Feeder",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "cable_id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   visible: true,
                   label: "Network",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "starting_point",
                   visible: true,
                   label: "Starting Point",
                 },
                 {
                   fieldName: "ending_point",
                   visible: true,
                   label: "Ending Point",
                 },
                 {
                   fieldName: "Town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
               ],
             },
           ],
         },
       });

       const southZone = new GeoJSONLayer({
         url:
         api +
           "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Azones_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "South Zone",
         minScale: 1155581,
         outFields: ["*"],
       });
       
       const southBackhaul = new GeoJSONLayer({
        url:
        api +
          "/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Asouth_backhaul&maxFeatures=1000000&outputFormat=application%2Fjson",
        labelsVisible: false,
        title: "South Backhaul",
        visible: false,
        minScale: 1155581,
        outFields: ["*"],
        popupTemplate: {
          title: "Feeder",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "capacity",
                  visible: true,
                  label: "Capacity",
                },
                {
                  fieldName: "own",
                  visible: true,
                  label: "Own",
                },
                {
                  fieldName: "placement",
                  visible: true,
                  label: "Placement",
                },
              ]
            }
          ]
        }
      });

       view.southCPELayer = southCPELayer;
       view.southInactiveCPE = southInactiveCPE
       view.southDC = southDC;
       view.southFAT = southFAT;
       view.southJoint = southJoint;
       view.southPOP = southPOP;
       view.southDistribution = southDistribution;
       view.southFeeder = southFeeder;
       view.southZone = southZone;
       view.southGulshanHH = southGulshanHH;
       view.southGulshanConduit = southGulshanConduit;
       view.southBackhaul = southBackhaul
     });
   }

   /**************************  NORTH LAYERS  ****************************/

   function NorthUser() {
     loadModules(["esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer"], {
       css: false,
     }).then(([GeoJSONLayer, GraphicsLayer]) => {

       const northCPELayer = new GeoJSONLayer({
         url:
         api +
           "/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Ance_north_gis_record&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "North Customer",
         minScale: 1155581,
         legendEnabled: false,
         editingEnabled: true,
         visible:false,
         outFields: [
          "OBJECTID",
          "pop_id",
          "name",
          "id",
          "address",
          "dc_id",
          "fat_id",
          "type",
          "area_town",
          "sub_area",
          "city",
          "olt",
          "frame",
          "slot",
          "port",
          "ontid",
          "ontmodel",
          "alarmstate",
          "alarminfo",
          "bandwidth",
          "lastuptime",
          "lastdowntime",
          "mobilenum",
          "activationdate",
          "statuschangedate",
          "ticketid",
          "ticketstatus",
          "tickettype",
          "ticketopentime",
          "ticketresolvetime",
          "downtime",
          "uptime"
        ],
        popupTemplate: {
          title: "Customer",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "name",
                  visible: true,
                  label: "Name",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "id",
                  visible: true,
                  label: "ID",
                },
                {
                  fieldName: "address",
                  visible: true,
                  label: "Address",
                },
                {
                  fieldName: "dc_id",
                  visible: true,
                  label: "DC/ODB ID",
                },
                {
                  fieldName: "fat_id",
                  visible: true,
                  label: "FAT ID",
                },
                {
                  fieldName: "activationdate",
                  visible: true,
                  label: "Activation Date",
                },
                {
                  fieldName: "mobilenum",
                  visible: true,
                  label: "Mobile No.",
                },
                {
                  fieldName: "type",
                  visible: true,
                  label: "Type",
                },
                {
                  fieldName: "area_town",
                  visible: true,
                  label: "Area",
                },
                {
                  fieldName: "sub_area",
                  visible: true,
                  label: "Sub Area",
                },
                {
                  fieldName: "city",
                  visible: true,
                  label: "City",
                } /* {
                        fieldName: "fat",
                        visible: true,
                        label: "FAT",
                    }, {
                        fieldName: "dc_odb",
                        visible: true,
                        label: "DC/ODB",
                    }, {
                        fieldName: "pop_id",
                        visible: true,
                        label: "POP",
                    },*/,
                {
                  fieldName: "ticketid",
                  visible: true,
                  label: "Ticket ID",
                },
                {
                  fieldName: "ticketstatus",
                  visible: true,
                  label: "Ticket Status",
                },
                {
                  fieldName: "tickettype",
                  visible: true,
                  label: "Ticket Type",
                },
                {
                  fieldName: "ticketopentime",
                  visible: true,
                  label: "Ticket Open Time",
                },
                {
                  fieldName: "ticketresolvetime",
                  visible: true,
                  label: "Ticket Resolve Time",
                },

                {
                  fieldName: "olt",
                  visible: true,
                  label: "OLT",
                },
                {
                  fieldName: "frame",
                  visible: true,
                  label: "Frame",
                },
                {
                  fieldName: "slot",
                  visible: true,
                  label: "Slot",
                },
                {
                  fieldName: "port",
                  visible: true,
                  label: "Port",
                },
                {
                  fieldName: "ontid",
                  visible: true,
                  label: "ONT ID",
                },
                {
                  fieldName: "ontmodel",
                  visible: true,
                  label: "ONT Model",
                },
                {
                  fieldName: "alarminfo",
                  visible: true,
                  label: "Alarm Info",
                },
                {
                  fieldName: "bandwidth",
                  visible: true,
                  label: "Bandwidth",
                },
                {
                  fieldName: "uptime",
                  visible: true,
                  label: "Last-UP-Time",
                },
                {
                  fieldName: "downtime",
                  visible: true,
                  label: "Last-Down-Time",

                },
              ],
            },
          ],
        },
       });

       const northInactiveCPE = new GeoJSONLayer({
        url:
        api +
         "/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ANorth_Terminated_CPE&maxFeatures=1000000&outputFormat=application%2Fjson",
        title: "North InActive Customer",
        minScale: 1155581,
        legendEnabled: false,
        visible:false,
        outFields:["name","id","address", "pop_id","mobilenum","type","area_town","sub_area","city","status"],
        popupTemplate: {
          title: "InActive Customer",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "name",
                  visible: true,
                  label: "Name",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "id",
                  visible: true,
                  label: "ID",
                },
                {
                  fieldName: "address",
                  visible: true,
                  label: "Address",
                },
                {
                  fieldName: "pop_id",
                  visible: true,
                  label: "POP ID",
                },
                {
                  fieldName: "mobilenum",
                  visible: true,
                  label: "Mobile No.",
                },
                {
                  fieldName: "type",
                  visible: true,
                  label: "Type",
                },
                {
                  fieldName: "area_town",
                  visible: true,
                  label: "Area",
                },
                {
                  fieldName: "sub_area",
                  visible: true,
                  label: "Sub Area",
                },
                {
                  fieldName: "city",
                  visible: true,
                  label: "City",
                }
              ],
            },
          ],
        },
       })

       const northDC = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3ANorth_dc_odb_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "North ODB/DC",
         // minScale: 36112,
         labelsVisible: false,
         visible: false,
         minScale: 1155581,
         outFields:["id","name","pop_id","placement","plot","area","sub_area","city","capacity","splitter_type","splitter_count"],
         popupTemplate: {
           title: "ODB/DC",
           content: [
             {
               type: "fields",
               fieldInfos: [
                {
                  fieldName: "name",
                  visible: true,
                  label: "Name",
                  format: {
                    digitSeparator: true,
                    places: 0,
                  },
                },
                {
                  fieldName: "id",
                  visible: true,
                  label: "ID",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "pop_id",
                  visible: true,
                  label: "POP ID",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "placement",
                  visible: true,
                  label: "Placement",
                },
                {
                  fieldName: "plot",
                  visible: true,
                  label: "Plot",
                },
                {
                  fieldName: "area",
                  visible: true,
                  label: "Area",
                },
                {
                  fieldName: "sub_area",
                  visible: true,
                  label: "Sub Area",
                },
                {
                  fieldName: "city",
                  visible: true,
                  label: "City",
                },
                {
                  fieldName: "capacity",
                  visible: true,
                  label: "Capacity",
                },
                {
                  fieldName: "splitter_type",
                  visible: true,
                  label: "Splitter",
                },
                {
                  fieldName: "splitter_count",
                  visible: true,
                  label: "Splitter Count",
                },
               ],
             },
             {
              type: "text",
              text:""
            }
           ],
         },
       });

       const northFAT = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3ANorth_fat_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "North FAT",
         // minScale: 9050,
         labelsVisible: false,
         visible: false,
         minScale: 1155581,
         popupTemplate: {
           title: "FAT",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   label: "ID",
                   visible: true,
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "dc_id",
                   visible: true,
                   label: "DC ID",
                 },
                 {
                   fieldName: "pop_id",
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "splitter",
                   label: "Splitter Type",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "plot",
                   label: "Plot",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "area",
                   label: "Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "block_phase_sector",
                   label: "Sub Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "city",
                   label: "City",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
               ],
             },
           ],
         },
       });

       const northJoint = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3ANorth_jc_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "North JC",
         minScale: 1155581,
         visible: false,
         popupTemplate: {
           title: "JC",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "id",
                   label: "ID",
                   visible: true,
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "pop_id",
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   label: "Network",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "plot",
                   label: "Plot",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "area",
                   label: "Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "block_phase_sector",
                   label: "Sub Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "city",
                   label: "City",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
               ],
             },
           ],
         },
       });

       const northPOP = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3Apop_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "North POP",
         minScale: 1155581,
         labelsVisible: false,
         popupTemplate: {
           title: "POP",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   visible: true,
                   label: "ID",
                 },
                 {
                   fieldName: "plot",
                   visible: true,
                   label: "Plot",
                 },
                 {
                   fieldName: "street",
                   visible: true,
                   label: "Street",
                 },
                 {
                   fieldName: "area",
                   visible: true,
                   label: "Area/Town",
                 },
                 {
                   fieldName: "block_phase_sector",
                   visible: true,
                   label: "block/Phase",
                 },
               ],
             },
           ],
         },
       });

       const northDistribution = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3ANorth_OFC_Distribution&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "North Distribution",
         minScale: 1155581,
         visible: false,
         popupTemplate: {
           title: "Distribution",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "cable_id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   visible: true,
                   label: "Network",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "starting_point",
                   visible: true,
                   label: "Starting Point",
                 },
                 {
                   fieldName: "ending_point",
                   visible: true,
                   label: "Ending Point",
                 },
                 {
                   fieldName: "Town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
               ],
             },
           ],
         },
       });

       const northFeeder = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3ANorth_OFC_Feeder&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "North Feeder",
         minScale: 1155581,
         visible: true,
         popupTemplate: {
           title: "Feeder",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "cable_id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   visible: true,
                   label: "Network",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "starting_point",
                   visible: true,
                   label: "Starting Point",
                 },
                 {
                   fieldName: "ending_point",
                   visible: true,
                   label: "Ending Point",
                 },
                 {
                   fieldName: "Town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
               ],
             },
           ],
         },
       });

       const northZone = new GeoJSONLayer({
         url:
         api +
           "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3ANorth_zones_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "North Zone",
         minScale: 1155581,
         outFields: ["*"],
       });

       const northBackhaul = new GeoJSONLayer({
        url:
        api +
          "/geoserver/North_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=North_Postgis%3Anorth_backhaul&maxFeatures=1000000&outputFormat=application%2Fjson",
        labelsVisible: false,
        visible: false,
        title: "North Backhaul",
        minScale: 1155581,
        outFields: ["*"],
        popupTemplate: {
          title: "Feeder",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "capacity",
                  visible: true,
                  label: "Capacity",
                },
                {
                  fieldName: "own",
                  visible: true,
                  label: "Own",
                },
                {
                  fieldName: "placement",
                  visible: true,
                  label: "Placement",
                },
              ]
            }
          ]
        }
      });
       

       view.northCPELayer = northCPELayer;
       view.northInactiveCPE = northInactiveCPE
       view.northDC = northDC;
       view.northFAT = northFAT;
       view.northJoint = northJoint;
       view.northPOP = northPOP;
       view.northDistribution = northDistribution;
       view.northFeeder = northFeeder;
       view.northZone = northZone;
       view.northBackhaul = northBackhaul
     });
   }

   /**************************  CENTRAL LAYERS  ****************************/

   function CentralUser() {
     loadModules(["esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer"], {
       css: false,
     }).then(([GeoJSONLayer, GraphicsLayer]) => {

       const centralCPELayer = new GeoJSONLayer({
         url:
         api +
           "/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Ance_central_gis_record&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "Central Customer",
         minScale: 1155581,
         legendEnabled: false,
         editingEnabled: true,
         visible:false,
         outFields: [
          "OBJECTID",
          "pop_id",
          "name",
          "id",
          "address",
          "dc_id",
          "fat_id",
          "type",
          "area_town",
          "sub_area",
          "city",
          "olt",
          "frame",
          "slot",
          "port",
          "ontid",
          "ontmodel",
          "alarmstate",
          "alarminfo",
          "bandwidth",
          "lastuptime",
          "lastdowntime",
          "mobilenum",
          "activationdate",
          "statuschangedate",
          "ticketid",
          "ticketstatus",
          "tickettype",
          "ticketopentime",
          "ticketresolvetime",
          "downtime",
          "uptime"
        ],
        popupTemplate: {
          title: "Customer",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "name",
                  visible: true,
                  label: "Name",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "id",
                  visible: true,
                  label: "ID",
                },
                {
                  fieldName: "address",
                  visible: true,
                  label: "Address",
                },
                {
                  fieldName: "dc_id",
                  visible: true,
                  label: "DC/ODB ID",
                },
                {
                  fieldName: "fat_id",
                  visible: true,
                  label: "FAT ID",
                },
                {
                  fieldName: "activationdate",
                  visible: true,
                  label: "Activation Date",
                },
                {
                  fieldName: "mobilenum",
                  visible: true,
                  label: "Mobile No.",
                },
                {
                  fieldName: "type",
                  visible: true,
                  label: "Type",
                },
                {
                  fieldName: "area_town",
                  visible: true,
                  label: "Area",
                },
                {
                  fieldName: "sub_area",
                  visible: true,
                  label: "Sub Area",
                },
                {
                  fieldName: "city",
                  visible: true,
                  label: "City",
                } /* {
                        fieldName: "fat",
                        visible: true,
                        label: "FAT",
                    }, {
                        fieldName: "dc_odb",
                        visible: true,
                        label: "DC/ODB",
                    }, {
                        fieldName: "pop_id",
                        visible: true,
                        label: "POP",
                    },*/,
                {
                  fieldName: "ticketid",
                  visible: true,
                  label: "Ticket ID",
                },
                {
                  fieldName: "ticketstatus",
                  visible: true,
                  label: "Ticket Status",
                },
                {
                  fieldName: "tickettype",
                  visible: true,
                  label: "Ticket Type",
                },
                {
                  fieldName: "ticketopentime",
                  visible: true,
                  label: "Ticket Open Time",
                },
                {
                  fieldName: "ticketresolvetime",
                  visible: true,
                  label: "Ticket Resolve Time",
                },

                {
                  fieldName: "olt",
                  visible: true,
                  label: "OLT",
                },
                {
                  fieldName: "frame",
                  visible: true,
                  label: "Frame",
                },
                {
                  fieldName: "slot",
                  visible: true,
                  label: "Slot",
                },
                {
                  fieldName: "port",
                  visible: true,
                  label: "Port",
                },
                {
                  fieldName: "ontid",
                  visible: true,
                  label: "ONT ID",
                },
                {
                  fieldName: "ontmodel",
                  visible: true,
                  label: "ONT Model",
                },
                {
                  fieldName: "alarminfo",
                  visible: true,
                  label: "Alarm Info",
                },
                {
                  fieldName: "bandwidth",
                  visible: true,
                  label: "Bandwidth",
                },
                {
                  fieldName: "uptime",
                  visible: true,
                  label: "Last-UP-Time",
                },
                {
                  fieldName: "downtime",
                  visible: true,
                  label: "Last-Down-Time",

                },
              ],
            },
          ],
        },
       });

       const centralInactiveCPE = new GeoJSONLayer({
        url:
        api +
         "/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ACentral_Terminated_CPE&maxFeatures=1000000&outputFormat=application%2Fjson",
        title: "Central InActive Customer",
        minScale: 1155581,
        legendEnabled: false,
        visible:false,
        outFields:["name","id","address", "pop_id","mobilenum","type","area_town","sub_area","city","status"],
        popupTemplate: {
          title: "InActive Customer",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "name",
                  visible: true,
                  label: "Name",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "id",
                  visible: true,
                  label: "ID",
                },
                {
                  fieldName: "address",
                  visible: true,
                  label: "Address",
                },
                {
                  fieldName: "pop_id",
                  visible: true,
                  label: "POP ID",
                },
                {
                  fieldName: "mobilenum",
                  visible: true,
                  label: "Mobile No.",
                },
                {
                  fieldName: "type",
                  visible: true,
                  label: "Type",
                },
                {
                  fieldName: "area_town",
                  visible: true,
                  label: "Area",
                },
                {
                  fieldName: "sub_area",
                  visible: true,
                  label: "Sub Area",
                },
                {
                  fieldName: "city",
                  visible: true,
                  label: "City",
                }
              ],
            },
          ],
        },
       })

       const centralDC = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3ACentral_dc_odb_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "Central ODB/DC",
         minScale: 1155581,
         visible: false,
         labelsVisible: false,
         outFields:["id","name","pop_id","placement","plot","area","sub_area","city","capacity","splitter_type","splitter_count"],
         popupTemplate: {
           title: "ODB/DC",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "plot",
                   visible: true,
                   label: "Plot",
                 },
                 {
                   fieldName: "area",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "block_phase_sector",
                   visible: true,
                   label: "Sub Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "Splitter_Type",
                   visible: true,
                   label: "Splitter",
                 },
                 {
                   fieldName: "splitter_count",
                   visible: true,
                   label: "Splitter Count",
                 },
               ],
             },
           ],
         },
       });

       const centralFAT = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3ACentral_fat_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "Central FAT",
         minScale: 1155581,
         labelsVisible: false,
         visible: false,
         popupTemplate: {
           title: "FAT",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   label: "ID",
                   visible: true,
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "dc_id",
                   visible: true,
                   label: "DC ID",
                 },
                 {
                   fieldName: "pop_id",
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "splitter",
                   label: "Splitter Type",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "plot",
                   label: "Plot",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "area",
                   label: "Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "block_phase_sector",
                   label: "Sub Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "city",
                   label: "City",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
               ],
             },
           ],
         },
       });

       const centralJoint = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3ACentral_jc_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "Central JC",
         minScale: 1155581,
         visible: false,
         popupTemplate: {
           title: "JC",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "id",
                   label: "ID",
                   visible: true,
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "pop_id",
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   label: "Network",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "plot",
                   label: "Plot",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "area",
                   label: "Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "block_phase_sector",
                   label: "Sub Area",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "city",
                   label: "City",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
               ],
             },
           ],
         },
       });

       const centralPOP = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3Apop_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "Central POP",
         minScale: 1155581,
         labelsVisible: false,
         popupTemplate: {
           title: "POP",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "name",
                   visible: true,
                   label: "Name",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "id",
                   visible: true,
                   label: "ID",
                 },
                 {
                   fieldName: "plot",
                   visible: true,
                   label: "Plot",
                 },
                 {
                   fieldName: "street",
                   visible: true,
                   label: "Street",
                 },
                 {
                   fieldName: "area",
                   visible: true,
                   label: "Area/Town",
                 },
                 {
                   fieldName: "block_phase_sector",
                   visible: true,
                   label: "block/Phase",
                 },
               ],
             },
           ],
         },
       });

       const centralDistribution = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3ACentral_OFC_Distribution&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "Central Distribution",
         minScale: 1155581,
         visible: false,
         popupTemplate: {
           title: "Distribution",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "cable_id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   visible: true,
                   label: "Network",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "starting_point",
                   visible: true,
                   label: "Starting Point",
                 },
                 {
                   fieldName: "ending_point",
                   visible: true,
                   label: "Ending Point",
                 },
                 {
                   fieldName: "Town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
               ],
             },
           ],
         },
       });

       const centralFeeder = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3ACentral_OFC_Feeder&maxFeatures=1000000&outputFormat=application%2Fjson",
         title: "Central Feeder",
         minScale: 1155581,
         //visible: false,
         popupTemplate: {
           title: "Feeder",
           content: [
             {
               type: "fields",
               fieldInfos: [
                 {
                   fieldName: "cable_id",
                   visible: true,
                   label: "ID",
                   format: {
                     digitSeparator: true,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "capacity",
                   visible: true,
                   label: "Capacity",
                 },
                 {
                   fieldName: "pop_id",
                   visible: true,
                   label: "POP ID",
                   format: {
                     digitSeparator: false,
                     places: 0,
                   },
                 },
                 {
                   fieldName: "placement",
                   visible: true,
                   label: "Placement",
                 },
                 {
                   fieldName: "network",
                   visible: true,
                   label: "Network",
                 },
                 {
                   fieldName: "type",
                   visible: true,
                   label: "Type",
                 },
                 {
                   fieldName: "starting_point",
                   visible: true,
                   label: "Starting Point",
                 },
                 {
                   fieldName: "ending_point",
                   visible: true,
                   label: "Ending Point",
                 },
                 {
                   fieldName: "Town",
                   visible: true,
                   label: "Area",
                 },
                 {
                   fieldName: "city",
                   visible: true,
                   label: "City",
                 },
               ],
             },
           ],
         },
       });

       const centralZone = new GeoJSONLayer({
         url:
         api +
           "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3ACentral_zones_evw&maxFeatures=1000000&outputFormat=application%2Fjson",
         labelsVisible: false,
         title: "Central Zone",
         minScale: 1155581,
         outFields: ["*"],
       });
       
       const centralBackhaul = new GeoJSONLayer({
        url:
        api +
          "/geoserver/Central_Postgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Central_Postgis%3Acentral_backhaul&maxFeatures=1000000&outputFormat=application%2Fjson",
        labelsVisible: false,
        visible: false,
        title: "Central Backhaul",
        minScale: 1155581,
        outFields: ["*"],
        popupTemplate: {
          title: "Feeder",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "capacity",
                  visible: true,
                  label: "Capacity",
                },
                {
                  fieldName: "own",
                  visible: true,
                  label: "Own",
                },
                {
                  fieldName: "placement",
                  visible: true,
                  label: "Placement",
                },
              ]
            }
          ]
        }
      });

       view.centralCPELayer = centralCPELayer;
       view.centralInactiveCPE = centralInactiveCPE
       view.centralDC = centralDC;
       view.centralFAT = centralFAT;
       view.centralJoint = centralJoint;
       view.centralPOP = centralPOP;
       view.centralDistribution = centralDistribution;
       view.centralFeeder = centralFeeder;
       view.centralZone = centralZone;
       view.centralBackhaul = centralBackhaul

     });
   }
  return (
    <MapContext.Provider value={{view}}>{props.children}</MapContext.Provider>
  );
};

export default MapState;
