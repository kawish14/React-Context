import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../HeaderComponent";
import MapContext from "../../context/mapContext";
import Sidebar from "../Sidebar";
import { loadModules, setDefaultOptions } from "esri-loader";

import Customer from "../../pages/south/Customer";
import InactiveCPESouth from "../../pages/south/InactiveCPESouth"

import CenterCustomer from "../../pages/central/CenterCustomer";
import InactiveCPECentral from "../../pages/central/InactiveCPECentral"

import NorthCustomer from "../../pages/north/NorthCustomer";
import InactiveCPENorth from "../../pages/north/InactiveCPENorth"

import NorthPOP from "../../pages/north/NorthPOP";
import CentralPOP from "../../pages/central/CentralPOP";
import POP from "../../pages/south/POP";

import SouthZone from "../../pages/south/SouthZone";
import NorthZone from "../../pages/north/NorthZone";
import CentralZone from "../../pages/central/CentralZone";

import NorthFeeder from "../../pages/north/NorthFeeder";
import NorthDistribution from "../../pages/north/NorthDistribution";
import NorthBackhaul from '../../pages/north/NorthBackhaul'

import SouthFeeder from "../../pages/south/SouthFeeder";
import SouthDistribution from "../../pages/south/SouthDistribution";
import SouthBackhaul from '../../pages/south/SouthBackhaul'

import CentralFeeder from "../../pages/central/CentralFeeder";
import CentralDistribution from "../../pages/central/CentralDistribution";
import CentralBackhaul from '../../pages/central/CentralBackhaul'

import DC from "../../pages/south/DC";
import NorthDC from "../../pages/north/NorthDC";
import CentralDC from "../../pages/central/CentralDC";

import FAT from "../../pages/south/FAT";
import NorthFAT from "../../pages/north/NorthFAT";
import CentralFAT from "../../pages/central/CentralFAT";

import Joint from "../../pages/south/Joint";
import NorthJoint from "../../pages/north/NorthJoint";
import CentralJoint from "../../pages/central/CentralJoint";

import SouthDCDown from '../../pages/south/SouthDCDown'
import NorthDCDown from '../../pages/north/NorthDCDown'

import SearchWidget from '../../pages/appWidget/searchWidget/SearchWidget'
import AppWidgets from "./widget/AppWidgets";
import ViewMaps from "../../pages/appWidget/ViewMaps";
import Gpondb from "./Gpondb";
import SelectionTool from '../../pages/appWidget/selectionTool/SelectionTool'

import Tracking from "../../pages/Tracking";
import Realtime from "../../pages/real-time/Realtime";
import OfficeLocations from "../../pages/OfficeLocations";
import ZonesLosiTicket from '../../pages/appWidget/zonal_tickets/ZonesLosiTicket'

import { WaveLoadings } from "../loading/LoadingComponent";

import '../css/mainFile.css'
import CSV from "../../pages/appWidget/csvFileUploader/CSV";
import KML from '../../pages/appWidget/kmlFileUploader/KML'

import axios from 'axios'
import { authenticationService } from '../../_services/authentication';

import {version} from '../../url'
import Legend from "../../pages/appWidget/Legend";
import BaseMap from "../../pages/appWidget/BaseMap";
import HomeWidget from "../../pages/appWidget/Home";
import CoordinateWidget from "../../pages/appWidget/CoordinateWidget";
setDefaultOptions({ version: version })

export default function Admin() {


  const context = useContext(MapContext);

  const mapRef = useRef();
  const loading = useRef();

  const [mapHeight, mapHeightUpdate] = useState("100%");
  const changeMapHeight = (e) => {
    mapHeightUpdate(e);
  };

  const [view, updateView] = useState(null);

  const [southStatus, updateSouthStatus] = useState({});
  const southCPEstatus = (e) => {
    updateSouthStatus(e);
  };

  const [northStatus, updateNorthStatus] = useState({});
  const northCPEstatus = (e) => {
    updateNorthStatus(e);
  };

  const [centralStatus, updateCentralStatus] = useState({});
  const centralCPEstatus = (e) => {
    updateCentralStatus(e);
  };

  const[summaryTableHeight, SetsummaryTableHeight] = useState(null)
  const changeTableHeight = (e) => {SetsummaryTableHeight(e)}

  const [summary, summaryTable] = useState(false);
  const summaryTableFun = (e) => {
    summaryTable(e);
  };

  const [search, updateSearch] = useState(null);
  const searchUpdateFun = (e) => {
    updateSearch(e);
  };

  const [southLayerViewCPE, southLayerViewCPEupdate] = useState(null);
  const [southInactiveCPE, southInactiveCPEupdate] = useState(null)

  const [northLayerViewCPE, northLayerViewCPEupdate] = useState(null);
  const [northInactiveCPE, northInactiveCPEupdate] = useState(null)
 
  const [centralLayerViewCPE, centralLayerViewCPEupdate] = useState(null);
  const[centralInactiveCPE, centralInactiveCPEupdate] = useState(null)

  const[southDCView, UpdateSouthDCView] = useState(null)
  const[northDCView, UpdateNorthDCView] = useState(null)
  const[centralDCView, UpdateCentralDCView] = useState(null)

  const [SouthTicket, updateSouthTicket] = useState(null)
  const [NorthTicket, updateNorthTicket] = useState(null)
  const [CentralTicket, updateCentralTicket] = useState(null)

  const [file, updateFile] = useState(null)


  useEffect(() => {
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/GeoJSONLayer"],
      { css: false }
    ).then(([Map, MapView, GeoJSONLayer]) => {
      let map = new Map({
        basemap: "satellite",
      });

      let view = new MapView({
        map: map,
        center: [70.177627, 28.844898],
        scale: 18489298,
        container: mapRef.current,
        /* navigation: {
          mouseWheelZoomEnabled: false,
          browserTouchPanEnabled: false
        }, */
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: true,

            breakpoint: false,
            position: "bottom-left",
          },
        },
        ui: {
          components: ["zoom", "compass", "attribution"],
        },
      });

      updateView(view);

      view.when(function () {
        view.ui.add(loading.current);
        layerViews(view)

      });
      
    
      let labelProvince = {
        symbol: {
            type: "text",  
            color: "white",
            haloColor: "black",
            haloSize: 1,
            font: {  
                family: "Playfair Display",
                size: 8,
                weight: "bold"
            }
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: `$feature.NAME`
        }
    }

    context.view.province.labelingInfo = labelProvince
    context.view.province.renderer =  {
      type: "simple",  
      symbol: {
        type: "simple-fill",  
        color: [ 208, 174, 129, 0.8 ],
        outline: {  
          width: 0.7,
          color: "white"
        }
      }
    };


    let labelClassCity = {
      symbol: {
          type: "text",  
          color: "white",
          haloColor: "black",
          haloSize: 1,
          font: {  
              family: "Playfair Display",
              size: 8,
              weight: "bold"
          }
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
          expression: `$feature.NAME`
      }
    }

    context.view.cities.labelingInfo = labelClassCity
    context.view.cities.renderer =  {
      type: "simple",  
      symbol: {
        type: "simple-fill",  
        color: [ 208, 174, 129, 0.8 ],
        outline: {  
          width: 0.7,
          color: "white"
        }
      }
    };
    

    });

    return () => {
      if(!!view){
        
        view.destroy();
        
      }
    };
  }, []);

  let layerViews = (view) => {

    // South
    context.view.southCPELayer.when(
      function () {
        view.ui.remove(loading.current);
        view
          .whenLayerView(context.view.southCPELayer)
          .then(function (layerView) {
            southLayerViewCPEupdate(layerView);
          });
        /*   if(authenticationService.currentUserValue){
          axios.post('http://gis.tes.com.pk:28200/user/login', {
          username:authenticationService.currentUserValue.username,
          role:authenticationService.currentUserValue.role,
          region:authenticationService.currentUserValue.region,
          token:authenticationService.currentUserValue.token,
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        }   */
      },
      function (err) {
        alert("Error in South Layer");

        view.ui.add(loading.current);
      }
    );

    context.view.southInactiveCPE.when(function () {
      view
        .whenLayerView(context.view.southInactiveCPE)
        .then(function (layerView) {
          southInactiveCPEupdate(layerView);
        });
    });

    // North
    context.view.northCPELayer.when(
      function () {
        view.ui.remove(loading.current);
        view
          .whenLayerView(context.view.northCPELayer)
          .then(function (layerView) {
            northLayerViewCPEupdate(layerView);
          });
      },
      function (err) {
        alert("Error in North Layer");

        view.ui.add(loading.current);
      }
    );
    context.view.northInactiveCPE.when(function () {
      view
        .whenLayerView(context.view.northInactiveCPE)
        .then(function (layerView) {
          northInactiveCPEupdate(layerView);
        });
    });

    // Central
    context.view.centralCPELayer.when(
      function () {
        view.ui.remove(loading.current);
        view
          .whenLayerView(context.view.centralCPELayer)
          .then(function (layerView) {
            centralLayerViewCPEupdate(layerView);
          });
      },
      function (err) {
        alert("Error in North Layer");

        view.ui.add(loading.current);
      }
    );

    context.view.centralInactiveCPE.when(function () {
      view
        .whenLayerView(context.view.centralInactiveCPE)
        .then(function (layerView) {
          centralInactiveCPEupdate(layerView);
        });
    });

    context.view.southDC.when(function(){
      view.whenLayerView(context.view.southDC)
      .then(function(layerView){
        UpdateSouthDCView(layerView)
      })
    })

    context.view.northDC.when(function(){
      view.whenLayerView(context.view.northDC)
      .then(function(layerView){
        UpdateNorthDCView(layerView)
      })
    })

    context.view.centralDC.when(function(){
      view.whenLayerView(context.view.centralDC)
      .then(function(layerView){
        UpdateCentralDCView(layerView)
      })
    })
  };

  return (
    <div className="RegionComponentDiv" >
      <h1 ref={loading} style={styles.loading}>
        <WaveLoadings />
      </h1>

      {view && 
      <Header view={view} search={search}
        SouthTicket={updateSouthTicket}
        NorthTicket={updateNorthTicket}
        CentralTicket={updateCentralTicket}
        file={updateFile}

        southCPEstatus={southCPEstatus}
        northCPEstatus={northCPEstatus}
        centralCPEstatus={centralCPEstatus}
       />
      }

      <div style={{width:'100%'}} className="Map_SideBarDiv">

        {view && 
        <Sidebar view={view}>

        </Sidebar>
        }

        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: mapHeight,
          }}
        >
          {view && (
            <>
              <Customer view={view} southCPEstatus={southCPEstatus} />
              <InactiveCPESouth view ={view} />

              <NorthCustomer view={view} northCPEstatus={northCPEstatus} />
              <InactiveCPENorth view={view} />

              <CenterCustomer view={view} centralCPEstatus={centralCPEstatus} />
              <InactiveCPECentral view={view} />

              <DC view={view} />
              <NorthDC view={view} />
              <CentralDC view={view} />

              <FAT view={view} />
              <NorthFAT view={view} />
              <CentralFAT view={view} />

              <Joint view={view} />
              <NorthJoint view={view} />
              <CentralJoint view={view} />

              <POP view={view} />
              <NorthPOP view={view} />
              <CentralPOP view={view} />

              <SouthDistribution view={view} />
              <NorthDistribution view={view} />
              <CentralDistribution view={view} />

              <SouthFeeder view={view} />
              <NorthFeeder view={view} />
              <CentralFeeder view={view} />

              <SouthBackhaul view={view} />
              <NorthBackhaul view={view} />
              <CentralBackhaul view={view} />

              <SouthZone view={view} />
              <NorthZone view={view} />
              <CentralZone view={view} />

              <SearchWidget view={view} />

              <Legend view={view} />
              <BaseMap view={view} />
              <HomeWidget view={view} />
              <CoordinateWidget view={view} />

              <ViewMaps view={view} />

              <Tracking view={view} searchUpdateFun={searchUpdateFun} />
              <Realtime
                view={view}
                southCPEstatus={southCPEstatus}
                northCPEstatus={northCPEstatus}
                centralCPEstatus={centralCPEstatus}
              />

             {/*  <OfficeLocations view={view} /> */}

              {/* <ZonesLosiTicket view={view} /> */}

              
              {file === "Upload CSV" && <CSV view={view} fileName={(e)=>updateFile(e)} />}
              {file === "Upload KML" && <KML view={view} fileName={(e)=>updateFile(e)} />}

            </>
          )}
        </div> 
       {/*   {view && (
          <>
            <SouthDCDown view = {view} />
            <NorthDCDown view = {view} />
          </>
    
        )}   */}
      </div>

      <div style={{height:'16%'}} className="SumaryTableDiv">
        {view && (
          <>
            <Gpondb
              view={view}
              southStatus={southStatus}
              northStatus={northStatus}
              centralStatus={centralStatus}
              summaryTableFun={summary}
              SouthTicket={SouthTicket}
              NorthTicket={NorthTicket}
              CentralTicket={CentralTicket}
            />
            <SelectionTool
              view={view}
              changeTableHeight={changeTableHeight} 
              summaryTableFun={summaryTableFun}
              layerViews = {[
                southLayerViewCPE,southInactiveCPE,
                northLayerViewCPE,northInactiveCPE,
                centralLayerViewCPE,centralInactiveCPE,
                southDCView,northDCView,centralDCView
                ]}

            />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  loading: {
    position: "absolute",
    height: 100,
    width: 100,
    top: "50%",
    left: "50%",
    marginLeft: -50,
    marginTop: -50,
    backgroundSize: "100%",
  },
  dashboard:{
    display:'flex',
    flexDirection: 'row',
    width:'99vw'
  }
};
