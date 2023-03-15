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
  const northCPELayer = view.northCPELayer
  const [isModalOpen, UpdateisModalOpen] = useState(false);

  const [ticketInfo, updateTicketInfo] = useState(null);

  let toggleModal = () => {
    UpdateisModalOpen(!isModalOpen);
  };

  let ticketModal = () => {
    if (props.ticket === "All Ticket") {

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
  
          updateTicketInfo(options);
        });
  
        toggleModal();
      })
     
    } else {
      alert("First Select the Tickets from Dropdown List");
    }
  };

  return (
    <>
      {props.summaryTableFun ? null : (
        <>
          <table
            id="example"
            className="table table-bordered table-striped js-basic-example dataTable"
            style={styels.table}
          >
            <thead style={{ backgroundColor: "#7d5701", height: "20px" }}>
              <tr>
                <th>Region</th>
                <th>LOS</th>
                <th>Online</th>
                <th>Powered Off</th>
                <th>GEM Packet Loss</th>
                <th>Low Optical Power</th>
                <th
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  Tickets
               {/*    <span onClick={ticketModal}>
                    <i className="fa fa-info-circle fa-lg"></i>
                  </span> */} 
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-md-2">North</td>
                <td className="col-md-2">
                  <i class="fas fa-circle" style={styels.LOSRed}></i>{" "}
                  {props.northStatus.northLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp;{" "}
                  <i class="fas fa-circle" style={styels.LOSOrange}></i>{" "}
                  {props.northStatus.northLOSOld}
                </td>
                <td className="col-md-2"> {props.northStatus.northOnline}</td>
                <td className="col-md-2">{props.northStatus.northDyingGasp}</td>
                <td className="col-md-2">{props.northStatus.northGEMPack}</td>
                <td className="col-md-2">{props.northStatus.northLOP}</td>
                <td className="col-md-2">{props.northStatus.ticketNorth}</td>
              </tr>
            </tbody>
          </table>

          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader>Area Wise Ticket Status</ModalHeader>
            <ModalBody>
              {ticketInfo && isModalOpen ? (
                <CanvasJSChart options={ticketInfo} />
              ) : null}
            </ModalBody>
          </Modal>
        </>
      )}
    </>
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
