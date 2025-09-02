import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  createRef,
} from "react";
import mapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import { NavLink, NavItem } from "reactstrap";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import "./selection.css";

import Swal from "sweetalert2";

import { version } from "../../url";
setDefaultOptions({ version: version });

let sketchViewModel, debouncedRunQuery, sketchGeometry;

export default class SelectionTool extends React.Component {
  static contextType = mapContext;

  constructor(props) {
    super(props);
    this.state = {
      display: "block",
      visibility: "visible",
      activeButton: "",
      sketchLayer: null,
      bufferLayer: null,

      bufferSize: 0,

      polylineLength: null,
      polygonArea: null,

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
      disabled: true,
      noSelection: true,
      activeTab:''
    };

    this.queryDiv = React.createRef();
  }
  empty = (arr) => (arr.length = 0);

  componentDidMount() {
    let _this = this;
    const view = this.props.view;

    loadModules(["esri/layers/GraphicsLayer", "esri/widgets/Expand"], {
      css: false,
    }).then(([GraphicsLayer, Expand]) => {
      _this.setState({
        bufferLayer: new GraphicsLayer({
          listMode: "hide",
        }),
        sketchLayer: new GraphicsLayer({
          listMode: "hide",
        }),
      });

      view.map.addMany([ _this.state.bufferLayer,_this.state.sketchLayer]);

      let layerListExpand = new Expand({
        expandIconClass: "esri-icon-cursor-marquee",
        view: view,
        content: this.queryDiv.current,
        group: "bottom-right",
        expanded: false,
        expandTooltip: "Selection Tool",
      });

      view.ui.add(layerListExpand, "top-right");

      /* _this.context.view.customer.when(function(){

        if (window.innerWidth >= 576) {
          view.ui.add(layerListExpand, "top-right");
        }
        
        if (window.innerWidth <= 576) {
          view.ui.remove(layerListExpand, "top-right");
        }
  
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 576) {
          view.ui.add(layerListExpand, "top-right");
        }
        else{
          view.ui.remove(layerListExpand, "top-right");
        }
      }); */

    });
  }

  selectByGraphic = (event) => {
    let _this = this;
    let view = _this.props.view;
    _this.state.sketchLayer.removeAll();
    _this.state.bufferLayer.removeAll();

    this.setState({
      activeButton: event.target.value
    });
    const geometryType = event.target.value;

    loadModules(
      [
        "esri/widgets/Sketch/SketchViewModel",
        "esri/core/promiseUtils",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
      ],
      { css: false }
    ).then(([SketchViewModel, promiseUtils, geometryEngine, Graphic]) => {
      _this.setState({
        polylineLength: null,
        polygonArea: null,
        activeTab:'',
        id:null
      });

      sketchViewModel = new SketchViewModel({
        layer: _this.state.sketchLayer,
        creationMode: "update",
        defaultUpdateOptions: {
          tool: "reshape",
          toggleToolOnClick: true,
        },
        view: view,
        defaultCreateOptions: { hasZ: false },
      });

      if (geometryType === "lasso") {
        sketchViewModel.create("polygon", { mode: "freehand" });
      } else {
        sketchViewModel.create(geometryType);
      }

      sketchViewModel.on("create", (event) => {
        if (event.state === "complete") {
          sketchGeometry = event.graphic.geometry;

          if (sketchGeometry.type === "polygon") {
            if (this.state.ActiveCPEHighlight) {
              this.state.ActiveCPEHighlight.remove();
            }

            _this.setState({
              bufferSize: 0,
              CPEnav: false,
              //  id: null,
              disabled: true,
              polylineLength: null,
              polygonArea: geometryEngine.geodesicArea(
                event.graphic.geometry,
                "square-kilometers"
              ),
            });

            /*  
                           _this.props.summaryTableFun(false); */

            _this.selectFeatures(sketchGeometry);
          }

          if (sketchGeometry.type === "point") {
            _this.setState({
              bufferSize: 0,
              CPEnav: false,
              disabled: false,
            });

            //
            _this.state.sketchLayer.graphics.items[0].symbol = {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              style: "circle",
              color: "brown",
              size: "10px", // pixels
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 0],
                width: 1, // points
              },
            };
          }

          if (sketchGeometry.type === "polyline") {
            if (this.state.ActiveCPEHighlight) {
              this.state.ActiveCPEHighlight.remove();
            }

            /*   
                          _this.props.summaryTableFun(false); */
            /*  this.setState({
                CPETable: false,
                id: null,
              }); */

            _this.selectFeatures(event.graphic.geometry);

            _this.state.sketchLayer.graphics.items[0].symbol = {
              type: "simple-line", // autocasts as new SimpleFillSymbol
              color: "red", // #087de1 // #EBEB00
              width: 2,
              cap: "round",
              join: "round",
              style: "short-dash",
            };

            _this.setState({
              bufferSize: 0,
              CPEnav: false,
              disabled: false,
              polygonArea: null,
              polylineLength: geometryEngine.geodesicLength(
                event.graphic.geometry,
                "meters"
              ),
            });
          }
          _this.runQuery();
        }
      });

      sketchViewModel.on("update", (event) => {
        if (
          event.toolEventInfo &&
          (event.toolEventInfo.type.includes("scale-stop") ||
            event.toolEventInfo.type.includes("reshape-stop") ||
            event.toolEventInfo.type === "move-stop")
        ) {
          sketchGeometry = event.graphics[0].geometry;
          _this.runQuery();

          if (sketchGeometry.type === "polygon") {
            if (this.state.ActiveCPEHighlight) {
              this.state.ActiveCPEHighlight.remove();
            }

            _this.selectFeatures(sketchGeometry);

            view.graphics.removeAll();

            _this.setState({
              bufferSize: 0,
              CPEnav: false,
              polylineLength: null,
              //  id:null,
              polygonArea: geometryEngine.geodesicArea(
                sketchGeometry,
                "square-kilometers"
              ),
            });
          }

          if (sketchGeometry.type === "polyline") {
            if (this.state.ActiveCPEHighlight) {
              this.state.ActiveCPEHighlight.remove();
            }

            _this.selectFeatures(sketchGeometry);

            view.graphics.removeAll();

            _this.state.sketchLayer.graphics.items[0].symbol = {
              type: "simple-line", // autocasts as new SimpleFillSymbol
              color: "red", // #087de1 // #EBEB00
              width: 2,
              cap: "round",
              join: "round",
            };

            _this.setState({
              CPETable: false,
              //  id: null,
              polygonArea: null,
              polylineLength: geometryEngine.geodesicLength(
                sketchGeometry,
                "meters"
              ),
            });
          }
        }
      });

      // set the geometry query on the visible geoJSONLayerView
      debouncedRunQuery = promiseUtils.debounce(() => {
        if (!sketchGeometry) {
          return;
        }
        _this.updateBufferGraphic(_this.state.bufferSize);
      });
    });
  };

  runQuery = () => {
    debouncedRunQuery().catch((error) => {
      if (error.name === "AbortError") {
        return;
      }

      console.error(error);
    });
  };

  updateBufferGraphic = (buffer) => {
    let _this = this;
    loadModules(["esri/geometry/geometryEngine", "esri/Graphic"], {
      css: false,
    }).then(([geometryEngine, Graphic]) => {
      // add a polygon graphic for the buffer
      if (buffer > 0) {
        const bufferGeometry = geometryEngine.geodesicBuffer(
          sketchGeometry,
          buffer,
          "meters"
        );
        if (_this.state.bufferLayer.graphics.length === 0) {
          _this.state.bufferLayer.add(
            new Graphic({
              geometry: bufferGeometry,
              symbol: sketchViewModel.polygonSymbol,
            })
          );

          _this.selectFeatures(bufferGeometry);
        } else {
          _this.state.bufferLayer.graphics.getItemAt(0).geometry =
            bufferGeometry;
          _this.selectFeatures(bufferGeometry);
        }
      } else {
        _this.state.bufferLayer.removeAll();
      }
    });
  };

  activeCPE =  (data) => {
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
    let _this = this;

    const query = {
      spatialRelationship: "contains",
      geometry: geometry,
      returnGeometry: true,
    };

    await this.props.layerViews.forEach(async (element) => {
      if (element) {
        if (element.visible === true) {
          await element.queryFeatures(query).then((results) => {
            if (results.features.length === 0) {
              _this.setState({
                noSelection: true,
              });
              return null;
            } else {
              switch (element.layer.title) {
                case "Active Customer":
                  let activeCPE = _this.activeCPE(results.features);
                  obj.ActiveCPE = activeCPE;
                  if (_this.state.ActiveCPEHighlight) {
                    _this.state.ActiveCPEHighlight.remove();
                  }
                  _this.setState({
                    ActiveCPEHighlight: element.highlight(results.features),
                    CPEnav: true,
                   // id: "ActiveCPE",
                  });

                  break;
                case "Inactive Customer":
    
                  obj.InActiveCPE = results.features;
                  if (_this.state.InactiveCPEHighlight) {
                    _this.state.InactiveCPEHighlight.remove();
                  }
                  _this.setState({
                    InactiveCPEHighlight: element.highlight(results.features),
                    CPEnav: true,
                  //  id: "InActiveCPE",
                  });

                  break;
                case "ODB/DC":
                  obj.DC = results.features;
                  if (_this.state.DCHighlight) {
                    _this.state.DCHighlight.remove();
                  }
                  _this.setState({
                    DCHighlight: element.highlight(results.features),
                    CPEnav: true,
                  //  id: "DC",
                  });

                  break;
                default:
              }

              _this.setState({
                noSelection: false,
                selectAttributes: [obj],
                CPETable: true,
                selectionTable: true,
              });
              _this.props.summaryTableFun(true);
              _this.props.setMapDiv('auto')
            }
          });
        }
      }
    });
  };

  handleChange = (event) => {
    this.setState({
      bufferSize: parseInt(event.target.value),
    });
  };

  handleClick = (e) => {
    if (this.state.bufferSize === 0) {
      this.props.summaryTableFun(false);

      this.setState({
        selectionTable: false,
        id: null,
      });
      if (this.state.ActiveCPEHighlight) {
        this.state.ActiveCPEHighlight.remove();
      }
    }
    this.runQuery();
  };

  clearSelections = () => {
    this.props.summaryTableFun(false);
    this.props.setMapDiv('hidden')
    this.state.sketchLayer.removeAll();
    this.props.view.graphics.removeAll();

    this.setState({
      selectionTable: false,

      southCPEAttributes: false,
      CPETable: false,

      InactiveCPEAttributes: false,
      InactiveCPETable: false,

      disabled: true,
      id: null,
      polylineLength: null,
      polygonArea: null,
    });

    if (this.state.bufferLayer !== null) {
      this.state.bufferLayer.removeAll();
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

  CPEtoggle = (name) => {
    this.setState({
      CPEtoggle: true, // download link
      id: name,
      activeTab: name
      // CPETable: true,
    });

    this.empty(this.state.dataToExcel);
    this.state.selectAttributes.map((data, i) => {

       data[name].forEach((e) => {
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
      this.state.sketchLayer,
      this.state.bufferLayer,
    ]);
  }

  handleRightClick = (event, columnName) => {
    event.preventDefault();

    const columnValues = this.state.dataToExcel.map((row) =>
      parseInt(row[columnName])
    );
    const columnMin = Math.min(...columnValues);
    const columnMax = Math.max(...columnValues);
    const columnSum = columnValues.reduce((sum, value) => sum + value, 0);
    const columnAvg = columnSum / columnValues.length;

    alert(
      ` Min: ${columnMin} \n Max: ${columnMax} \n Avg: ${parseInt(
        columnAvg
      )} \n Sum: ${parseInt(columnSum)}`
    );
  };

  render() {
    return (
      <>
        <div
          id="queryDiv"
          className="esri-widget d-none d-sm-block"
          ref={this.queryDiv}
          style={{
            visibility: this.state.visibility,
            display: this.state.display,
          }}
        >
          <b>Query by geometry</b>
          <br />
          <br />
          Draw a geometry to query by:
          <div className="geometry-options" title="select graphics">
            <button
              className={`esri-widget--button esri-icon-map-pin geometry-button ${this.state.activeButton === "point" ? "active" : ""}`}
              id="point-geometry-button"
              value="point"
              title="point"
              onClick={this.selectByGraphic}
            ></button>
            <button
              className={`esri-widget--button esri-icon-polyline geometry-button ${this.state.activeButton === "polyline" ? "active" : ""}`}
              id="line-geometry-button"
              value="polyline"
              title="line"
              onClick={this.selectByGraphic}
            ></button>
            <button
              className={`esri-widget--button esri-icon-polygon geometry-button ${this.state.activeButton === "polygon" ? "active" : ""}`}
              id="polygon-geometry-button"
              value="polygon"
              title="polygon"
              onClick={this.selectByGraphic}
            ></button>
            <button
              className={`esri-widget--button esri-icon-lasso geometry-button ${this.state.activeButton === "lasso" ? "active" : ""}`}
              id="lasso-geometry-button"
              value="lasso"
              title="lasso"
              onClick={this.selectByGraphic}
            ></button>
          </div>
          <br />
          {/*  <div className="range">
              <label>Set a geometry buffer size:</label>
              <br />
              <input
                type="range"
                min="0"
                max="20000"
                value={this.state.bufferSize}
                onChange={this.handleChange}
                disabled = {this.state.disabled}
              />
              <p>Size: {this.state.bufferSize} m</p>
            </div> */}
          <div className="range">
            <label>Set a geometry buffer size:</label>
            <br />
            <input
              type="number"
              value={this.state.bufferSize}
              onChange={this.handleChange}
              disabled={this.state.disabled}
            />
            <button
              className="buffer"
              onClick={this.handleClick}
              disabled={this.state.disabled}
            >
              OK
            </button>

            <p>
              Buffer Size: {this.state.bufferSize} m (
              {this.state.bufferSize / 1000} km)
            </p>

            {this.state.polylineLength !== null && (
              <>
                <p className="length">
                  {" "}
                  Length: {this.state.polylineLength.toFixed(2) + " meter"}
                </p>
              </>
            )}

            {this.state.polygonArea !== null && (
              <>
                <p className="length">
                  {" "}
                  Area:{" "}
                  {this.state.polygonArea.toFixed(3) + " square-kilometers"}
                </p>
              </>
            )}
          </div>
          <button
            className="esri-button"
            id="clearGeometry"
            type="button"
            onClick={this.clearSelections}
          >
            Clear
          </button>
        </div>

        <div className="row selection">
          <div className="selection col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="selection tabs">
              {this.state.selectionTable ? (
                <ul className="nav status selection" navbar>
                  {/************************ Selection Tab of Table **********************/}

                  {this.state.CPEnav ? (
                    <>
                      {this.state.selectAttributes.map((data, i) => {
                        return (
                          <div className="tab-div">
                            {Object.keys(data).map((name, id) => {
                              const isActive = name === this.state.activeTab;
                              return (
                                <li key={id} className={`tab-li ${isActive ? 'active' : 'not-active'}`}
                                    style={{color:'white'}}
                                    onClick={() => this.CPEtoggle(name)}
                                >
                                    {name} ( {data[name].length} )
                               
                                </li>
                              );
                            })}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {this.state.noSelection ? (
                        <p>No Selection</p>
                      ) : (
                        <p>LOADING.......</p>
                      )}
                    </>
                  )}

                  {/************************* Download Link **********************/}

                  {this.state.id ? (
                    <div className="download-div">
                      <li className="tab-download">
                        <button
                          className="download-button"
                          onClick={() => this.CPEdownload(this.state.id)}
                        >
                          <i className="fas fa-solid fa-file-download"></i>
                        </button>
                      </li>
                    </div>
                  ) : null}
                </ul>
              ) : null}
            </div>

            {/**************************** South customer Table ********************************/}
            {/* Customer Table */}
            {this.state.id ? (
              <div className="selection outlet">
                <table className="table table-bordered">
                  <colgroup>
                    {this.state.selectAttributes.map((layer, i) => {
                      return Object.keys(
                        layer[this.state.id][0].attributes
                      ).map((heading, index) => {
                        return <col className="column" key={index} />;
                      });
                    })}
                  </colgroup>
                  <thead>
                    <tr>
                      {this.state.selectAttributes.map((layer, i) => {
                        return Object.keys(
                          layer[this.state.id][0].attributes
                        ).map((heading, index) => {
                          return (
                            <th
                              className="heading"
                              key={index}
                              //onContextMenu={(event) =>
                              //  this.handleRightClick(event, heading)
                              //}
                            >
                              {heading}
                            </th>
                          );
                        });
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.selectAttributes.map((layer, i) => {
                      return layer[this.state.id].map((data, index) => {
                        return (
                          <tr key={index}>
                            {Object.values(data.attributes).map((raw, i) => {
                              return (
                                <td className="body-text" key={i}>
                                  {raw}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}
