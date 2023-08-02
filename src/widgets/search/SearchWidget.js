import React, { useState, useEffect, useContext, useRef } from "react";
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import axios from 'axios'
import { version } from "../../url";
import './search.css'
setDefaultOptions({ version: version });

export default function SearchWidget(props) {
  const context = useContext(MapContext);

  useEffect(() => {
    let { customer, DC_ODB,vehicleLayer } = context.view;
    let view = props.view;

    loadModules(["esri/layers/FeatureLayer","esri/widgets/Expand", "esri/widgets/Search","esri/Graphic"], {
      css: false,
    }).then(([FeatureLayer,Expand, Search,Graphic]) => {

      axios
      .get(
        "http://jazztrack.com.pk/ApisForJazzTrack/TrackerLastRecord?apiKey=03TWQ-91S7-SBD5&loginName=TRANSWORLD"
      )
      .then((response) => {
        let data = response.data.searchIDs;
        let graphic = data.map((e) => {
          let vehicleAttributes = {
            Ignition_On_Off: e.Ignition_On_Off,
            Speed: e.Speed,
            vehicle_model: e.vehicle_model,
            Location: e.Location,
            Tracker_Time: e.Tracker_Time,
            vehicle_make: e.vehicle_make,
            engine_no: e.engine_no,
            reg_no: e.reg_no,
            Longitude: e.Longitude,
            Latitude: e.Latitude,
          };

          let point = {
            type: "point",
            longitude: vehicleAttributes.Longitude,
            latitude: vehicleAttributes.Latitude,
          };

          return new Graphic({
            geometry: point,
            attributes: vehicleAttributes,
          });
        });

        let vehicleLayers = new FeatureLayer({
          title: "Vehicle Layer",
          objectIdField: "OBJECTID",
          source: graphic,
          fields: [
            {
              name: "OBJECTID",
              type: "oid",
              alias: "OBJECTID",
            },
            {
              name: "reg_no",
              type: "string",
              alias: "Registration Number",
            },
            {
              name: "Ignition_On_Off",
              type: "string",
              alias: "Ignition",
            },
            {
              name: "Speed",
              type: "double",
              alias: "Speed",
            },
            {
              name: "vehicle_model",
              type: "string",
              alias: "Model",
            },
            {
              name: "Location",
              type: "string",
              alias: "Location",
            },
            {
              name: "Latitude",
              type: "string",
              alias: "Latitude",
            },
            {
              name: "Longitude",
              type: "string",
              alias: "Longitude",
            },
          ],
        });
       
        vehicleLayer = vehicleLayers;

        let source = [
       /*    {
            layer: vehicleLayer,
            searchFields: ["reg_no"],
            displayField: "reg_no",
            exactMatch: false,
            outFields: ["*"],
            name: "Vehicle",
            placeholder: " Registration No.",
            zoomScale: 2257,
            maxResults: 6,
            maxSuggestions: 6,
            minSuggestCharacters: 0,
            resultGraphicEnabled:false,
            resultSymbol: {
              type: "simple-marker",
              color: [239, 25, 25,2],
              size: 10,
              width: 30,
              height: 30,
              xoffset: 0,
              yoffset: 0,
            },
            popupTemplate: {
            title: `Vehicle Information`,
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "reg_no",
                    label: "Registration No.",
                  },
                  {
                    fieldName: "Ignition_On_Off",
                    label: "Ignition",
                  },
                  {
                    fieldName: "vehicle_model",
                    label: "Model",
                  },
                  {
                    fieldName: "Speed",
                    label: "Speed",
                    format: {
                      digitSeparator: true,
                      places: 2,
                    },
                  },
                  {
                    fieldName: "Location",
                    label: "Location",
                  },
                ],
              },
            ],
          }
          }, */
          {
            layer: customer,
            searchFields: ["id","alias", "ticketid"],
            displayField: "name",
            exactMatch: false,
            outFields: ["*"],
            name: "Customers",
            placeholder: " Customer ID | Ticket ID",
            zoomScale: 2257,
            maxResults: 6,
            maxSuggestions: 6,
            minSuggestCharacters: 0,
            resultSymbol: {
              type: "simple-marker",
              color: [239, 25, 25],
              size: 10,
              width: 30,
              height: 30,
              xoffset: 0,
              yoffset: 0,
            },
          },
          {
            layer: DC_ODB,
            searchFields: ["id","name"],
            displayField: "name",
            exactMatch: false,
            outFields: ["*"],
            name: "DC/ODB",
            placeholder: " DC/ODB ID",
            zoomScale: 2257,
            maxResults: 6,
            maxSuggestions: 6,
            minSuggestCharacters: 0,
            resultSymbol: {
              type: "simple-marker",
              color: [239, 25, 25],
              size: 10,
              width: 30,
              height: 30,
              xoffset: 0,
              yoffset: 0,
            },
          },
        ];
        
         let searchWidget = new Expand({
            content: new Search({
              view: view,
              popupEnabled: true,
              includeDefaultSources: true,
              searchAllEnabled: false,
              locationEnabled: false,
              sources: [],
            }),
            view: view,
            group: "bottom-right",
            expanded: false,
            expandTooltip:"Search"
          }); 

          searchWidget.content.sources = source;
          view.ui.add(searchWidget, "top-right");

        //  searchEvent(searchWidget.content)
      
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    });
  }, []);

  return null
}
