import React from "react";
import MapContext from "../../../context/mapContext";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import { loadModules, setDefaultOptions } from "esri-loader";
import "../widget.css";

import {version} from '../../../url'
setDefaultOptions({ version: version })

export default class SouthZoneTicket extends React.Component {
  static contextType = MapContext;
  constructor(props) {
    super(props);
    this.state = {
      display: "none",
      show: false,

      buffer: null,
      southLayerView: null,

      highlight: null,

      supervisor: null,
      zone:null,

      LOSi: [],
      Online: [],
      PowerOff: [],
      GEMPacket: [],
      LOP: [],
      ticket: [],

      selectedFeature:[],
    };

    this.stats = React.createRef();
    this.table = React.createRef();
  }

  empty = (arr) => (arr.length = 0);

  componentDidMount() {
    let _this = this;
    let view = this.props.view;

    view.on("click", ["Alt"], function (evt) {
      if (_this.state.highlight) {
        _this.state.highlight.remove();
      }

      view.ui.remove(_this.stats.current);

      view.hitTest(evt).then(function (response) {

        response.results.forEach((element) => {
          if (element.graphic.layer.title === "South Zone") {
            loadModules(
              [
                "esri/geometry/geometryEngine",
 
              ],
              { css: false }
            ).then(
              ([ geometryEngine]) => {
                let geometry = element.graphic.geometry;

                var zoneBuffer = geometryEngine.geodesicBuffer(
                  geometry,
                  [2],
                  "meters",
                  true
                );

                _this.setState({
                  supervisor: element.graphic.attributes.cluster,
                  zone:element.graphic.attributes.zone,
                  buffer: zoneBuffer,
                });
              }
            );
          }
        });
      });
    });


  }

  componentDidUpdate(prevProps, prevState) {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    if (prevState.buffer !== this.state.buffer) {

      this.queryZonetotal().then(this.displayResult);
    }
  }

  queryZonetotal = () => {
    const counts = {};

    let _this = this;
    let view = this.props.view;

    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    view.whenLayerView(southCPELayer).then(function (layerView) {
      _this.setState({
        southLayerView: layerView,
      });
    });

    let query = southCPELayer.createQuery();
    query.geometry = this.state.buffer;
    query.spatialRelationship = "contains";

    southCPELayer.queryFeatures(query).then(function (results) {
      _this.empty(_this.state.LOSi);
      _this.empty(_this.state.Online);
      _this.empty(_this.state.PowerOff);
      _this.empty(_this.state.GEMPacket);
      _this.empty(_this.state.LOP);
      _this.empty(_this.state.ticket);
      _this.empty(_this.state.selectedFeature)

      results.features.map((data, index) => {

        let obj = {
          "OBJECTID": data.attributes.OBJECTID,
          "NAME": data.attributes.name,
          "CUSTOMER ID": data.attributes.id,
          "ADDRESS": data.attributes.address,
          "DC/ODB ID": data.attributes.dc_id,
          "DC/ODB Name": data.attributes.dc_name,
          "AREA": data.attributes.area_town,
          "BLOCK/PHASE": data.attributes.sub_area,
          "CITY": data.attributes.city,
          "ACTIVATION DATE": data.attributes.activationdate,
          "ZONE": _this.state.zone,
          "CLUSTER": _this.state.supervisor,
          "TYPE": data.attributes.type,
          "CATEGORY": data.attributes.category,
          "OLT": data.attributes.olt,
          "FRAME": data.attributes.frame,
          "SLOT": data.attributes.slot,
          "PORT": data.attributes.port,
          "ONT ID": data.attributes.ontid,
          "ONT Model": data.attributes.ontmodel,
          "ALARM": data.attributes.alarminfo,
          "BANDWIDTH": data.attributes.bandwidth,
          "LAST UP TIME": data.attributes.uptime,
          "LAST DOWN TIME": data.attributes.downtime,
          "TICKET ID": data.attributes.ticketid,
          "TICKET STATUS": data.attributes.ticketstatus,
          "TICKET TYPE": data.attributes.tickettype,
          "TICKET OPEN TIME": data.attributes.ticketopentime,
          "TICKET CLOSE TIME": data.attributes.ticketclosetime,
        };
        _this.state.selectedFeature.push(obj)
        _this.setState({
          selectedFeature: _this.state.selectedFeature
        })

        let sw = data.attributes.alarmstate;
        let ticket = data.attributes.ticketstatus;

        switch (sw) {
          case 2:
            _this.state.LOSi.push(sw);
            _this.setState({
              LOSi: _this.state.LOSi,
            });

            break;

          case 0:
            _this.state.Online.push(sw);
            _this.setState({
              Online: _this.state.Online,
            });

            break;

          case 1:
            _this.state.PowerOff.push(sw);
            _this.setState({
              PowerOff: _this.state.PowerOff,
            });

            break;

          case 3:
            _this.state.GEMPacket.push(sw);
            _this.setState({
              GEMPacket: _this.state.GEMPacket,
            });

            break;

          case 4:
            _this.state.LOP.push(sw);
            _this.setState({
              LOP: _this.state.LOP,
            });

            break;

          default:
           
        }

        switch (ticket) {
          case "In-process":
            _this.state.ticket.push(ticket);
            break;

          default:
            
        }
      });
    });

    return southCPELayer.queryFeatures(query);
  };

  displayResult = (results) => {
    let _this = this;
    let view = this.props.view;

    loadModules(
      ["esri/Graphic","esri/core/watchUtils"],{ css: false })
      .then(([Graphic, watchUtils]) => {

        var bufferGraphic = new Graphic({
          geometry: _this.state.buffer,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            outline: {
              width: 2,
              color: [0, 255, 255, 0.5]
            },
            style: "none",
          },
        });
    
        view.graphics.add(bufferGraphic);
    
        if (_this.state.highlight) {
          _this.state.highlight.remove();
        }
    
        _this.setState({
          highlight: _this.state.southLayerView.highlight(results.features),
          show: true,
        });
    
          view.popup.open({
            title: `Supervisor - ${_this.state.supervisor}`,
            content: _this.table.current,
            dockEnabled: false,
            actions:[]
          });
    
        watchUtils.whenTrue(view.popup, "visible", function () {
          watchUtils.whenFalseOnce(view.popup, "visible", function () {
            if (_this.state.highlight) {
    
              _this.state.highlight.remove();
              view.graphics.removeAll();
    
            }
          
            /* for (var i=0; i < view.popup.actions.items.length; i++){
              if(view.popup.actions.items[i].id === 'CPE-Zone'){
                  view.popup.actions.items.splice(i, 1);
              }
            } */
    
          });
    
        });

      })  
 

  };

  popupTrigger = () =>{
 
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const ws = XLSX.utils.json_to_sheet(this.state.selectedFeature);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    
    FileSaver.saveAs(data, `${this.state.zone} - ${this.state.supervisor}` + fileExtension); 

  }
  
  render() {
    return (
      <>
        {this.state.show ? (
          <div ref={this.table}>
            <p>{this.state.zone}</p>
            <table className="summary">
              <thead>
                <tr>
                  <th className="head">Online</th>
                  <th className="head">Power Off</th>
                  <th className="head">Linked Down</th>
                  <th className="head">GEM Packet Loss</th>
                  <th className="head">Low Optical Power</th>
                  <th className="head">Ticket</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="data">{this.state.Online.length}</td>
                  <td className="data">{this.state.PowerOff.length}</td>
                  <td className="data">{this.state.LOSi.length}</td>
                  <td className="data">{this.state.GEMPacket.length}</td>
                  <td className="data">{this.state.LOP.length}</td>
                  <td className="data">{this.state.ticket.length}</td>
                </tr>
              </tbody>
            </table>

            <br />
            <strong className="note">Note: </strong>
            <p className="para">
              {" "}
              The above <strong>STATS</strong> is based on the selection of
              customer status from drop down list.
            </p>

            <button className="ZoneData-btn" onClick={this.popupTrigger}><i className="fa fa-download"></i> Download</button>
          </div>
        ) : null}
      </>
    );
  }
}
