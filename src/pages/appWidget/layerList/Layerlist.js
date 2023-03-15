import React from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
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

import SouthOFCStats from "../../../components/statistics/SouthOFCStats";
import CentralOFCStats from "../../../components/statistics/CentralOFCStats";
import NorthOFCStats from "../../../components/statistics/NorthOFCStats";
import { listItems } from "./listItems";
import { labelLayer } from "./labelLayer";
import Parcels from "../../south/Parcels";

import {version} from '../../../url'
setDefaultOptions({ version: version })

let south_Layer = {};
let north_Layer = {};
let central_Layer = {};

let KHI_Layers, ISB_Layers, LHR_Layers;

export default class Layerlist extends React.Component {
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

      parcelLayer:null
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

  southLayers() {
    let layers = this.context.view;
    let view = this.props.view;

    loadModules(["esri/layers/GroupLayer"], { css: false }).then(
      ([GroupLayer]) => {
        var FiberLayer = new GroupLayer({
          title: "OFC",
          layers: [layers.southDistribution, layers.southFeeder , layers.southBackhaul],
          visible: false,
        });

        KHI_Layers = new GroupLayer({
          title: "KHI Layers",
          layers: [
            layers.southZone,
            FiberLayer,
            layers.southFAT,
            layers.southJoint,
            layers.southDC,
           // layers.southInactiveCPE,
            layers.southCPELayer,
            layers.southPOP,
          ],
          visible: false,
        });

        south_Layer = new GroupLayer({
          title: "South Layer",
          layers: [KHI_Layers],
          visible: false,
        });

        //view.map.add(this.state.parcelLayer)
        view.map.add(south_Layer);
        view.map.add(layers.graphicLayer);
        view.map.add(layers.graphicLayerLOSiDC);
        view.map.add(layers.graphicLayerLOPDC)
        view.map.add(layers.recentDownSouth);

        if (layers.loginRole.role === "SouthDEVuser"){
            view.map.add(layers.graphicLayerKML)
            KHI_Layers.visible = true
            south_Layer.visible = true
        }else{
          KHI_Layers.layers.splice(5,0,layers.southInactiveCPE)
          //KHI_Layers.layers.push(layers.southInactiveCPE)
        }

      }
    );
  }

  northLayers() {
    let layers = this.context.view;
    let view = this.props.view;

    loadModules(["esri/layers/GroupLayer"], { css: false }).then(
      ([GroupLayer]) => {
        var ISB_FiberLayer = new GroupLayer({
          title: "OFC",
          layers: [ layers.northDistribution, layers.northFeeder,layers.northBackhaul],
          visible: false,
        });

        ISB_Layers = new GroupLayer({
          title: "ISB Layers",
          layers: [
            layers.northZone,
            ISB_FiberLayer,
            layers.northFAT,
            layers.northJoint,
            layers.northDC,
           // layers.northInactiveCPE,
            layers.northCPELayer,
            layers.northPOP,
          ],
          visible: false,
        });

        north_Layer = new GroupLayer({
          title: "North Layer",
          layers: [ISB_Layers],
          visible: false,
        });

        view.map.add(north_Layer);
        view.map.add(layers.graphicLayerDCoutage);
        view.map.add(layers.recentDownNorth);
        view.map.add(layers.graphicLayerLOSiDC);
        view.map.add(layers.graphicLayerLOPDC)

        if (layers.loginRole.role === "NorthDEVuser") {
          view.map.add(layers.graphicLayer);

          ISB_Layers.visible = true
          north_Layer.visible = true
        }
        else{
          ISB_Layers.layers.splice(5,0,layers.northInactiveCPE)
        }

      }
    );
  }

  centralLayers() {
    let layers = this.context.view;
    let view = this.props.view;

    loadModules(["esri/layers/GroupLayer"], { css: false }).then(
      ([GroupLayer]) => {
        var LHR_FiberLayer = new GroupLayer({
          title: "OFC",
          layers: [layers.centralDistribution,layers.centralFeeder, layers.centralBackhaul],
          visible: false,
        });

        LHR_Layers = new GroupLayer({
          title: "LHR Layers",
          layers: [
            layers.centralZone,
            LHR_FiberLayer,
            layers.centralFAT,
            layers.centralJoint,
            layers.centralDC,
           // layers.centralInactiveCPE,
            layers.centralCPELayer,
            layers.centralPOP,
          ],
          visible: false,
        });

        central_Layer = new GroupLayer({
          title: "Central Layer",
          layers: [LHR_Layers],
          visible: false,
        });

        view.map.add(central_Layer);
        view.map.add(layers.graphicLayerDCoutage);
        view.map.add(layers.recentDownCentral);

        if (layers.loginRole.role === "CentralDEVuser"){
          view.map.add(layers.graphicLayer);
     
          LHR_Layers.visible = true
          central_Layer.visible = true
        }
        else{
          LHR_Layers.layers.splice(5,0,layers.centralInactiveCPE)
        }

      }
    );
  }

  componentDidMount() {
    let _this = this;
    let layers = this.context.view;
    let view = this.props.view;

    if (layers.loginRole.role === "SouthDEVuser") this.southLayers();
    if (layers.loginRole.role === "NorthDEVuser") this.northLayers();
    if (layers.loginRole.role === "CentralDEVuser") this.centralLayers();
    if (layers.loginRole.role === "Admin") {
      this.centralLayers();
      this.northLayers();
      this.southLayers();
    }

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
          listItems(event);
        },
      });

      layerlist.on("trigger-action", function (event) {
        var id = event.action.id;

        labelLayer(
          id,
          layers,
          view,
          south_Layer,
          KHI_Layers,
          north_Layer,
          ISB_Layers,
          central_Layer,
          LHR_Layers
        );

        if (id === "ofc south") {
          _this.toggleModal();
        }

        if (id === "ofc central") {
          _this.toggleCentralModal();
        }

        if (id === "ofc north") {
          _this.toggleNorthModal();
        }
      });

      //view.map.add(cities)
      view.map.add(layers.province);
      view.map.add(layers.graphicLayerOffice);
    });
  }
  /* componentWillUnmount(){

        this.props.map.remove(south_Layer)
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

  centralDownload = (e) => {
    this.setState({
      centralDownFun: e,
    });
  };

  clickCentralFun = () => {
    var html = document.getElementById("table");
    this.state.centralDownFun(html, "Central Network Report.csv");
  };

  northDownload = (e) => {
    this.setState({
      northDownFun: e,
    });
  };

  clickNorthFun = () => {
    var html = document.getElementById("table");
    this.state.northDownFun(html, "North Network Report.csv");
  };

  fromChild = (e) =>{
    this.setState({
      parcelLayer:e
    })
    }

    componentDidUpdate(prevProps, prevState){
      if(prevState.parcelLayer !== this.state.parcelLayer){
        this.props.view.map.removeAll()
        this.southLayers()
      }

    }
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

        <Modal
          className="Modal"
          isOpen={this.state.isCentralModal}
          toggle={this.toggleCentralModal}
        >
          <ModalHeader className="ModalHeader" toggle={this.toggleCentralModal}>
            Central Network Stats
            <i
              style={{ cursor: "pointer", marginLeft: "15px" }}
              class="fa fa-download"
              aria-hidden="true"
              onClick={this.clickCentralFun}
            />
          </ModalHeader>
          <CentralOFCStats
            childProp={(e) => {
              this.centralDownload(e);
            }}
            view={this.props.view}
          />
        </Modal>

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

      {/*   {this.context.view.loginRole.role === "SouthDEVuser" ?
        <Parcels view={this.props.view} parcelLayer={this.fromChild} />
        : null
        } */}
        
      </>
    );
  }
}
