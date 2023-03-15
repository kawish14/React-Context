import React from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import "./css/layerlist.css";

export default class CentralLayerlist extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.layerLists = React.createRef();
  }
  componentDidMount() {
    let {
      centralCPELayer,
      centralPOP,
      centralFeeder,
      centralDistribution,
      centralJoint,
      centralDC,
      centralFAT,
      centralZone,
      graphicLayer,
      cities,
      recentDownCPE
    } = this.context.view;

    let view = this.props.view;

    loadModules(
      [
        "esri/widgets/Expand",
        "esri/widgets/LayerList",
        "esri/layers/GroupLayer",
      ],
      { css: false }
    ).then(([Expand, LayerList, GroupLayer]) => {
      let layerlist = new LayerList({
        view: view,
        container: this.layerLists.current,
        listItemCreatedFunction: function (event) {
          let item = event.item;

          if (item.title === "Central POP") {
            item.actionsSections = [
              [
                {
                  title: "Label POP",
                  className: "esri-icon-labels",
                  id: "label-south-pop",
                },
              ],
            ];
          }
          if (item.title === "Central Zone") {
            item.actionsSections = [
              [
                {
                  title: "Label Zone",
                  className: "esri-icon-labels",
                  id: "label-north-Zone",
                },
              ],
            ];
          }
          if (item.title === "Central ODB/DC") {
            item.actionsSections = [
              [
                {
                  title: "Label DC",
                  className: "esri-icon-labels",
                  id: "label-north-DC",
                },
              ],
            ];
          }
        },
      });

      //    view.ui.add(layerlist, 'top-right')

      layerlist.on("trigger-action", function (event) {
        var id = event.action.id;

        if (id === "label-south-pop") {
          if (centralPOP.labelsVisible === false) {
            centralPOP.labelsVisible = true;
          } else {
            centralPOP.labelsVisible = false;
          }
        }
        if (id === "label-north-DC") {
          if (centralDC.labelsVisible === false) {
            centralDC.labelsVisible = true;
          } else {
            centralDC.labelsVisible = false;
          }
        }
        if (id === "label-north-Zone") {
          if (centralZone.labelsVisible === false) {
            centralZone.labelsVisible = true;
          } else {
            centralZone.labelsVisible = false;
          }
        }
      });

      var FiberLayer = new GroupLayer({
        title: "Central OFC",
        layers: [centralFeeder, centralDistribution],
        visible: false
      });
      var LHR_Layers = new GroupLayer({
        title: "LHR Layers",
        layers: [
          centralZone,
          FiberLayer,
          centralDC,
          centralFAT,
          centralJoint,
          centralPOP,
          centralCPELayer,
        ],
      });

      var central_Layer = new GroupLayer({
        title: "Central Layer",
        layers: [LHR_Layers],
      });

      //view.map.add(cities)
      view.map.add(central_Layer);
      view.map.add(graphicLayer);
      view.map.add(recentDownCPE)
    });
  }
  render() {
    return <div ref={this.layerLists}></div>;
  }
}
