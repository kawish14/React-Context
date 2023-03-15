import React from "react";
import MapContext from "../../../context/mapContext";

import { loadModules, setDefaultOptions } from "esri-loader";

import {version} from '../../../url'
setDefaultOptions({ version: version })

export default class TWASearch extends React.Component {
  static contextType = MapContext;

  componentDidMount() {
    let { southCPELayer, northCPELayer, centralCPELayer } = this.context;

    let view = this.props.view;

    loadModules(
      [
        "esri/widgets/Expand",
        "esri/widgets/LayerList",
        "esri/layers/GeoJSONLayer",
        "esri/widgets/Search",
      ],
      { css: false }
    ).then(([Expand, LayerList, GeoJSONLayer, Search]) => {
      let source = [
        {
          layer: southCPELayer,
          searchFields: ["id", "name"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "South Customers",
          placeholder: "CIR-1824",
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
        {
          layer: centralCPELayer,
          searchFields: ["id", "name"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "Central Customers",
          placeholder: "CIR-2170",
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
        {
          layer: northCPELayer,
          searchFields: ["id", "name"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "North Customers",
          placeholder: "	CIR-1960",
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
      ];
      var searchWidget = new Expand({
        content: new Search({
          view: view,
          popupEnabled: true,
          includeDefaultSources: true,
          searchAllEnabled: false,
          sources: [],
        }),
        view: view,
        group: "bottom-right",
        expanded: false,
      });

      view.ui.add(searchWidget, "top-right");
      searchWidget.content.sources = source;
    });
  }
  render() {
    return null;
  }
}
