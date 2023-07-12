import React, {useContext, useEffect, useRef,useState } from "react";

import  Header  from "../HeaderComponent"
import Sidebar from '../Sidebar'

import MapContext from "../../context/mapContext";

import { loadModules, setDefaultOptions } from 'esri-loader';

import Customer from "../../pages/south/Customer";
import InactiveCPESouth from '../../pages/south/InactiveCPESouth'
import DC from '../../pages/south/DC'
import FAT from '../../pages/south/FAT'
import Joint from '../../pages/south/Joint'
import POP from '../../pages/south/POP'
import SouthDistribution from '../../pages/south/SouthDistribution'
import SouthFeeder from '../../pages/south/SouthFeeder'
import SouthBackhaul from "../../pages/south/SouthBackhaul";
import SouthZone from '../../pages/south/SouthZone'
import SouthDCDown from '../../pages/south/SouthDCDown'

import ViewMaps from "../../pages/appWidget/ViewMaps";
import Gpondb from "../../pages/south/Gpondb";
import ZonesLosiTicket from '../../pages/appWidget/zonal_tickets/ZonesLosiTicket'

import Tracking from '../../pages/Tracking'
import Realtime from "../../pages/real-time/Realtime";
import OfficeLocations from '../../pages/OfficeLocations'

import {WaveLoadings} from '../loading/LoadingComponent'
import LoadingBar from 'react-top-loading-bar'

import GulshanHH from "../../pages/south/project/gulshan/civil/GulshanHH";
import GulshanTrench from "../../pages/south/project/gulshan/civil/GulshanTrench";

import HomeWidget from '../../pages/appWidget/Home'
import BaseMap from '../../pages/appWidget/BaseMap'
import CoordinateWidget from '../../pages/appWidget/CoordinateWidget'
import Legend from '../../pages/appWidget/Legend'
import SelectionTool from "../../pages/appWidget/selectionTool/SelectionTool";
import SearchWidget from '../../pages/appWidget/searchWidget/SearchWidget'
import Pagination from '../../pages/south/widget/Pagination'

import axios from 'axios'
import { authenticationService } from '../../_services/authentication';

import '../css/mainFile.css'
import CSV from "../../pages/appWidget/csvFileUploader/CSV";
import KML from '../../pages/appWidget/kmlFileUploader/KML'

import {version} from '../../url'
import AddSplitters from "../../pages/appWidget/addSplitters/AddSplitters";


setDefaultOptions({ version: version })

export default function SouthMap() {

    const context = useContext(MapContext)

    const mapRef = useRef();
    const loading = useRef()

    const [mapHeight, mapHeightUpdate] = useState('100%');

    const[view,updateView] =  useState(null)

    const[southStatus, updateSouthStatus] = useState({})
    const southCPEstatus = (e) => {updateSouthStatus(e)}

    const[summaryTableHeight, SetsummaryTableHeight] = useState(null)
    const changeTableHeight = (e) => {SetsummaryTableHeight(e)}

    const [summary, summaryTable] = useState(false);
    const summaryTableFun = (e) => {  summaryTable(e)} 

    const [search, updateSearch] = useState(null)
    const searchUpdateFun = (e) => {updateSearch(e)}

    const [ticket, updateTicket] = useState(null)
    const updateTicketFun = (e) => {updateTicket(e)}

    const [file, updateFile] = useState(null)

    const [isModalOpen, UpdateisModalOpen] = useState(false);

    const [southCPELayerView, UpdateSouthCPELayerView] = useState(null)
    const [InactiveSouthCPELayerView, UpdateInactiveSouthCPELayerView] = useState(null)
    const [southDCLayerView, UpdateSouthDCLayerView] = useState(null)


  useEffect(() => {
   
    loadModules(["esri/Map","esri/views/MapView", "esri/layers/GeoJSONLayer","esri/Graphic","esri/widgets/Locate",],
     { css: false })
    .then(([Map,MapView,GeoJSONLayer,Graphic,Locate]) => {

      let map = new Map({
        basemap: "satellite",
      });
  
      let view = new MapView({
        map: map,
        center: [67.171837, 24.908468], 
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
             
              buttonEnabled: false,
          
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
  
        context.view.southCPELayer.when(function(){
          view.ui.remove(loading.current)
          
          view.whenLayerView(context.view.southCPELayer).then(function (layerView) {
            UpdateSouthCPELayerView(layerView)
          })
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
      
       
        }, function(err){
  
          alert("Error in South Layer")
  
          view.ui.add(loading.current)
  
        })

        context.view.southInactiveCPE.when(function(){
          view.whenLayerView(context.view.southInactiveCPE).then(function(layerView){
            UpdateInactiveSouthCPELayerView(layerView)
          })
        })

        context.view.southDC.when(function(){
          view.whenLayerView(context.view.southDC).then(function(layerView){
            UpdateSouthDCLayerView(layerView)
          })
        })

      })

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
        <Header view={view} search={search} ticket={updateTicketFun} file={updateFile}
       southCPEstatus={southCPEstatus} />
    )}

      <div  className="Map_SideBarDiv">
        {view && (
          <Sidebar view={view} >
          </Sidebar>
        )}

        <div ref={mapRef} style={{ width:'100%',maxHeight: mapHeight }} className="esri-map">
            {view && (
              <>
              
                <Customer view={view} southCPEstatus={southCPEstatus}/>
                <InactiveCPESouth view={view} />
                <DC view={view} />
                <FAT view={view} />
                <Joint view={view} />
                <POP view={view} />
                <SouthDistribution view={view} />
                <SouthFeeder view={view} />
                <SouthBackhaul view={view} />
                <SouthZone view={view} />
                <SearchWidget view={view} />
                
                <HomeWidget view = {view} />
                <BaseMap view={view} />
                <CoordinateWidget view={view} />
                <Legend view={view} />
               {/*  <Pagination view={view} /> */}

                <ViewMaps view={view} />

                <Tracking  view = {view} searchUpdateFun={searchUpdateFun}/>
                <Realtime 
                  view = {view}
                  southCPEstatus={southCPEstatus}
                /> 

                <OfficeLocations 
                  view={view}
                />

                <GulshanHH view = {view} />
                <GulshanTrench view={view} /> 

                 <ZonesLosiTicket view={view} />  
           
                {file === "Upload CSV" && <CSV view={view} fileName={(e)=>updateFile(e)} />}
                {file === "Upload KML" && <KML view={view} fileName={(e)=>updateFile(e)} />}
              
              </>
            )}
        </div>
        
         {view && (
          <SouthDCDown view = {view} />
          
        )} 
         
      </div>

      <div className="SumaryTableDiv" style={{height:summaryTableHeight}} >
        {view && (
          <>
            <Gpondb view={view} southStatus = {southStatus} summary={summary} ticket={ticket} />
 
            <SelectionTool view={view} changeTableHeight={changeTableHeight} 
              summaryTableFun={summaryTableFun}
              layerViews = {[southCPELayerView,southDCLayerView]} />
    

          {/* <AddSplitters view={view} /> */}
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
  }
}