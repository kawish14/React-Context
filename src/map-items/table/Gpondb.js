import React, { useContext, useEffect,useMemo, useRef, useState,forwardRef  } from "react";
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
  CardHeader,
  Card,
} from "reactstrap";
import './table.css'
import MapContext from "../../context/mapContext";
import CanvasJSReact from '../../charts/canvasjs.react'
import { loadModules, setDefaultOptions } from "esri-loader";
import {complete_date} from '../complete_date'
import {version} from '../../url'
import Realtime from "../real-time/ont-status/Realtime";

setDefaultOptions({ version: version });

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const customSortOrder = {
  LOS: 1,
  Online: 2,
  "Power Off": 3,
  "GEM Packet Loss": 4,
  "Low Optical Power": 5,
  "Ticket":6
};

const Gpondb = forwardRef((props,ref) => {

  const context = useContext(MapContext);
  const  {customer,loginRole} = context.view;
  const setDcOutage = context.setDcOutage
  const cardRef = useRef()

  const [isModalOpen, UpdateIsModalOpen] = useState(false);

  const [ticketInfo, updateTicketInfo] = useState(null)

  const [activeTab, setActiveTab] = useState("South");
  const [region, setRegion] = useState(null)
  const [display, setDisplay] = useState('block')
  const [cardDisplay, setCardDisplay] = useState('none')

  const [ticket, setTicket] = useState(null)
  const [LOSWeek, setLOSWeek] = useState(null)
  const [LOSOld, setLOSOld] = useState(null)
  const [Online, setOnline] = useState(null)
  const [DyingGasp, setDyingGasp] = useState(null)
  const [GEMPack, setGEMPack] = useState(null)
  const [LOP, setLOP] = useState(null);

  const [table, setTable] = useState([])

  React.useImperativeHandle(ref, () => ({
    tableData,
  }))

  useEffect(() => {
    let view = props.view
    loadModules(["esri/layers/GraphicsLayer", "esri/widgets/Expand"], {
      css: false,
    }).then(([GraphicsLayer, Expand]) => {

      let layerListExpand = new Expand({
        expandIconClass: "esri-icon-notice-round",
        view: view,
        content: cardRef.current,
        group: "bottom-right",
        expanded: false,
        expandTooltip: "ALarm Info",
      });
   
      if (window.innerWidth >= 1310) {
        setDisplay("block");
       // setCardDisplay("none");
        view.ui.remove(layerListExpand);
      }

      if (window.innerWidth <= 1310) {
        setDisplay("none");
       // setCardDisplay("block");
        view.ui.add(layerListExpand, "top-right");
      }

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 1310) {
          setDisplay("block");
        //  setCardDisplay("none");
          view.ui.remove(layerListExpand);
        } else {
          setDisplay("none");
        //  setCardDisplay("block");
          view.ui.add(layerListExpand,'top-right');
        }
      });
    });

    let query = customer.createQuery();
    customer.queryFeatures(query).then(function (response) {
      const uniqueRegions = [
        ...new Set(response.features.map((obj) => obj.attributes.region)),
      ];
      const sortedRegions = uniqueRegions.sort((a, b) => b.localeCompare(a));
      setRegion(sortedRegions);

      sortedRegions.map((region) => {
        if (loginRole.role === "Admin") tableData("South");
        else {
          setActiveTab(region);
          tableData(`'${region}'`);
        }
      });
    });
  }, []);

  useEffect(() =>{
    tableData(activeTab)
  },[activeTab])

  let toggleModal = () => {

    UpdateIsModalOpen(!isModalOpen);

  };

  const ticketModal = () => {

    if(props.ticket === "All Ticket"){
      loadModules(["esri/smartMapping/statistics/uniqueValues"],{ css: false })
    .then(async ([uniqueValues]) => {
      uniqueValues({
        layer: customer,
        field: "area_town",
        sqlWhere: `region = '${activeTab}' AND ticketstatus = 'In-process'`,
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
      })

    });

    toggleModal()
    }
    else {
        alert("First Select the Tickets from Dropdown List")
    }
  }

const handleTab = (region) => {

  setActiveTab(region);

  tableData(region)

  if(region === "South") {
    props.view
      .goTo({
        target: [67.050987, 24.842437],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });
/* 
      props.view.popup.open({
        title:"Region",
        content:region
      }) */
  }

  if(region === "North"){
    props.view
      .goTo({
        target: [73.088438, 33.605487],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });
  }

  if(region === "Central"){
    props.view
      .goTo({
        target: [74.385495, 31.479528],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });
  }

};

const tableData = (region) => {

  const  {customer,loginRole} = context.view;

  if(region === activeTab) {

    let LOSWeek = customer.createQuery();
    let LOSOld = customer.createQuery();
    let Online = customer.createQuery();
    let DyingGasp = customer.createQuery();
    let GEMPack = customer.createQuery();
    let LOP = customer.createQuery();

    let Ticket = customer.createQuery();

    // Tickets
    Ticket.where = ` ticketstatus = 'In-process' AND region = '${region}' `;
    customer.queryFeatures(Ticket).then(function (response) {
      setTicket(response.features.length);
     
    });

    // LOS Week
    LOSWeek.where = `alarmstate = 2 AND  lastdowntime >= '${complete_date}' AND region = '${region}'`;
    customer.queryFeatures(LOSWeek).then(function (response) {
      setLOSWeek(response.features.length);
    
    });

    // LOS OLD
    LOSOld.where = `alarmstate = 2 AND  lastdowntime <= '${complete_date}' AND region = '${region}'`;
    customer.queryFeatures(LOSOld).then(function (response) {
      setLOSOld(response.features.length);
    });

    // Online
    Online.where = `alarmstate = 0 AND  region = '${region}' `;
    customer.queryFeatures(Online).then(function (response) {
      setOnline(response.features.length);
    
    });

    // Gying Gasp
    DyingGasp.where = `alarmstate = 1 AND  region = '${region}' `;
    customer.queryFeatures(DyingGasp).then(function (response) {
      setDyingGasp(response.features.length);
     
    });

    // GEMPack
    GEMPack.where = `alarmstate = 3 AND  region = '${region}' `;
    customer.queryFeatures(GEMPack).then(function (response) {
      setGEMPack(response.features.length);
   
    });

    // LOP
    LOP.where = `alarmstate = 4 AND  region = '${region}' `;
    customer.queryFeatures(LOP).then(function (response) {
      setLOP(response.features.length);
     
    });
  }

};

const generateTable = (region) => {
    if (activeTab === region) {
      return (
        <table className="table table-bordered">
          <colgroup>
            {LOSWeek !== 0 && <col className="column" />}
            {Online !== 0 && <col className="column" />}
            {DyingGasp !== 0 && <col className="column" />}
            {GEMPack !== 0 && <col className="column" />}
            {LOP !== 0 && <col className="column" />}
            {ticket !== 0 && <col className="column" />}
          </colgroup>

          <thead>
            <tr>
              {LOSWeek !== 0 && <th className="heading">LOS</th>}
              {Online !== 0 && <th className="heading">Online</th>}
              {DyingGasp !== 0 && <th className="heading">Powered Off</th>}
              {GEMPack !== 0 && <th className="heading">GEM Packet Loss</th>}
              {LOP !== 0 && <th className="heading">Low Optical Power</th>}
              {ticket !== 0 && (
                <th className="heading">
                  Tickets
                  <span className="ticket-icon" onClick={ticketModal}>
                    <i className="fa fa-info-circle fa-lg"></i>
                  </span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              {LOSWeek !== 0 && (
                <td className="body-text">
                  <i class="fas fa-circle" style={styels.LOSRed}></i> {LOSWeek}{" "}
                  &nbsp;&nbsp; | &nbsp;&nbsp;{" "}
                  <i class="fas fa-circle" style={styels.LOSOrange}></i>{" "}
                  {LOSOld}
                </td>
              )}
              {Online !== 0 && <td className="body-text"> {Online}</td>}
              {DyingGasp !== 0 && <td className="body-text">{DyingGasp}</td>}
              {GEMPack !== 0 && <td className="body-text">{GEMPack}</td>}
              {LOP !== 0 && <td className="body-text">{LOP}</td>}
              {ticket !== 0 && <td className="body-text">{ticket}</td>}
            </tr>
          </tbody>
        </table>
      );
    }

};
  return (
    <div className="row">
      <Realtime view={props.view} region={tableData} />
      {props.summary ? null : (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="tabs" style={{ display: display }}>
            <div className="tab-elements">
              <ul className="nav status gpon">
                {region === null ? (
                  <span>Loading....</span>
                ) : (
                  region.map((region, index) => {
                    return (
                      <li
                        key={index}
                        className={activeTab === region ? "active" : " region"}
                        onClick={() => handleTab(region)}
                      >
                        {region}
                      </li>
                    );
                  })
                )}
              </ul>
              <span className="tab-element-note" ><strong className="tab-element-note-strong">Ticket's</strong> count in the table is based on the current selection of <strong className="tab-element-note-strong">Customer Status</strong></span>
            </div>
          </div>

          <div className="outlet" style={{ display: display }}>
            {generateTable("South")}
            {generateTable("North")}
            {generateTable("Central")}
          </div>

          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader>Area Wise Ticket Status</ModalHeader>
            <ModalBody>
              {ticketInfo && isModalOpen ? (
                <CanvasJSChart options={ticketInfo} />
              ) : null}
            </ModalBody>
          </Modal>

          <div ref={cardRef} className="Losi-Card" display={cardDisplay}>
            <div className="list-group-item list-group-item-danger">
              LOSi Alarms
            </div>
            <div class="card-body">
              <i class="fas fa-circle" style={styels.LOSRed}></i> {LOSWeek}{" "}
              &nbsp;&nbsp; &nbsp;&nbsp;{" "}
              <i class="fas fa-circle" style={styels.LOSOrange}></i> {LOSOld}
            </div>
          </div>
        </div>
      )}
    </div>
  );
})

const styels = {
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
