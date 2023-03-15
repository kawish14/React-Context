import React, {useContext, useEffect, useRef,useState } from "react";
import  Header  from "../HeaderComponent"
import MapContext from "../../context/mapContext";
import Sidebar from '../Sidebar'
import { loadModules, setDefaultOptions } from 'esri-loader';
import NorthCustomer from "../../pages/north/NorthCustomer";
import NorthDC from '../../pages/north/NorthDC'
import NorthFAT from '../../pages/north/NorthFAT'
import NorthJoint from '../../pages/north/NorthJoint'
import NorthPOP from '../../pages/north/NorthPOP'
import NorthDistribution from '../../pages/north/NorthDistribution'
import NorthFeeder from '../../pages/north/NorthFeeder'
import NorthBackhaul from "../../pages/north/NorthBackhaul";
import NorthZone from '../../pages/north/NorthZone'
import NorthDCDown from '../../pages/north/NorthDCDown'

import SearchWidget from '../../pages/appWidget/searchWidget/SearchWidget'
import ViewMaps from "../../pages/appWidget/ViewMaps";
import Gpondb from "../../pages/north/Gpondb";
import SelectGraphic from '../../pages/appWidget/selectionTool/SelectGraphic'
import ZonesLosiTicket from '../../pages/appWidget/zonal_tickets/ZonesLosiTicket'

import Tracking from '../../pages/Tracking'
import Realtime from "../../pages/Realtime";
import OfficeLocations from '../../pages/OfficeLocations'

import HomeWidget from '../../pages/appWidget/Home'
import BaseMap from '../../pages/appWidget/BaseMap'
import CoordinateWidget from '../../pages/appWidget/CoordinateWidget'
import Legend from '../../pages/appWidget/Legend'

import {WaveLoadings} from '../loading/LoadingComponent'

import axios from 'axios'
import { authenticationService } from '../../_services/authentication';

import CSV from "../../pages/appWidget/csvFileUploader/CSV";
import KML from '../../pages/appWidget/kmlFileUploader/KML'

import '../css/mainFile.css'

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function NorthMap() {

  const context = useContext(MapContext)

    const mapRef = useRef();
    const loading = useRef()

    const [mapHeight, mapHeightUpdate] = useState('100%');

    const[view,updateView] =  useState(null)

    const[northStatus, updateNorthStatus] = useState({})
    const northCPEstatus = (e) => {updateNorthStatus(e)}

    const[summaryTableHeight, SetsummaryTableHeight] = useState(null)
    const changeTableHeight = (e) => {SetsummaryTableHeight(e)}
    
    const [summary, summaryTable] = useState(false);
    const summaryTableFun = (e) => {summaryTable(e)} 

    const [search, updateSearch] = useState(null)
    const searchUpdateFun = (e) => {updateSearch(e)}

    const [ticket, updateTicket] = useState(null)

    const [file, updateFile] = useState(null)

    const[northCPELayerView, UpdateNorthCPELayerView] = useState(null)
    const [InactiveNorthCPELayerView, UpdateInactiveNorthCPELayerView] = useState(null)

    const[northDCView, UpdateNorthDCView] = useState(null)

  useEffect(() => {

    loadModules(["esri/Map","esri/views/MapView", "esri/layers/GeoJSONLayer"], { css: false })
    .then(([Map,MapView,GeoJSONLayer]) => {

      let map = new Map({
        basemap: "satellite",
      });
  
      let view = new MapView({
        map: map,
        center: [73.239156, 33.663228], 
        scale: 577791,
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
      
      context.view.northCPELayer.when(function(){
        view.ui.remove(loading.current)

        view.whenLayerView(context.view.northCPELayer).then(function (layerView) {
          UpdateNorthCPELayerView(layerView)
        })
        /* if(authenticationService.currentUserValue){
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
        
        
      }, function(err){

        alert("Error in North Layer")

        view.ui.add(loading.current)

      })

      context.view.northInactiveCPE.when(function(){
        view.whenLayerView(context.view.northInactiveCPE).then(function (layerView) {
          UpdateInactiveNorthCPELayerView(layerView)
        })
      })

      context.view.northDC.when(function(){
        view.whenLayerView(context.view.northDC)
        .then(function(layerView){
          UpdateNorthDCView(layerView)
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
        <Header view={view} search={search} ticket={updateTicket} file={updateFile} 
        northCPEstatus={northCPEstatus} />
    )}
    
    <div className="Map_SideBarDiv">

    {view && (
        <Sidebar view={view} 
          
              >
        </Sidebar>
      )}

    <div ref={mapRef} style={{  width: "100%", height: mapHeight }}>
          {view && (
            <>
              <NorthCustomer view={view} northCPEstatus={northCPEstatus}/>
              <NorthDC view={view} />
              <NorthFAT view={view} />
              <NorthJoint view={view} />
              <NorthPOP view={view} />
              <NorthDistribution view={view} />
              <NorthFeeder view={view} />
              <NorthBackhaul view={view} />
              <NorthZone view={view} />
              <SearchWidget view={view} />
              
              <HomeWidget view={view} />
              <BaseMap view={view} />
              <CoordinateWidget view={view} />
              <Legend view={view} />

              <ViewMaps view={view} />

              <Tracking  view = {view} searchUpdateFun={searchUpdateFun}/>
              <Realtime 
                view = {view}
                northCPEstatus={northCPEstatus}
              /> 

              <OfficeLocations 
                view={view}
              />

           {/*    <ZonesLosiTicket view={view} /> */}

              {file === "Upload CSV" && <CSV view={view} fileName={(e)=>updateFile(e)} />}
                {file === "Upload KML" && <KML view={view} fileName={(e)=>updateFile(e)} />}
            </>
          )}
      </div>
       {/*   {view && (
          <NorthDCDown view = {view} />
        )}   */}
      
    </div>
      
      <div className="SumaryTableDiv" style={{height:summaryTableHeight}}>
        {view && (
          <>
            <Gpondb view={view} northStatus = {northStatus} summaryTableFun={summary}  ticket={ticket}  />
              <SelectGraphic view={view} changeTableHeight={changeTableHeight} 
                summaryTableFun={summaryTableFun}
                layerViews = {[northCPELayerView,InactiveNorthCPELayerView,northDCView]}

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