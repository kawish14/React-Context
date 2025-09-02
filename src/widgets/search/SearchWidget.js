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
      
     

    });
  }, []);

  return null
}
