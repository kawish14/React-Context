import React from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import SouthOFCStats from "../../../components/statistics/SouthOFCStats";
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
} from "reactstrap"

setDefaultOptions({ version: '4.25' })
let south_Layer = {};

export default class Layerlist extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      southDownFun: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.layerLists = React.createRef();
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  componentDidMount() {
    let _this = this
    let {
      southCPELayer,
      southInactiveCPE,
      southDC,
      southFAT,
      southJoint,
      southPOP,
      southDistribution,
      southFeeder,
      southBackhaul,
      southZone,
      graphicLayer,
      graphicLayerOffice,
      southGulshanHH,
      southGulshanConduit,
      graphicLayerLOSiDC,
      graphicLayerLOPDC,
      graphicLayerKML,
      Parcels,
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

          /* if (item.title === "KHI Layers") {
            item.actionsSections = [
              [
                {
                  title: "OFC Stats",
                  className: "esri-icon-description",
                  id: "ofc south",
                },
              ],
            ];
          } */
/* 
          if (item.layer.type != "group") {
            item.panel = {
              content: "legend",
              open: true
            };
          } */

          if (item.title === "Gulshan") {
            item.actionsSections = [
              [
                {
                  title: "Go to full extent",
                  className: "esri-icon-zoom-out-fixed",
                  id: "full-extent Gulshan",
                },
              ],
              /* [
                    {
                      title: "Statistic",
                      className: "esri-icon-description",
                      id: "Gulshan-Stats",
                    },
                  ], */
            ];
          }

          if (item.title === "South Zone") {
            item.actionsSections = [
              [
                {
                  title: "Label Zone",
                  className: "esri-icon-labels",
                  id: "label-Zone",
                },
              ],
            ];
          }

          if (item.title === "FAT") {
            item.actionsSections = [
              [
                {
                  title: "Label FAT",
                  className: "esri-icon-labels",
                  id: "label-FAT",
                },
              ],
            ];
          }
          if (item.title === "POP") {
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
          if (item.title === "South ODB/DC") {
            item.actionsSections = [
              [
                {
                  title: "Label DC",
                  className: "esri-icon-labels",
                  id: "label-south-DC",
                },
              ],
            ];
          }
        },
      });

      //view.ui.add(layerlist, "top-right");

      layerlist.on("trigger-action", function (event) {
        var id = event.action.id;

        if (id === "ofc south") {
          _this.toggleModal();
        }

        /*   if (id === "Gulshan-Stats") {
            _this.toggleModal();
          } */

        if (id === "full-extent Gulshan") {
          view
            .goTo({
              target: [67.084461, 24.910881],
              zoom: 14,
            })
            .catch(function (error) {
              if (error.name != "AbortError") {
                console.error(error);
              }
            });
        }

        if (id === "label-Zone") {
          if (southZone.labelsVisible === false) {
            southZone.labelsVisible = true;
          } else {
            southZone.labelsVisible = false;
          }
        }

        if (id === "label-south-pop") {
          if (southPOP.labelsVisible === false) {
            southPOP.labelsVisible = true;
          } else {
            southPOP.labelsVisible = false;
          }
        }

        if (id === "label-south-DC") {
          if (southDC.labelsVisible === false) {
            southDC.labelsVisible = true;
          } else {
            southDC.labelsVisible = false;
          }
        }
      });

      var FiberLayer = new GroupLayer({
        title: "OFC",
        layers: [southFeeder, southDistribution,southBackhaul],
        visible: false
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
          southInactiveCPE,
          southCPELayer
        ],
      });

      let gulshan = new GroupLayer({
        title: "Gulshan",
        layers: [southGulshanConduit, southGulshanHH],
      });

      let project = new GroupLayer({
        title: "Project",
        layers: [gulshan],
        visible: false,
      });

      south_Layer = new GroupLayer({
        title: "South Layer",
        layers: [KHI_Layers, /* project */],
        visibilityMode: "inherited", // inherited, independent, exclusive
      });

     // view.map.add(cities)
      view.map.add(graphicLayerKML)
      view.map.add(south_Layer);
      view.map.add(graphicLayer);
      view.map.add(graphicLayerOffice);
      view.map.add(graphicLayerLOSiDC);
      view.map.add(graphicLayerLOPDC)
      view.map.add(recentDownCPE)
 
    });
  }
  /* componentWillUnmount(){

        this.props.view.map.remove(south_Layer)
        alert("Un mount")
    } */

    southDownload = (e) => {
      this.setState({
        southDownFun: e,
      });
    };
  
    clickSouthFun = () => {
      var html = document.getElementById("table");
      this.state.southDownFun(html, "South Network Report.csv");
    };

  render() {
      return (
      <>
      <div ref={this.layerLists}></div>
      
        <Modal
          className="Modal"
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
        >
          <ModalHeader className="ModalHeader" toggle={this.toggleModal}>
            South Network Stats
            <i
              style={{ cursor: "pointer", marginLeft: "15px" }}
              class="fa fa-download"
              aria-hidden="true"
              onClick={this.clickSouthFun}
            />
          </ModalHeader>
          <SouthOFCStats
            childProp={(e) => {
              this.southDownload(e);
            }}
            view={this.props.view}
          />
        </Modal>
       

      </>
    );
  }
}
