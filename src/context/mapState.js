import React, {useContext, useEffect,useState}  from "react";
import MapContext from "./mapContext";
import { authenticationService } from "../_services/authentication";
import { loadModules, setDefaultOptions } from "esri-loader";
import {api} from '../url'
import axios from 'axios'

import {version} from '../url'
setDefaultOptions({ version: version })

const MapState = (props) => {
  const view = {
    loginRole: {},
    region:[],
    center: [],
    scale: null,
    minScale: null,

    province: {},
    cities: {},

    recentDown: {},
    allCPE:[],
    customer: {},
    InactiveCPE: {},
    DC_ODB: {},
    FAT: {},
    Joint: {},
    POP: {},
    Distribution: {},
    Feeder: {},
    Zone: {},
    Backhaul: {},
    Outage:{},
    WMSlayer:{},

    vehicleLayer: {},

    graphicLayer: {},
    graphicLayerOffice: {},
    graphicLayerLOSiDC: {},
    graphicLayerLOPDC: {},
    graphicLayerKML: {},
    parcels: {},

    csvLayer: {},
  };

  authenticationService.currentUser.subscribe((x) => {
    if (x) {
     
      if (x.role === "SouthDEVuser") {
        view.region = ['South']
        let CQL_FILTER = `region= 'South'`;
        layers(CQL_FILTER);

        view.center.push(67.171837, 24.908468);
        view.scale = 144448;
        view.minScale = 300000;
      } else if (x.role === "NorthDEVuser") {
        view.region = ['North']
        let CQL_FILTER = `region= 'North'`;
        layers(CQL_FILTER);

        view.center.push(73.239156, 33.663228);
        view.scale = 144448;
        view.minScale = 300000;
      } else if (x.role === "CentralDEVuser") {
        view.region = ['Central']
        let CQL_FILTER = `region= 'Central'`;
        layers(CQL_FILTER);

        view.center.push(74.355626, 31.545676);
        view.scale = 144448;
        view.minScale = 300000;
      } else if (x.role === "Admin" || x.role === "CSD" || x.role === "NOC") {
        view.region = ['South','North','Central']
        let CQL_FILTER = `region in ('South','North','Central')`;
        layers(CQL_FILTER);

        view.center.push(70.320449, 30.694832);
        view.scale = 18489298;
        view.minScale = 9244649;
      }
    }

    return (view.loginRole = x);
  });

  function layers(CQL_FILTER, startIndex = 0, count = 100000) {

    const placeholders = view.region.map((region, index) => `'${region}'`).join(',');
    
    loadModules(
      ["esri/layers/GeoJSONLayer","esri/layers/WMSLayer", "esri/layers/GraphicsLayer", "esri/Graphic",
        "esri/config"
      ],
      {
        css: false,
      }
    ).then(([GeoJSONLayer,WMSLayer, GraphicsLayer, Graphic, esriConfig]) => {

      esriConfig.request.timeout = 300000;

      /*************************** NETWORK SERVICES ******************************/

      const customer = new GeoJSONLayer({
        url: api + "/geoserver/web_app/ows",
        customParameters: {
          CQL_FILTER: `region in (${placeholders}) and alarmstate in(2,4)`,
          //maxFeatures: "1000000",
          outputFormat: "application/json",
          request: "GetFeature",
          service: "WFS",
          typeName: "web_app:Customers_test",
          version: "2.0.0",
          count: count,           // how many per request
          startIndex: startIndex,
          sortBy: "id ASC" 
        },
        labelsVisible: false,
        title: "Active Customer",
        minScale: 1155581,
        legendEnabled: true,
        editingEnabled: true,
        visible: true,
        outFields: [
          "objectid",
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
          "uptime",
          "region",
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
                },
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

      const InactiveCPE = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ATerminated_CPE&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        title: "Inactive Customer",
        minScale: 1155581,
        legendEnabled: true,
        visible: false,
        selection: false,
        outFields: [
          "name",
          "id",
          "address",
          "pop_id",
          "mobilenum",
          "type",
          "area_town",
          "sub_area",
          "city",
          "status",
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
                },
              ],
            },
          ],
        },
      });

      const allCPE = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ACustomers&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        customParameters: {
          CQL_FILTER: CQL_FILTER,
          //maxFeatures: "1000000",
          outputFormat: "application/json",
          request: "GetFeature",
          service: "WFS",
          typeName: "web_app:Customers_test",
          version: "2.0.0",
          count: count,           // how many per request
          startIndex: startIndex,
          sortBy: "id ASC" 
        },
          title: "Inactive Customer",
        minScale: 1155581,
        legendEnabled: false,
        visible: false,
        selection: false,
        outFields: [
          "objectid",
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
          "uptime",
          "region",
        ],
      });

      const DC_ODB = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Adc_odb&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        title: "ODB/DC",
        // minScale: 36112,
        labelsVisible: false,
        visible: false,
        minScale: 1155581,
        outFields: [
          "objectid",
          "id",
          "name",
          "pop_id",
          "placement",
          "plot",
          "area",
          "sub_area",
          "city",
          "capacity",
          "splitter_count",
        ],
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
                  fieldName: "splitter_count",
                  visible: true,
                  label: "Splitter Count",
                },
              ],
            },
            {
              type: "text",
              text: "",
            },
          ],
        },
      });

      const FAT = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Afat&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        title: "FAT",
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
                  fieldName: "sub_area",
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

      const Joint = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Ajc&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        title: "Joint",
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
                  fieldName: "sub_area",
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

      const POP = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Apop&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
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
                  fieldName: "sub_area",
                  visible: true,
                  label: "block/Phase",
                },
              ],
            },
          ],
        },
      });

      const Feeder = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3AFeeder&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        title: "Feeder",
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
                  fieldName: "town",
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

      const Distribution = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ADistribution&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        title: "Distribution",
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
                  fieldName: "town",
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

      const Backhaul = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ABackhaul&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        labelsVisible: false,
        title: "Backhaul",
        visible: false,
        minScale: 1155581,
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
              ],
            },
          ],
        },
      });

      const Zone = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Azones&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        labelsVisible: false,
        title: "Zone",
        minScale: 1155581,
        outFields: ["cluster", "zone", "area", "sub_area", "city"],
      });

      const Outage = new GeoJSONLayer({
        url:
          api +
          `/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3Aoutage&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`,
        labelsVisible: false,
        title: "Outage",
        minScale: 1155581,
        outFields: [
          "cable_type",
          "olt",
          "fsp",
          "outage_time",
          "resolve_time",
          "landmark",
          "affected_customers",
          "category",
          "sub_category",
          "region",
          "comment"
        ],
        popupTemplate: {
          title: "Outage",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "cable_type",
                  visible: true,
                  label: "Cable Type",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "olt",
                  label: "OLT",
                  visible: true,
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "fsp",
                  label: "Affected FSPs",
                  visible: true,
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "affected_customers",
                  label: "Affected Customers",
                  visible: true,
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "outage_time",
                  visible: true,
                  label: "Outage Time",
                },
                {
                  fieldName: "resolve_time",
                  label: "Resolve Time",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "category",
                  visible: true,
                  label: "Category",
                },
                {
                  fieldName: "sub_category",
                  label: "Sub Category",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "landmark",
                  label: "Landmark",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                },
                {
                  fieldName: "comment",
                  label: "Comment",
                  format: {
                    digitSeparator: false,
                    places: 0,
                  },
                }
              ],
            },
          ],
        },
      });

      const WMSlayer = new WMSLayer({
        url: `${api}/geoserver/South_PostGIS/wms`,
        title: "Parcels",
        sublayers: [
          {
            name: "parcel_evw",
           // title: `${SelectTownData} - ${SelectBlockData} - ${SelectSubBlockData}`,
          },
        ],
        customLayerParameters: '',
      });

      /* allCPE.queryFeatures().then(function(response){
        view.allCPE = response.features
      }); */

      view.customer = customer;
      view.InactiveCPE = InactiveCPE;
      view.DC_ODB = DC_ODB;
      view.FAT = FAT;
      view.Joint = Joint;
      view.POP = POP;
      view.Feeder = Feeder;
      view.Distribution = Distribution;
      view.Backhaul = Backhaul;
      view.Zone = Zone;
      view.Outage = Outage
      view.WMSlayer = WMSlayer
      

      /*************************** OTHER SERVICES ******************************/

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

      // Vehicle layer
      const graphicLayer = new GraphicsLayer({
        title: "Vehicles",
        listMode: "show",
        labelsVisible: false,
        legendEnabled: true,
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
        legendEnabled: false,
        graphics: [],
        minScale: 1155581,
      });

      view.graphicLayerLOSiDC = graphicLayerLOSiDC;

      const graphicLayerLOPDC = new GraphicsLayer({
        title: "DC Outage",
        listMode: "hide",
        labelsVisible: false,
        legendEnabled: false,
        graphics: [],
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

      const recentDown = new GraphicsLayer({
        title: "RecentDown",
        listMode: "hide",
        labelsVisible: false,
        graphics: [],
        minScale: 1155581,
      });

      view.recentDown = recentDown;
    });
  }

  
  return (
    <MapContext.Provider value={{ view }}>
      {props.children}
    </MapContext.Provider>
  );
};

export default MapState;
