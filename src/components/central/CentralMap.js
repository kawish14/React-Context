import React, {useContext, useEffect, useRef,useState } from "react";
import  Header  from "../HeaderComponent"
import MapContext from "../../context/mapContext";
import Sidebar from '../Sidebar'
import { loadModules, setDefaultOptions } from 'esri-loader';
import CenterCustomer from "../../pages/central/CenterCustomer";
import CentralDC from '../../pages/central/CentralDC'
import CentralFAT from '../../pages/central/CentralFAT'
import CentralJoint from '../../pages/central/CentralJoint'
import CentralPOP from '../../pages/central/CentralPOP'
import CentralDistribution from '../../pages/central/CentralDistribution'
import CentralFeeder from '../../pages/central/CentralFeeder'
import CentralBackhaul from '../../pages/central/CentralBackhaul'
import CentralZone from '../../pages/central/CentralZone'
import CentralLayerlist from "../../pages/central/widget/CentralLayerlist";

import SearchWidget from '../../pages/appWidget/searchWidget/SearchWidget'
import ViewMaps from "../../pages/appWidget/ViewMaps";
import Gpondb from "../../pages/central/Gpondb";
import SelectionTool from '../../pages/appWidget/selectionTool/SelectionTool'
import ZonesLosiTicket from '../../pages/appWidget/zonal_tickets/CentralZoneTicket'

import Tracking from '../../pages/Tracking'
import Realtime from "../../pages/real-time/Realtime";
import HomeWidget from '../../pages/appWidget/Home'
import BaseMap from '../../pages/appWidget/BaseMap'
import CoordinateWidget from '../../pages/appWidget/CoordinateWidget'
import Legend from '../../pages/appWidget/Legend'

import {WaveLoadings} from '../loading/LoadingComponent'
import CSV from "../../pages/appWidget/csvFileUploader/CSV";
import KML from '../../pages/appWidget/kmlFileUploader/KML'
import '../css/mainFile.css'

import axios from 'axios'
import { authenticationService } from '../../_services/authentication';

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function CentralMap() {

    const context = useContext(MapContext)

    const mapRef = useRef();
    const loading = useRef()

    const [mapHeight, mapHeightUpdate] = useState('100%');
    const changeMapHeight = (e) => {mapHeightUpdate(e)}

    const[view,updateView] =  useState(null)

    const[centralStatus, updateCentralStatus] = useState({})
    const centralCPEstatus = (e) => {updateCentralStatus(e)}

    const[summaryTableHeight, SetsummaryTableHeight] = useState(null)
    const changeTableHeight = (e) => {SetsummaryTableHeight(e)}
    
    const [summary, summaryTable] = useState(false);
    const summaryTableFun = (e) => {summaryTable(e)} 

    const [search, updateSearch] = useState(null)
    const searchUpdateFun = (e) => {updateSearch(e)}

    const [ticket, updateTicket] = useState(null)

    const [file, updateFile] = useState(null)
    
    const [centralCPELayerView, UpdateCentralCPELayerView] = useState(null)
    const [InactiveCentralCPELayerView, UpdateInactiveCentralCPELayerView] = useState(null)

    const[centralDCView, UpdateCentralDCView] = useState(null)

  useEffect(() => {

    loadModules(["esri/Map","esri/views/MapView", "esri/layers/GeoJSONLayer"], { css: false })
    .then(([Map,MapView,GeoJSONLayer]) => {

      let map = new Map({
        basemap: "satellite",
      });
  
      let view = new MapView({
        map: map,
        center: [74.355626,31.545676],
        constraints: {
          maxScale: 0,
          minScale: 300000
        },
        scale: 288895,
        minScale:288895,
        extent: 'bounds',
        container: mapRef.current,
        popup: {
          dockEnabled: true,
          dockOptions: {
             
              buttonEnabled: true,
          
              breakpoint: false,
              position: "bottom-left"
          }
      }, 
       ui: {
           components: ["zoom", "compass", "attribution"]
       }
      });

      updateView(view)

      view.when(function(){
        view.ui.add(loading.current)
      })
      
      context.view.centralCPELayer.when(function(){
        view.ui.remove(loading.current)
        view.whenLayerView(context.view.centralCPELayer).then(function (layerView) {
          UpdateCentralCPELayerView(layerView)
        })
        /*  if(authenticationService.currentUserValue){
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
        }  */
       

      }, function(err){

        alert("Error in North Layer")

        view.ui.add(loading.current)

      })

      context.view.centralInactiveCPE.when(function(){
        view.whenLayerView(context.view.centralInactiveCPE).then(function (layerView) {
          UpdateInactiveCentralCPELayerView(layerView)
        })
      })

      context.view.centralDC.when(function(){
        view.whenLayerView(context.view.centralDC)
        .then(function(layerView){
          UpdateCentralDCView(layerView)
        })
      })

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

    })
   
    return () => {
      if(!!view){

        view.destroy();
        
      }
    }

  }, []);

  return (
    <div className="RegionComponentDiv">

    <h1 ref={loading} style={styles.loading}> 
        <WaveLoadings/>
        
    </h1>

    {view && (
        <Header view={view} search={search} ticket={updateTicket}  file={updateFile}
        centralCPEstatus={centralCPEstatus} />
    )}

    <div className="Map_SideBarDiv">
    {view && (
        <Sidebar view={view} 
     >
        </Sidebar>
      )}
    <div ref={mapRef} style={{width: "100%", height: mapHeight }}>
          {view && (
            <>
              <CenterCustomer view={view} centralCPEstatus={centralCPEstatus}/>
              <CentralDC view={view} />
              <CentralFAT view={view} />
              <CentralJoint view={view} />
              <CentralPOP view={view} />
              <CentralDistribution view={view} />
              <CentralFeeder view={view} />
              <CentralBackhaul view={view} />
              <CentralZone view={view} />
              <SearchWidget view={view} />
             
              <HomeWidget view={view} />
              <BaseMap view={view} />
              <CoordinateWidget view={view} />
              <Legend view={view} />

              <ViewMaps view={view} />

              <Tracking  view = {view} searchUpdateFun={searchUpdateFun}/>
              <Realtime 
                view = {view}
                centralCPEstatus={centralCPEstatus}
              /> 

              {/*  <ZonesLosiTicket view ={view} /> */}

              {file === "Upload CSV" && <CSV view={view} fileName={(e)=>updateFile(e)} />}
                {file === "Upload KML" && <KML view={view} fileName={(e)=>updateFile(e)} />}
            </>
          )}
      </div>
    </div>
     
      <div className="SumaryTableDiv" style={{height:summaryTableHeight}} >
        {view && (
          <>
            <Gpondb view={view} centralStatus = {centralStatus} summaryTableFun={summary}  ticket={ticket} />
            <SelectionTool view={view} changeTableHeight={changeTableHeight}  
              summaryTableFun={summaryTableFun}
              layerViews = {[centralCPELayerView,InactiveCentralCPELayerView,centralDCView]}

            />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  loading:{
    position: 'absolute',
    height: 100,
    width: 100,
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
    backgroundSize: '100%',
  },
  dashboard:{
    display:'flex',
    flexDirection: 'row'
  }
}