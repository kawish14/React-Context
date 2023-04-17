import React, { useContext, useEffect, useRef, useState } from "react";
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

import MapContext from "../../context/mapContext";
import CanvasJSReact from "../../charts/canvasjs.react";
import { loadModules, setDefaultOptions } from "esri-loader";

import "./widget/css/widget.css";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Gpondb(props) {
  const { view } = useContext(MapContext);
  const centralCPELayer = view.centralCPELayer
  const northCPELayer = view.northCPELayer
  const southCPELayer = view.southCPELayer
  
  const [isModalOpen, UpdateisModalOpen] = useState(false);

  const [southTicketInfo, updateSouthTicketInfo] = useState(null);
  const [northTicketInfo, updateNorthTicketInfo] = useState(null);
  const [centralTicketInfo, updateCentralTicketInfo] = useState(null);

  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {}, []);

  let toggleModal = () => {
    UpdateisModalOpen(!isModalOpen);
  };

  /***********************  CENTRAL REGION ***********************************/

  let uniqueValueCentral = () => {
    loadModules(["esri/smartMapping/statistics/uniqueValues"],{ css: false })
    .then(async ([uniqueValues]) => {
      uniqueValues({
        layer: centralCPELayer,
        field: "area_town",
        sqlWhere: `status = 'Active' AND ticketstatus = 'In-process'`,
      }).then(function (response) {
        // prints each unique value and the count of features containing that value
        let infos = response.uniqueValueInfos;

        let options = {
          animationEnabled: true,
          exportEnabled: false,
          theme: "dark1", // "light1", "dark1", "dark2",
          toolTip: {
            content: "Count of {label}: {name}",
          },
          legend: {
            fontSize: 10,
            fontColor: "rgb(31, 145, 243)",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontStyle: "normal",
            itemWidth: 200,
            horizontalAlign: "left",
            // maxWidth: 400
          },
          /*    title:{
                    text:"Area Wise Ticket Status",
                    fontSize:18,
                    fontWeight:"bold",
                    fontColor:'rgb(31, 145, 243)',
                    fontStyle: 'normal',
                    fontFamily:'Arial, Helvetica, sans-serif'
                  }, */
          data: [
            {
              type: "pie",
              indexLabelPlacement: "outside",
              indexLabel: "{label}: {y}%",
              indexLabelFontSize: 12,
              indexLabelFontColor: "rgb(31, 145, 243)",
              indexLabelFontFamily: "Arial, Helvetica, sans-serif",
              indexLabelFontStyle: "normal",
              startAngle: -90,
              showInLegend: true,
              legendText: "{label}",
              dataPoints: [],
            },
          ],
        };

        var msgTotal = infos.reduce(function (prev, cur) {
          return prev + cur.count;
        }, 0);

        infos.forEach(function (info) {
          let a = parseInt(info.count * 100);
          let percentage = parseFloat(a / msgTotal);

          let c = {
            y: percentage.toFixed(2),
            label: info.value,
            name: info.count.toString(),
          };
          options.data[0].dataPoints.push(c);
        });

        updateCentralTicketInfo(options);
      });
    })

  }

  /***********************  NORTH REGION ***********************************/

  let uniqueValueNorth = () => {

    loadModules(["esri/smartMapping/statistics/uniqueValues"],{ css: false })
    .then(async ([uniqueValues]) => {
      uniqueValues({
        layer: northCPELayer,
        field: "area_town",
        sqlWhere: `status = 'Active' AND ticketstatus = 'In-process'`,
      }).then(function (response) {
        // prints each unique value and the count of features containing that value
        let infos = response.uniqueValueInfos;

        let options = {
          animationEnabled: true,
          exportEnabled: false,
          theme: "dark1", // "light1", "dark1", "dark2",
          toolTip: {
            content: "Count of {label}: {name}",
          },
          legend: {
            fontSize: 10,
            fontColor: "rgb(31, 145, 243)",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontStyle: "normal",
            itemWidth: 200,
            horizontalAlign: "left",
            // maxWidth: 400
          },
          /*    title:{
                    text:"Area Wise Ticket Status",
                    fontSize:18,
                    fontWeight:"bold",
                    fontColor:'rgb(31, 145, 243)',
                    fontStyle: 'normal',
                    fontFamily:'Arial, Helvetica, sans-serif'
                  }, */
          data: [
            {
              type: "pie",
              indexLabelPlacement: "outside",
              indexLabel: "{label}: {y}%",
              indexLabelFontSize: 12,
              indexLabelFontColor: "rgb(31, 145, 243)",
              indexLabelFontFamily: "Arial, Helvetica, sans-serif",
              indexLabelFontStyle: "normal",
              startAngle: -90,
              showInLegend: true,
              legendText: "{label}",
              dataPoints: [],
            },
          ],
        };

        var msgTotal = infos.reduce(function (prev, cur) {
          return prev + cur.count;
        }, 0);

        infos.forEach(function (info) {
          let a = parseInt(info.count * 100);
          let percentage = parseFloat(a / msgTotal);

          let c = {
            y: percentage.toFixed(2),
            label: info.value,
            name: info.count.toString(),
          };
          options.data[0].dataPoints.push(c);
        });

        updateNorthTicketInfo(options);
      });
    })

  }

   /***********************  SOUTH REGION ***********************************/

   let uniqueValueSouth = () => {

    loadModules(["esri/smartMapping/statistics/uniqueValues"],{ css: false })
    .then(async ([uniqueValues]) => {
      uniqueValues({
        layer: southCPELayer,
        field: "area_town",
        sqlWhere: `status = 'Active' AND ticketstatus = 'In-process'`,
      }).then(function (response) {
        // prints each unique value and the count of features containing that value
        let infos = response.uniqueValueInfos;

        let options = {
          animationEnabled: true,
          exportEnabled: false,
          theme: "dark1", // "light1", "dark1", "dark2",
          toolTip: {
            content: "Count of {label}: {name}",
          },
          legend: {
            fontSize: 10,
            fontColor: "rgb(31, 145, 243)",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontStyle: "normal",
            itemWidth: 200,
            horizontalAlign: "left",
            // maxWidth: 400
          },
          /*    title:{
                    text:"Area Wise Ticket Status",
                    fontSize:18,
                    fontWeight:"bold",
                    fontColor:'rgb(31, 145, 243)',
                    fontStyle: 'normal',
                    fontFamily:'Arial, Helvetica, sans-serif'
                  }, */
          data: [
            {
              type: "pie",
              indexLabelPlacement: "outside",
              indexLabel: "{label}: {y}%",
              indexLabelFontSize: 12,
              indexLabelFontColor: "rgb(31, 145, 243)",
              indexLabelFontFamily: "Arial, Helvetica, sans-serif",
              indexLabelFontStyle: "normal",
              startAngle: -90,
              showInLegend: true,
              legendText: "{label}",
              dataPoints: [],
            },
          ],
        };

        var msgTotal = infos.reduce(function (prev, cur) {
          return prev + cur.count;
        }, 0);

        infos.forEach(function (info) {
          let a = parseInt(info.count * 100);
          let percentage = parseFloat(a / msgTotal);

          let c = {
            y: percentage.toFixed(2),
            label: info.value,
            name: info.count.toString(),
          };
          options.data[0].dataPoints.push(c);
        });

        updateSouthTicketInfo(options);
      });
    })
   
  }


  let ticketModal = () => {
    if (props.CentralTicket === "All Ticket" && props.NorthTicket === "All Ticket" && 
        props.SouthTicket === "All Ticket") {

            uniqueValueSouth()
            uniqueValueNorth()
            uniqueValueCentral()
            toggleModal();
    } 
    else {
      alert("First Select the Tickets from Dropdown List");
    }
  };

  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };
  const handleTab3 = () => {
    // update the state to tab2
    setActiveTab("tab3");
  };

  return (
    <div>
      {props.summaryTableFun ? null : (
        <>
          <table
            id="example"
            className="table table-bordered table-striped js-basic-example dataTable"
            style={styels.table}
          >
            <thead style={{ backgroundColor: "#7d5701", height: "20px" }}>
              <tr>
                <th>Alarm Info</th>
                <th>South</th>
                <th>North</th>
                <th>Central</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-md-2">Link Down</td>
                <td className="col-md-2">
                  <i class="fas fa-circle" style={styels.LOSRed}></i>{" "}
                  {props.southStatus.southLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp;{" "}
                  <i class="fas fa-circle" style={styels.LOSOrange}></i>{" "}
                  {props.southStatus.southLOSOld}
                </td>
                <td className="col-md-2">
                  <i class="fas fa-circle" style={styels.LOSRed}></i>{" "}
                  {props.northStatus.northLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp;{" "}
                  <i class="fas fa-circle" style={styels.LOSOrange}></i>{" "}
                  {props.northStatus.northLOSOld}
                </td>
                <td className="col-md-2">
                  <i class="fas fa-circle" style={styels.LOSRed}></i>{" "}
                  {props.centralStatus.centralLOSWeek} &nbsp;&nbsp; |
                  &nbsp;&nbsp;{" "}
                  <i class="fas fa-circle" style={styels.LOSOrange}></i>{" "}
                  {props.centralStatus.centralLOSOld}
                </td>
              </tr>

              <tr>
                <td className="col-md-2">Online</td>
                <td className="col-md-2">{props.southStatus.southOnline}</td>
                <td className="col-md-2">{props.northStatus.northOnline}</td>
                <td className="col-md-2">
                  {props.centralStatus.centralOnline}
                </td>
              </tr>

              <tr>
                <td className="col-md-2">Powered Off</td>
                <td className="col-md-2">{props.southStatus.southDyingGasp}</td>
                <td className="col-md-2">{props.northStatus.northDyingGasp}</td>
                <td className="col-md-2">
                  {props.centralStatus.centralDyingGasp}
                </td>
              </tr>

              <tr>
                <td className="col-md-2">GEM Packet Loss</td>
                <td className="col-md-2">{props.southStatus.southGEMPack}</td>
                <td className="col-md-2">{props.northStatus.northGEMPack}</td>
                <td className="col-md-2">
                  {props.centralStatus.centralGEMPack}
                </td>
              </tr>

              <tr>
                <td className="col-md-2">Low Optical Power</td>
                <td className="col-md-2">{props.southStatus.southLOP}</td>
                <td className="col-md-2">{props.northStatus.northLOP}</td>
                <td className="col-md-2">{props.centralStatus.centralLOP}</td>
              </tr>
              <tr>
                <td
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  Tickets
                 {/*  <span onClick={ticketModal}>
                    <i className="fa fa-info-circle fa-lg"></i>
                  </span>  */}
                </td>
                <td className="col-md-2">{props.southStatus.ticketSouth}</td>
                <td className="col-md-2">{props.northStatus.ticketNorth}</td>
                <td className="col-md-2">
                  {props.centralStatus.ticketCentral}
                </td>
              </tr>
            </tbody>
          </table>

          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader>Area Wise Ticket Status</ModalHeader>
            <ModalBody>
              <div className="Tabs">
                {/* Tab nav */}
                <ul className="nav ticket">
                  <li
                    className={activeTab === "tab1" ? "active" : ""}
                    onClick={handleTab1}
                  >
                    South
                  </li>
                  <li
                    className={activeTab === "tab2" ? "active" : ""}
                    onClick={handleTab2}
                  >
                    North
                  </li>
                  <li
                    className={activeTab === "tab3" ? "active" : ""}
                    onClick={handleTab3}
                  >
                    Central
                  </li>
                </ul>
                <div className="outlet">
                  {activeTab === "tab1" && (
                    <>
                      {southTicketInfo && isModalOpen ? (
                        <CanvasJSChart options={southTicketInfo} />
                      ) : null}
                    </>
                  )}
                  {activeTab === "tab2" && (
                    <>
                      {northTicketInfo && isModalOpen ? (
                        <CanvasJSChart options={northTicketInfo} />
                      ) : null}
                    </>
                  )}
                  {activeTab === "tab3" && (
                    <>
                      {centralTicketInfo && isModalOpen ? (
                        <CanvasJSChart options={centralTicketInfo} />
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </ModalBody>
          </Modal>
        </>
      )}
    </div>
  );
}

const styels = {
  table: {
    backgroundColor: "#242424",
    color: "white",
    fontSize: "13px",
    cursor: "pointer",
  },
  LOSRed: {
    fontSize: "8px",
    color: "red",
  },
  LOSOrange: {
    fontSize: "8px",
    color: "orange",
  },
};

export default Gpondb;
