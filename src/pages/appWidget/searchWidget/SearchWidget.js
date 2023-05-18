import React from "react";
import MapContext from "../../../context/mapContext";
import { authenticationService } from "../../../_services/authentication";
import { loadModules, setDefaultOptions } from "esri-loader";

import {version} from '../../../url'
setDefaultOptions({ version: version })

export default class SearchWidget extends React.Component {
  static contextType = MapContext;

  componentDidMount() {
    let { southCPELayer, northCPELayer, centralCPELayer, loginRole,southDC, northDC,centralDC } = this.context.view;

    let view = this.props.view;

    loadModules(
      [
        "esri/widgets/Expand",
        "esri/widgets/Search",
        "esri/layers/GroupLayer",
      ],
      { css: false }
    ).then(([Expand, Search,GroupLayer]) => {

  
      let source = [
        // 0
        {
          layer: southCPELayer,
          searchFields: ["id", "ticketid"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "South Customers",
          placeholder: "210305138 | 514030",
          scale: 10,
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
        // 1
        {
          layer: southDC,
          searchFields: ["id", "name"],
          displayField: "id",
          exactMatch: false,
          outFields: ["*"],
          name: "South DC",
          placeholder: "210501",
          scale: 10,
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
        // 2
        {
          layer: centralCPELayer,
          searchFields: ["id", "ticketid"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "Central Customers",
          placeholder: "420106139 | 514030",
          scale: 10,
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
        // 3
        {
          layer: centralDC,
          searchFields: ["id", "name"],
          displayField: "id",
          exactMatch: false,
          outFields: ["*"],
          name: "Central DC",
          placeholder: "4201057",
          scale: 10,
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
        // 4
        {
          layer: northCPELayer,
          searchFields: ["id", "ticketid"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "North Customers",
          placeholder: "510105526 | 514030",
          scale: 10,
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
        // 5
        {
          layer: northDC,
          searchFields: ["id", "name"],
          displayField: "id",
          exactMatch: false,
          outFields: ["*"],
          name: "North DC",
          placeholder: "5110353",
          scale: 10,
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
        }
      ];

      var searchWidget = new Expand({
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

      view.ui.add(searchWidget, "top-right");

    
      if(loginRole.role === "SouthDEVuser") {
        searchWidget.content.sources = [source[0],source[1]];

        searchWidget.content.on('search-complete', (e) => {
          southDC.popupTemplate.actions = [];
        });
      }

      if(loginRole.role === "NorthDEVuser" ) {
        searchWidget.content.sources = [source[4],source[5]];

        searchWidget.content.on('search-complete', (e) => {
          northDC.popupTemplate.actions = [];
        });
      }

      if(loginRole.role === "CentralDEVuser") {
        searchWidget.content.sources = [source[2],source[3]];

        searchWidget.content.on('search-complete', (e) => {
          centralDC.popupTemplate.actions = [];
        });
      }

      if(loginRole.role === "Admin") {
        searchWidget.content.sources = source;

        searchWidget.content.on('search-complete', (e) => {
          southDC.popupTemplate.actions = [];
          northDC.popupTemplate.actions = [];
          centralDC.popupTemplate.actions = [];
        });
      }

      if(loginRole.role === "CSD" ) {
        searchWidget.content.sources = [source[0],source[2],source[4]]
      }
      
    });
  }
  render() {
    return null;
  }
}
