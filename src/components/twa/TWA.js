import React, {useContext, useEffect, useRef,useState } from "react";
import  Header  from "../HeaderComponent"
import Sidebar from '../Sidebar'
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from 'esri-loader';

import Realtime from "../../pages/real-time/Realtime";
import {WaveLoadings} from '../loading/LoadingComponent'

import HomeWidget from '../../pages/appWidget/Home'
import BaseMap from '../../pages/appWidget/BaseMap'
import CoordinateWidget from '../../pages/appWidget/CoordinateWidget'
import Legend from '../../pages/appWidget/Legend'

import SouthTWACPE from './layers/SouthTWACPE'
import Coverage from './layers/Coverage'
import TWASearch from './widgets/TWASearch'
import CIRTable from './widgets/CIRTable'
import ViewMaps from "../../pages/appWidget/ViewMaps";

import POP from "../../pages/south/POP";
import SouthFeeder from "../../pages/south/SouthFeeder";
import SouthDistribution from "../../pages/south/SouthDistribution";
import DC from "../../pages/south/DC";
import FAT from "../../pages/south/FAT";
import Joint from "../../pages/south/Joint";

import NorthPOP from "../../pages/north/NorthPOP";
import NorthFeeder from "../../pages/north/NorthFeeder";
import NorthDistribution from "../../pages/north/NorthDistribution";
import NorthDC from "../../pages/north/NorthDC";
import NorthFAT from "../../pages/north/NorthFAT";
import NorthJoint from "../../pages/north/NorthJoint";

import CentralPOP from "../../pages/central/CentralPOP";
import CentralFeeder from "../../pages/central/CentralFeeder";
import CentralDistribution from "../../pages/central/CentralDistribution";
import CentralDC from "../../pages/central/CentralDC";
import CentralFAT from "../../pages/central/CentralFAT";
import CentralJoint from "../../pages/central/CentralJoint";

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function TWA() {

    const context = useContext(MapContext)

    const mapRef = useRef();
    const loading = useRef()

    const [mapHeight, mapHeightUpdate] = useState('75vh');
    const changeMapHeight = (e) => {mapHeightUpdate(e)}

    const[view,updateView] =  useState(null)

    const[southStatus, updateSouthStatus] = useState({})
    const southCPEstatus = (e) => {updateSouthStatus(e)}

    const [summary, summaryTable] = useState(false);
    const summaryTableFun = (e) => {summaryTable(e)} 

    const [search, updateSearch] = useState(null)
    const searchUpdateFun = (e) => {updateSearch(e)}

  useEffect(() => {

    loadModules(["esri/Map","esri/views/MapView", "esri/layers/GeoJSONLayer"], { css: false })
    .then(([Map,MapView,GeoJSONLayer]) => {

      let map = new Map({
        basemap: "satellite",
      });
  
      let view = new MapView({
        map: map,
        center: [70.177627, 28.844898],
        scale: 18489298,
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

      context.southCPELayer.when(function(){
        view.ui.remove(loading.current)
     
      }, function(err){

        alert("Error in South Layer")

        view.ui.add(loading.current)

      })

      let labelClassProvince = {
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

    context.province.labelingInfo = labelClassProvince

    context.province.renderer =  {
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

    context.cities.labelingInfo = labelClassCity
    
    context.cities.renderer =  {
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
    <div style={{backgroundColor: '#2a2e32'}}>

      <h1 ref={loading} style={styles.loading}> 
            <WaveLoadings/>
          
      </h1>

    {view && (
        <Header view={view} search={search} />
    )}

    <div style={styles.dashboard}>
      {view && (
        <Sidebar view={view} >
        </Sidebar>
      )}
      <div ref={mapRef} style={{  width: "99vw", height: mapHeight }}>
          {view && (
            <>
              
              {/* <Layerlist view={view} /> */}
            <POP view = {view} />
            <SouthFeeder view = {view}/>
            <SouthDistribution view = {view} />
            <DC view = {view}/>
            <FAT view = {view} />
            <Joint view = {view}/>
            
            <NorthPOP view = {view}  />
            <NorthFeeder view = {view} />
            <NorthDistribution view = {view} />
            <NorthDC view = {view} />
            <NorthFAT view = {view} />
            <NorthJoint view = {view} />

            <CentralPOP view = {view} />
            <CentralFeeder view = {view} />
            <CentralDistribution view = {view} />
            <CentralDC view = {view}/>
            <CentralFAT view = {view}/>
            <CentralJoint view = {view} />

            <HomeWidget view = {view} />
            <BaseMap view={view} />
            <CoordinateWidget view={view} />
            <Legend view={view} />
            <SouthTWACPE view={view} />
            <Coverage view={view} />
            <TWASearch view={view} />
              <Realtime 
              view = {view}
              southCPEstatus={southCPEstatus}
              /> 

              <ViewMaps view ={view}/>
            
            </>
          )}
      </div>
    </div>

    <div>
        {view && (
          <>
            <CIRTable view={view} />
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