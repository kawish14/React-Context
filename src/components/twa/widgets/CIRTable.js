import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../../context/mapContext";

import { loadModules, setDefaultOptions } from "esri-loader";
import { __esModule } from "react-loadingg/lib/WaveLoading";

import {version} from '../../../url'
setDefaultOptions({ version: version })

export default function CIRTable(props) {

  let { southCPELayer, northCPELayer, centralCPELayer } =useContext(MapContext);

  let view = props.view;

  const [southLOSWeek,setsouthLOSWeek] = useState(null)
  const [southLOSOld,setsouthLOSOld] = useState(null)
  const [southOnline, setsouthOnline] = useState(null)
  const [southDyingGasp, setsouthDyingGasp] = useState(null)
  const [southGEMPack,setsouthGEMPack] = useState(null)
  const [southLOP, setsouthLOP] = useState(null)

  const [northLOSWeek,setnorthLOSWeek] = useState(null)
  const [northLOSOld,setnorthLOSOld] = useState(null)
  const [northOnline, setnorthOnline] = useState(null)
  const [northDyingGasp, setnorthDyingGasp] = useState(null)
  const [northGEMPack,setnorthGEMPack] = useState(null)
  const [northLOP, setnorthLOP] = useState(null)

  const [centralLOSWeek,setcentralLOSWeek] = useState(null)
  const [centralLOSOld,setcentralLOSOld] = useState(null)
  const [centralOnline, setcentralOnline] = useState(null)
  const [centralDyingGasp, setcentralDyingGasp] = useState(null)
  const [centralGEMPack,setcentralGEMPack] = useState(null)
  const [centralLOP, setcentralLOP] = useState(null)

  useEffect(() => {

    
    let dates = new Date();

    let lastSevenDays = new Date(dates);
    lastSevenDays.toDateString();
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);

    let year = lastSevenDays.getFullYear();

    let month = (date) => {
      const m = date.getMonth() + 1;
      if (m.toString().length === 1) {
        return `0${m}`;
      } else {
        return m;
      }
    };
    let date = ("0" + lastSevenDays.getDate()).slice(-2);

    let complete_date = year + "-" + month(lastSevenDays) + "-" + date;

    view.when(async function () {

      let southLOSWeek = southCPELayer.createQuery();
      let southLOSOld = southCPELayer.createQuery();
      let southOnline = southCPELayer.createQuery();
      let southDyingGasp = southCPELayer.createQuery();
      let southGEMPack = southCPELayer.createQuery();
      let southLOP = southCPELayer.createQuery();

      // LOS Week
      southLOSWeek.where = `id LIKE 'CIR%' AND alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
      await southCPELayer.queryFeatures(southLOSWeek).then(function (response) {
            setsouthLOSWeek(response.features.length)
       
      });

      // LOS OLD
      southLOSOld.where = `id LIKE 'CIR%' AND alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
      await southCPELayer.queryFeatures(southLOSOld).then(function (response) {
        setsouthLOSOld(response.features.length)
        
      });

      // Online
      southOnline.where = "id LIKE 'CIR%' AND alarmstate = 0 AND status = 'Active'";
      await southCPELayer.queryFeatures(southOnline).then(function (response) {
        setsouthOnline(response.features.length)
   
      });

      // Gying Gasp
      southDyingGasp.where = "id LIKE 'CIR%' AND alarmstate = 1 AND status = 'Active'";
      await southCPELayer
        .queryFeatures(southDyingGasp)
        .then(function (response) {
            setsouthDyingGasp(response.features.length)
          
        });

      // GEMPack
      southGEMPack.where = "id LIKE 'CIR%' AND alarmstate = 3 AND status = 'Active'";
      await southCPELayer.queryFeatures(southGEMPack).then(function (response) {
        setsouthGEMPack(response.features.length)
      });

      // LOP
      southLOP.where = "id LIKE 'CIR%' AND alarmstate = 4 AND status = 'Active'";
      await southCPELayer.queryFeatures(southLOP).then(function (response) {
        setsouthLOP(response.features.length)

      });

      let northLOSWeek = northCPELayer.createQuery();
      let northLOSOld = northCPELayer.createQuery();
      let northOnline = northCPELayer.createQuery();
      let northDyingGasp = northCPELayer.createQuery();
      let northGEMPack = northCPELayer.createQuery();
      let northLOP = northCPELayer.createQuery();

       // LOS Week
       northLOSWeek.where = `id LIKE 'CIR%' AND alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
       await northCPELayer.queryFeatures(northLOSWeek).then(function (response) {
        setnorthLOSWeek(response.features.length)
         
       });
 
       // LOS OLD
       northLOSOld.where = `id LIKE 'CIR%' AND alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
       await northCPELayer.queryFeatures(northLOSOld).then(function (response) {
        setnorthLOSOld(response.features.length)
         
       });
 
       // Online
       northOnline.where = "id LIKE 'CIR%' AND alarmstate = 0 AND status = 'Active'";
       await northCPELayer.queryFeatures(northOnline).then(function (response) {
        setnorthOnline(response.features.length)
         
       });
 
       // Gying Gasp
       northDyingGasp.where = "id LIKE 'CIR%' AND alarmstate = 1 AND status = 'Active'";
       await northCPELayer
         .queryFeatures(northDyingGasp)
         .then(function (response) {
            setnorthDyingGasp(response.features.length)
           
         });
 
       // GEMPack
       northGEMPack.where = "id LIKE 'CIR%' AND alarmstate = 3 AND status = 'Active'";
       await northCPELayer.queryFeatures(northGEMPack).then(function (response) {
        setnorthGEMPack(response.features.length)
         
       });
 
       // LOP
       northLOP.where = "id LIKE 'CIR%' AND alarmstate = 4 AND status = 'Active'";
       await northCPELayer.queryFeatures(northLOP).then(function (response) {

        setnorthLOP(response.features.length)


       });


      let centralLOSWeek = centralCPELayer.createQuery();
      let centralLOSOld = centralCPELayer.createQuery();
      let centralOnline = centralCPELayer.createQuery();
      let centralDyingGasp = centralCPELayer.createQuery();
      let centralGEMPack = centralCPELayer.createQuery();
      let centralLOP = centralCPELayer.createQuery();

      // LOS Week
      centralLOSWeek.where = `id LIKE 'CIR%' AND alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
      await centralCPELayer
        .queryFeatures(centralLOSWeek)
        .then(function (response) {
      
          setcentralLOSWeek(response.features.length)
        });

      // LOS OLD
      centralLOSOld.where = `id LIKE 'CIR%' AND alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
      await centralCPELayer
        .queryFeatures(centralLOSOld)
        .then(function (response) {
          setcentralLOSOld(response.features.length)
          
        });

      // Online
      centralOnline.where = "id LIKE 'CIR%' AND alarmstate = 0 AND status = 'Active'";
      await centralCPELayer
        .queryFeatures(centralOnline)
        .then(function (response) {
          setcentralOnline(response.features.length)
          
        });

      // Gying Gasp
      centralDyingGasp.where = "id LIKE 'CIR%' AND alarmstate = 1 AND status = 'Active'";
      await centralCPELayer
        .queryFeatures(centralDyingGasp)
        .then(function (response) {
      
          setcentralDyingGasp(response.features.length)

        });

      // GEMPack
      centralGEMPack.where = "id LIKE 'CIR%' AND alarmstate = 3 AND status = 'Active'";
      await centralCPELayer
        .queryFeatures(centralGEMPack)
        .then(function (response) {
          setcentralGEMPack(response.features.length)
          
        });

      // LOP
      centralLOP.where = "id LIKE 'CIR%' AND alarmstate = 4 AND status = 'Active'";
      await centralCPELayer.queryFeatures(centralLOP).then(function (response) {
        setcentralLOP(response.features.length)
      });

    });
    
  });

  return (  <table id="example" className="table table-bordered table-striped js-basic-example dataTable" style ={styels.table}>
                            
  <thead style={{backgroundColor:'#7d5701', height:'20px'}}>
  <tr>
      <th>Alarm Info</th>
      <th>South</th>
      <th>North</th>
      <th>Central</th>
  </tr>
  </thead>
  <tbody>
  <tr>
      <td className="col-md-2" >Link Down</td>
      <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {southLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {southLOSOld}</td>
      <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {northLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {northLOSOld}</td>
      <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {centralLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {centralLOSOld}</td>
  </tr>

  <tr>
      <td className="col-md-2">Online</td>
      <td className="col-md-2">{southOnline}</td>
      <td className="col-md-2">{northOnline}</td>
      <td className="col-md-2">{centralOnline}</td>
  </tr>

  <tr>
      <td className="col-md-2">Powered Off</td>
      <td className="col-md-2">{southDyingGasp}</td>
      <td className="col-md-2">{northDyingGasp}</td>
      <td className="col-md-2">{centralDyingGasp}</td>
  </tr>

  <tr>
      <td className="col-md-2">GEM Packet Loss</td>
      <td className="col-md-2">{southGEMPack}</td>
      <td className="col-md-2">{northGEMPack}</td>
      <td className="col-md-2">{centralGEMPack}</td>
  </tr>

  <tr>
      <td className="col-md-2">Low Optical Power</td>
      <td className="col-md-2">{southLOP}</td>
      <td className="col-md-2">{northLOP}</td>
      <td className="col-md-2">{centralLOP}</td>
  </tr>
 
  </tbody>
</table>
)

}

const styels = {
    table:{
        backgroundColor: '#242424',
        color: 'white',
        fontSize:'13px',
        cursor:'pointer'
    },
    LOSRed:{
        fontSize:'8px',
        color:'red'
    },
    LOSOrange:{
        fontSize:'8px',
        color:'orange'
    }
}

