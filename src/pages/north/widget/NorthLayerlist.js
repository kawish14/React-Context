import React from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import NorthOFCStats from "../../../components/statistics/NorthOFCStats";
import "./css/layerlist.css";

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class NorthLayerlist extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.state = {
      isNorthModal: false,
      northDownFun: null,
    };

    this.toggleNorthModal = this.toggleNorthModal.bind(this);
    this.layerLists = React.createRef();
  }

  toggleNorthModal() {
    this.setState({
      isNorthModal: !this.state.isNorthModal,
    });
  }

  componentDidMount() {
      let _this = this
    let {
      northCPELayer,
      northPOP,
      northFeeder,
      northDistribution,
      northBackhaul,
      northJoint,
      northDC,
      northFAT,
      northZone,
      graphicLayer,
      graphicLayerOffice,
      graphicLayerDCoutage,
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
        
       /*    if (item.title === "ISB Layers") {
            item.actionsSections = [
              [
                  {
                    title: "OFC Stats",
                    className: "esri-icon-description",
                    id: "ofc north",
                  },
                ],
            ];
          } */

          if (item.title === "North POP") {
            item.actionsSections = [
              [
                {
                  title: "Label POP",
                  className: "esri-icon-labels",
                  id: "label-north-pop",
                },
              ],
            ];
          }
          if (item.title === "North Zone") {
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
          if (item.title === "North ODB/DC") {
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

      //  view.ui.add(layerlist, 'top-right')

      layerlist.on("trigger-action", function (event) {
        var id = event.action.id;
        
        if (id === "ofc north") {
            _this.toggleNorthModal();
          }

        if (id === "label-north-pop") {
          if (northPOP.labelsVisible === false) {
            northPOP.labelsVisible = true;
          } else {
            northPOP.labelsVisible = false;
          }
        }
        if (id === "label-north-DC") {
          if (northDC.labelsVisible === false) {
            northDC.labelsVisible = true;
          } else {
            northDC.labelsVisible = false;
          }
        }
        if (id === "label-north-Zone") {
          if (northZone.labelsVisible === false) {
            northZone.labelsVisible = true;
          } else {
            northZone.labelsVisible = false;
          }
        }
      });

      var FiberLayer = new GroupLayer({
        title: "North OFC",
        visible: false,
        layers: [northBackhaul,northFeeder, northDistribution],
      });
      var ISB_Layers = new GroupLayer({
        title: "ISB Layers",
        layers: [
          northZone,
          FiberLayer,
          northDC,
          northFAT,
          northJoint,
          northPOP,
          northCPELayer,
        ],
      });

      var north_Layer = new GroupLayer({
        title: "North Layer",
        layers: [ISB_Layers],
      });

      //view.map.add(cities);
      view.map.add(north_Layer);
      view.map.add(graphicLayer);
      view.map.add(graphicLayerOffice);
      view.map.add(graphicLayerDCoutage)
      view.map.add(recentDownCPE)
    });
  }

  northDownload = (e) => {
    this.setState({
      northDownFun: e,
    });
  };

  clickNorthFun = () => {
    var html = document.getElementById("table");
    this.state.northDownFun(html, "North Network Report.csv");
  };

  render() {
    return (
      <>
        <div ref={this.layerLists}></div>

        <Modal
          className="Modal"
          isOpen={this.state.isNorthModal}
          toggle={this.toggleNorthModal}
        >
          <ModalHeader className="ModalHeader" toggle={this.toggleNorthModal}>
            North Network Stats
            <i
              style={{ cursor: "pointer", marginLeft: "15px" }}
              class="fa fa-download"
              aria-hidden="true"
              onClick={this.clickNorthFun}
            />
          </ModalHeader>
          <NorthOFCStats
            childProp={(e) => {
              this.northDownload(e);
            }}
            view={this.props.view}
          />
        </Modal>
      </>
    );
  }
}
