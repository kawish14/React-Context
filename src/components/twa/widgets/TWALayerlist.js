import React from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import "./css/layerlist.css";

import {version} from '../../../url'
setDefaultOptions({ version: version })

let south_Layer = {};

export default class TWALayerlist extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);

    this.state = {
      isNavOpen: false,
      isModalOpen: false,
      isCentralModal: false,
      isNorthModal: false,

      southDownFun: null,
      centralDownFun: null,
      northDownFun: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.toggleCentralModal = this.toggleCentralModal.bind(this);
    this.toggleNorthModal = this.toggleNorthModal.bind(this);

    this.layerLists = React.createRef();
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }
  toggleCentralModal() {
    this.setState({
      isCentralModal: !this.state.isCentralModal,
    });
  }

  toggleNorthModal() {
    this.setState({
      isNorthModal: !this.state.isNorthModal,
    });
  }
  
  componentDidMount() {
    let _this = this;

    let {
      southCPELayer,
      southDC,
      southFAT,
      southJoint,
      southPOP,
      southDistribution,
      southFeeder,
      southZone,
      northCPELayer,
      northDC,
      northFAT,
      northJoint,
      northPOP,
      northDistribution,
      northFeeder,
      northZone,
      centralCPELayer,
      centralDC,
      centralFAT,
      centralJoint,
      centralPOP,
      centralDistribution,
      centralFeeder,
      centralZone,
      graphicLayer,
      graphicLayerOffice,
      province,
      cities
    } = this.context;

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

            if (item.layer.type != "group") {
              // don't show legend twice
              console.log(item.panel)
              item.panel = {
                content: "legend",
                open: false
              };
            }

            if (item.title === "KHI Layers") {
              item.actionsSections = [
                [
                  {
                    title: "Go to full extent",
                    className: "esri-icon-zoom-out-fixed",
                    id: "full-extent KHI",
                  },
                ],
              ];
            }

            if (item.title === "ISB Layers") {
              item.actionsSections = [
                [
                  {
                    title: "Go to full extent",
                    className: "esri-icon-zoom-out-fixed",
                    id: "full-extent ISB",
                  },
                ]
              ];
            }

            if (item.title === "LHR Layers") {
              item.actionsSections = [
                [
                  {
                    title: "Go to full extent",
                    className: "esri-icon-zoom-out-fixed",
                    id: "full-extent LHR",
                  },
                ]
              ];
            }
          },
      });

     // view.ui.add(layerlist, "top-right");

      layerlist.on("trigger-action", function (event) {
        var id = event.action.id;

        if (id === "full-extent KHI") {
          view
            .goTo({
              target: [67.233635, 24.905977],
              zoom: 11,
            })
            .catch(function (error) {
              if (error.name != "AbortError") {
                console.error(error);
              }
            });
        }

        if (id === "full-extent ISB") {
          view
            .goTo({
              target: [73.085348, 33.602628], 
              zoom: 11,
            })
            .catch(function (error) {
              if (error.name != "AbortError") {
                console.error(error);
              }
            });
        }

        if (id === "full-extent LHR") {
          view
            .goTo({
              target: [74.355626, 31.545676],
              zoom: 11,
            })
            .catch(function (error) {
              if (error.name != "AbortError") {
                console.error(error);
              }
            });
        }

      });

      var FiberLayer = new GroupLayer({
        title: "OFC",
        layers: [southFeeder, southDistribution],
      });

      var KHI_Layers = new GroupLayer({
        title: "KHI Layers",
        layers: [
          southZone,
          FiberLayer,
          southDC,
          southFAT,
          southJoint,
          southPOP,
          southCPELayer,
        ],
      });

      var ISB_FiberLayer = new GroupLayer({
        title: "OFC",
        layers: [northFeeder, northDistribution],
      });

      var ISB_Layers = new GroupLayer({
        title: "ISB Layers",
        layers: [
          northZone,
          ISB_FiberLayer,
          northDC,
          northFAT,
          northJoint,
          northPOP,
          northCPELayer,
        ],
      });

      
      var LHR_FiberLayer = new GroupLayer({
        title: "OFC",
        layers: [centralFeeder, centralDistribution],
      });

      var LHR_Layers = new GroupLayer({
        title: "LHR Layers",
          layers: [
          centralZone,
          LHR_FiberLayer,
          centralDC,
          centralFAT,
          centralJoint,
          centralPOP,
          centralCPELayer,
        ],
      });

      south_Layer = new GroupLayer({
        title: "South Layer",
        layers: [KHI_Layers],
      });

      var north_Layer = new GroupLayer({
        title: "North Layer",
        layers: [ISB_Layers],
      });

      var central_Layer = new GroupLayer({
        title: "Central Layer",
        layers: [LHR_Layers],
      });
      
      view.map.add(province)
     // view.map.add(cities)
      
      view.map.add(south_Layer);
      view.map.add(north_Layer);
      view.map.add(central_Layer);

     

     
    });
  }

  /* componentWillUnmount(){

        this.props.map.remove(south_Layer)
    } */




  render() {
    return (
     
      <div ref={this.layerLists}></div>
   
    );
  }
}
