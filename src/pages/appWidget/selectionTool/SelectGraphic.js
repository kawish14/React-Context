import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  createRef,
} from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import { NavLink, NavItem } from "reactstrap";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import "./css/widget.css";

import {version} from '../../../url'
setDefaultOptions({ version: version })

export default class SelectGraphic extends React.Component {
  static contextType = mapContext;

  constructor(props) {
    super(props);
    this.state = {
      pointerEvent: "auto",

      polygonGraphicsLayer: null,
      polylineGraphicsLayer: null,

      polylineLabel: null,

      selectionTable: false,

      ActiveCPEHighlight: null,
      InactiveCPEHighlight: null,
      DCHighlight: null,

      CPETable: false,
      CPEnav: false,
      CPEtoggle: false,
      dataToExcel: [],

      id: null,
      selectAttributes: [],
      backgroundColor: "#252525",
    };

    this.clearSelection = React.createRef();
    this.selectByPolygon = React.createRef();
    this.polyline = React.createRef();
    this.csvLink_southCPE = React.createRef();
    this.lengthDiv = React.createRef();
  }

  empty = (arr) => (arr.length = 0);

  componentDidMount() {
    let context = this.context.view;
    let _this = this;
    const view = this.props.view;

    view.watch(["stationary"], function () {
      let scale = Math.round(view.scale * 1) / 1;

      if (scale <= 288895) {
        _this.setState({
          visibility: "visible",
        });

        view.ui.add(_this.selectByPolygon.current, "top-right");
        view.ui.add(_this.polyline.current, "top-right");
        view.ui.add(_this.clearSelection.current, "top-right");
      }

      if (scale > 288895) {
        _this.setState({
          visibility: "hidden",
        });

        view.ui.remove(_this.selectByPolygon.current, "top-right");
        view.ui.remove(_this.polyline.current, "top-right");
        view.ui.remove(_this.clearSelection.current, "top-right");
      }
    });

    loadModules(["esri/layers/GraphicsLayer"], { css: false }).then(
      ([GraphicsLayer]) => {
        _this.setState({
          polygonGraphicsLayer: new GraphicsLayer({
            listMode: "hide",
          }),
          polylineGraphicsLayer: new GraphicsLayer({
            listMode: "hide",
          }),
        });

        view.ui.add(_this.selectByPolygon.current, "top-right");
        view.ui.add(_this.polyline.current, "top-right");
        view.ui.add(_this.clearSelection.current, "top-right");

        view.map.addMany([
          _this.state.polygonGraphicsLayer,
          _this.state.polylineGraphicsLayer,
        ]);
      }
    );
  }

  selectByGraphic = async () => {
    let _this = this;
    let view = this.props.view;

    this.state.polygonGraphicsLayer.removeAll();

    this.setState({
      pointerEvent: "none",
    });

    loadModules(
      [
        "esri/widgets/Sketch/SketchViewModel",
        "esri/widgets/Sketch",
        "esri/geometry/geometryEngineAsync",
      ],
      { css: false }
    ).then(([SketchViewModel,Sketch, geometryEngineAsync]) => {
      view.popup.close();

      const sketchViewModel = new SketchViewModel({
        view: view,
        layer: _this.state.polygonGraphicsLayer,
        creationMode: "update" 
      });
      //view.ui.add(sketchViewModel, "top-right");
      sketchViewModel.create("polygon");

      sketchViewModel.on("create", async (event) => {

         if (event.state === "complete") {

          //_this.state.polygonGraphicsLayer.remove(event.graphic)

          this.setState({
            pointerEvent: "auto",
            CPEnav: false,
          });
          _this.props.changeTableHeight('16%')
          await this.selectFeatures(event.graphic.geometry);
        } 

      });

      sketchViewModel.on("update", async (event) => {
        const eventInfo = event.toolEventInfo;
     
        // update the filter every time the user moves the filtergeometry
         if (
          event.toolEventInfo && (
          event.toolEventInfo.type.includes("scale-stop") || event.toolEventInfo.type.includes("reshape-stop") ||
          event.toolEventInfo.type === "move-stop")
        ) {
      
          await this.selectFeatures(event.graphics[0].geometry);
        } 
      });
    });
  };

  activeCPE = (data) => {
    let arr = [];

    data.forEach((e, i) => {
      
      let obj = {
        attributes: {
          OBJECTID: e.attributes.objectid,
          NAME: e.attributes.name,
          "CUSTOMER ID": e.attributes.id,
          ADDRESS: e.attributes.address,
          "CONTACT#": e.attributes.mobilenum,
          "DC/ODB ID": e.attributes.dc_id,
          AREA: e.attributes.area_town,
          "BLOCK/PHASE": e.attributes.sub_area,
          CITY: e.attributes.city,
          "ACTIVATION DATE": e.attributes.activationdate,
          TYPE: e.attributes.type,
          CATEGORY: e.attributes.category,
          OLT: e.attributes.olt,
          FRAME: e.attributes.frame,
          SLOT: e.attributes.slot,
          PORT: e.attributes.port,
          "ONT ID": e.attributes.ontid,
          "ONT Model": e.attributes.ontmodel,
          ALARM: e.attributes.alarminfo,
          BANDWIDTH: e.attributes.bandwidth,
          "LAST UP TIME": e.attributes.uptime,
          "LAST DOWN TIME": e.attributes.downtime,
          "TICKET ID": e.attributes.ticketid,
          "TICKET STATUS": e.attributes.ticketstatus,
          "TICKET TYPE": e.attributes.tickettype,
          "TICKET OPEN TIME": e.attributes.ticketopentime,
          "TICKET CLOSE TIME": e.attributes.ticketresolvetime,
        },
      };

      arr.push(obj);
    });

    return arr;
  };

  selectFeatures = async (geometry) => {
    let obj = {};

    this.empty(this.state.selectAttributes);

    let context = this.context.view;
    let _this = this;

    const query = {
      spatialRelationship: "intersects",
      geometry: geometry,
      returnGeometry: true
    };

    await this.props.layerViews.forEach( async (element) => {
      if (element) {
        if (element.visible === true) {
          await element.queryFeatures(query).then((results) => {
            if (results.features.length === 0) {
              return null;
            } else {
              switch (element.layer.title) {
                case "South Customer":
                case "North Customer":
                case "Central Customer":
                  let activeCPE = _this.activeCPE(results.features);
                  obj.ActiveCPE = activeCPE;
                  if (_this.state.ActiveCPEHighlight) {
                    _this.state.ActiveCPEHighlight.remove();
                  }
                  _this.setState({
                    ActiveCPEHighlight: element.highlight(results.features),
                    CPEnav: true,
                    id: "ActiveCPE",
                  });
                  break;
                case "South InActive Customer":
                case "North InActive Customer":
                case "Central InActive Customer":
                  obj.InActiveCPE = results.features;
                  if (_this.state.InactiveCPEHighlight) {
                    _this.state.InactiveCPEHighlight.remove();
                  }
                  _this.setState({
                    InactiveCPEHighlight: element.highlight(results.features),
                    CPEnav: true,
                    id: "InActiveCPE",
                  });
                  break;
                case "South ODB/DC":
                case "North ODB/DC":
                case "Central ODB/DC":
                  obj.DC = results.features;
                  if (_this.state.DCHighlight) {
                    _this.state.DCHighlight.remove();
                  }
                  _this.setState({
                    DCHighlight: element.highlight(results.features),
                    CPEnav: true,
                    id: "DC",
                  });
                  break;
                default:
              }

              _this.setState({
                selectAttributes: [obj],
                CPETable: true,
                selectionTable: true,
              });
              _this.props.summaryTableFun(true);
            }
          });
        }
      }
    });
  };

  drawPolyline = () => {
    let polylineLength, graphic

    let _this = this;
    let view = this.props.view;
 
    this.state.polylineGraphicsLayer.removeAll();
    this.props.view.graphics.remove(this.state.polylineLabel);

    this.setState({
      pointerEvent: "none",
    });

    loadModules(
      [
        "esri/widgets/Sketch/SketchViewModel",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
      ],
      { css: false }
    ).then(([SketchViewModel, geometryEngine, Graphic]) => {
      view.popup.close();

      const sketchViewModel = new SketchViewModel({
        view: view,
        layer: _this.state.polylineGraphicsLayer,
      });

      sketchViewModel.create("polyline");

      sketchViewModel.on("create", async (event) => {
        
        if (event.state === "complete") {
          this.setState({
            pointerEvent: "auto",
          });

          graphic = new Graphic({
            geometry: event.graphic.geometry,
            symbol: {
              type: "simple-line", // autocasts as new SimpleFillSymbol
              color: "red", // #087de1 // #EBEB00
              width: 2,
              cap: "round",
              join: "round",
            },
          });
      
          _this.state.polylineGraphicsLayer.graphics.add(graphic);

          polylineLength = geometryEngine.geodesicLength(
            graphic.geometry,
            "meters"
          );

          let textSymbol = {
            type: "text", // autocasts as new TextSymbol()
            color: "white",
            haloColor: "black",
            haloSize: 2,
            text: polylineLength.toFixed(3) + " meter",
            xoffset: 3,
            yoffset: 3,
            angle: -48,
            horizontalAlignment: "right",
            font: {
              // autocasts as new Font()
              size: 12,
              family: "sans-serif",
              weight: "bold",
            },
          };

          let graphicLabel = new Graphic({
            geometry: graphic.geometry.extent.center,
            //southCPEAttributes: item.southCPEAttributes,
            symbol: textSymbol,
            labelPlacement: "above-along",
          });

          _this.setState({
            polylineLabel: graphicLabel,
          });

          view.graphics.add(_this.state.polylineLabel);
        }
      });

      sketchViewModel.on("update", async (event) => {

        // update the filter every time the user moves the filtergeometry
         if (
          event.toolEventInfo && (
          event.toolEventInfo.type.includes("scale-stop") || event.toolEventInfo.type.includes("reshape-stop") ||
          event.toolEventInfo.type === "move-stop")
        ) {
      
          graphic.geometry = event.graphics[0].geometry ;

          this.state.polylineGraphicsLayer.removeAll();
          this.props.view.graphics.remove(this.state.polylineLabel);

          _this.state.polylineGraphicsLayer.graphics.add(graphic);  

          polylineLength = geometryEngine.geodesicLength(
            graphic.geometry,
            "meters"
          );

          let textSymbol = {
            type: "text", // autocasts as new TextSymbol()
            color: "white",
            haloColor: "black",
            haloSize: 2,
            text: polylineLength.toFixed(3) + " meter",
            xoffset: 3,
            yoffset: 3,
            angle: -48,
            horizontalAlignment: "right",
            font: {
              // autocasts as new Font()
              size: 12,
              family: "sans-serif",
              weight: "bold",
            },
          };

          let graphicLabel = new Graphic({
            geometry: graphic.geometry.extent.center,
            //southCPEAttributes: item.southCPEAttributes,
            symbol: textSymbol,
            labelPlacement: "above-along",
          });

          _this.setState({
            polylineLabel: graphicLabel,
          });

          view.graphics.add(_this.state.polylineLabel);
     
        } 
      });

    });
  };

  clearSelections = () => {
    this.props.summaryTableFun(false);
    this.props.changeTableHeight(null)
    this.state.polylineGraphicsLayer.removeAll();

    if (this.state.polylineLabel) {
      this.props.view.graphics.remove(this.state.polylineLabel);
    }

    this.setState({
      selectionTable: false,

      southCPEAttributes: false,
      CPETable: false,

      InactiveCPEAttributes: false,
      InactiveCPETable: false,
    });

    if (this.state.polygonGraphicsLayer !== null) {
      this.state.polygonGraphicsLayer.removeAll();
      //this.props.changeMapHeight("80vh");
    }

    if (this.state.ActiveCPEHighlight) {
      this.state.ActiveCPEHighlight.remove();
    }
    if (this.state.InactiveCPEHighlight) {
      this.state.InactiveCPEHighlight.remove();
    }
    if (this.state.DCHighlight) {
      this.state.DCHighlight.remove();
    }
  };

  /*********************** Toggle to view download Link ************************/

  CPEtoggle = (event) => {
    this.setState({
      CPEtoggle: true, // download link
      id: event.target.name,
      // CPETable: true,
    });

    this.empty(this.state.dataToExcel);
    this.state.selectAttributes.map((data, i) => {
      data[event.target.name].forEach((e) => {
        this.state.dataToExcel.push(e.attributes);
        this.setState({
          dataToExcel: this.state.dataToExcel,
        });
      });
    });
  };

  /****************************  Download Table to CSV file ******************************/

  CPEdownload = (filename) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const ws = XLSX.utils.json_to_sheet(this.state.dataToExcel);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, filename + fileExtension);
  };

  componentWillUnmount() {
    this.props.view.map.removeMany([
      this.state.polygonGraphicsLayer,
      this.state.polylineGraphicsLayer,
    ]);
  }

  render() {
    return (
      <div>
        <div
          ref={this.selectByPolygon}
          class="esri-widget esri-widget--button esri-widget esri-interactive"
          title="Select features by polygon"
          onClick={this.selectByGraphic}
          style={{
            pointerEvents: this.state.pointerEvent,
            visibility: this.state.visibility,
          }}
        >
          <span class="esri-icon-polygon"></span>
        </div>

        <div
          ref={this.polyline}
          onClick={(e) => this.drawPolyline(e)}
          className="esri-widget esri-widget--button esri-interactive"
          title="Draw polyline"
          style={{
            pointerEvents: this.state.pointerEvent,
            visibility: this.state.visibility,
          }}
        >
          <span className="esri-icon-polyline"></span>
        </div>

        <div
          ref={this.clearSelection}
          class="esri-widget esri-widget--button esri-widget esri-interactive"
          title="Clear selection"
          onClick={this.clearSelections}
          style={{
            pointerEvents: this.state.pointerEvent,
            visibility: this.state.visibility,
          }}
        >
          <span class="esri-icon-erase"></span>
        </div>

        <div style={{ backgroundColor: "rgb(52, 58, 64)" }}>
          {this.state.selectionTable ? (
            <ul className="nav nav-tabs" navbar>
              {/************************ Selection Tab of Table **********************/}

              {this.state.CPEnav ? (
                <>
                  {this.state.selectAttributes.map((data, i) => {
                    return (
                      <>
                        {Object.keys(data).map((name) => {
                          return (
                            <li className="southCPE-tab" id={name}>
                              <strong>
                                <a
                                  data-toggle="tab"
                                  href="#southCPE"
                                  name={name}
                                  onClick={this.CPEtoggle}
                                >
                                  {name} - {data[name].length}
                                </a>
                              </strong>
                            </li>
                          );
                        })}
                      </>
                    );
                  })}
                </>
              ) : (
                <p>LOADING.......</p>
              )}

              {/************************* Download Link **********************/}

              {this.state.CPEtoggle ? (
                <NavItem className="ml-auto">
                  <NavLink onClick={() => this.CPEdownload(this.state.id)}>
                    <i className="fas fa-file-download"></i>
                  </NavLink>
                </NavItem>
              ) : null}
            </ul>
          ) : null}

          {/**************************** South customer Table ********************************/}
          {/* Customer Table */}
          {this.state.CPETable ? (
            <div className="tab-content">
              <div id="southCPE" class="tab-pane fade in active">
                <table id="southCPEcsv" className="graphicTable">
                  <thead className="thead">
                    <tr>
                      {this.state.selectAttributes.map((layer, i) => {
                        return Object.keys(
                          layer[this.state.id][0].attributes
                        ).map((heading, index) => {
                          return <th key={heading}>{heading}</th>;
                        });
                      })}
                    </tr>
                  </thead>
                  <tbody className="tbody">
                    {this.state.selectAttributes.map((layer, i) => {
                      return layer[this.state.id].map((data, index) => {
                        return (
                          <tr key={index}>
                            {Object.values(data.attributes).map((raw) => {
                              return <td key={index}>{raw}</td>;
                            })}
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
