import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../.././context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import "./user.css";
import HeaderComponent from "../header/HeaderComponent";
import Sidebar from "../sidebar/Sidebar";
import {WaveLoadings} from '../loading/LoadingComponent'
import LayerList from "../../widgets/layerlist/LayerList";
import Customer from "../../map-items/layers/Customer";
import Gpondb from "../../map-items/table/Gpondb";
import SelectGraphic from "../../widgets/selectionTool/SelectGraphic";
import SearchWidget from "../../widgets/search/SearchWidget";
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
import {version} from '../../url'
import Tracking from "../../map-items/real-time/vehicle-tracking/Tracking";
import InactiveCPE from "../../map-items/layers/InactiveCPE";
import DC from "../../map-items/layers/DC";
import FAT from "../../map-items/layers/FAT";
import Joint from "../../map-items/layers/Joint";
import Feeder from "../../map-items/layers/Feeder";
import Distribution from "../../map-items/layers/Distribution";
import Backhaul from "../../map-items/layers/Backhaul"
import POP from "../../map-items/layers/POP";
import Zone from "../../map-items/layers/Zone";
import HomeWidget from "../../widgets/mini-widgets/HomeWidget";
import CoordinateWidget from "../../widgets/mini-widgets/CoordinateWidget";
import Editor from "../../widgets/editor/Editor";
import Legend from "../../widgets/legend/Legend";
import Outage from "../../map-items/layers/Outage";
import GISEditor from "../../widgets/editor/GISEditor";

setDefaultOptions({ version: version });

export default function Map() {

  const context = useContext(MapContext)
  const {loginRole} = context.view

  const mapRef = useRef();
  const loading = useRef();
  const gponRef = useRef()

  const [mapDiv, setMapDiv] = useState('hidden')
  const[view,updateView] =  useState(null)

  const [summary, summaryTable] = useState(false);
  const summaryTableFun = (e) => {  summaryTable(e)} 

  const [search, updateSearch] = useState(null)
  const searchUpdateFun = (e) => {updateSearch(e)}

  const [ticket, updateTicket] = useState(null)
  const updateTicketFun = (e) => {updateTicket(e)}

  const [gponTable, setGponTable] = useState(false)

  const [file, updateFile] = useState(null)

  const [CPELayerView, UpdateCPELayerView] = useState(null)
  const [InactiveCPELayerView, UpdateInactiveCPELayerView] = useState(null)
  const [DCLayerView, UpdateDCLayerView] = useState(null)


  useEffect(() => {
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/GeoJSONLayer",
        "esri/Graphic",
        "esri/widgets/Locate",
      ],
      { css: false }
    ).then(([Map, MapView, GeoJSONLayer, Graphic, Locate]) => {
      let map = new Map({
        basemap: "satellite",
      });

      let view = new MapView({
        map: map,
        center: context.view.center,
          constraints: {
          maxScale: 0,
          minScale: context.view.minScale,
        },
       // scale: context.view.scale,
        //minScale: 288895,
        extent: "bounds",
        container: mapRef.current,
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,

            breakpoint: false,
            position: "bottom-left",
          },
        },
        ui: {
          components: ["zoom", "compass", "attribution"],
        },
      });

      updateView(view)
      view.when(function () {
        view.ui.add(loading.current);

        context.view.customer.when(
          function () {
            view
              .whenLayerView(context.view.customer)
              .then(function (layerView) {
                view.ui.remove(loading.current);
                UpdateCPELayerView(layerView);
              });
          },
          function (err) {
            alert("Error in Active Customer's Layer");

            view.ui.add(loading.current);
          }
        );

        context.view.InactiveCPE.when(function () {
          view
            .whenLayerView(context.view.InactiveCPE)
            .then(function (layerView) {
              UpdateInactiveCPELayerView(layerView);
            });
        });

        context.view.DC_ODB.when(function(){
          view.whenLayerView(context.view.DC_ODB)
          .then(function(layerView){
            UpdateDCLayerView(layerView)
          })
        })

      
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


    });

    return () => {
      if(!!view){
        
        view.destroy();
        
      }
    }

  },[]);

useEffect(() =>{

  if(gponTable){
    let region = ['South', 'North', 'Central']
    region.forEach(region_name =>{
      gponRef.current.tableData(region_name)
    })
    setGponTable(false)
  }

},[gponTable])
  return (
    <div className="main_div">
      <h1 ref={loading} style={styles.loading}>
        <WaveLoadings />
      </h1>

      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          type="button"
        >
          <i className="fas fa-bars"></i>
        </button>
        {view && (
          <HeaderComponent
            view={view}
            ticket={updateTicketFun}
            search={search}
            gponTable={setGponTable}
            file={updateFile}
          />
        )}
      </nav>

      <div id="layoutSidenav">
        {view && <Sidebar view={view} />}

        <div id="layoutSidenav_content">
          <div className="container-fluid" style={{ overflow: mapDiv }}>
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div ref={mapRef} className="map">
                  {view && (
                    <>
                      <Customer view={view} gponTable={setGponTable} />
                      <InactiveCPE view={view} />
                      <DC view={view} />
                      <FAT view={view} />
                      <Joint view={view} />
                      <POP view={view} />
                      <Feeder view={view} />
                      <Distribution view={view} />
                      <Backhaul view={view} />
                      <Zone view={view} />
                      <Outage view={view} />

                      <SearchWidget view={view} />
                      {loginRole.permission === "Edit" ? <Editor view={view} /> : null}
                      {loginRole.permission === "GIS" ? <GISEditor view={view} /> : null}

                      <Tracking view={view} searchUpdateFun={searchUpdateFun} />
                      <HomeWidget view={view} />
                      <CoordinateWidget view={view} />
                      <Legend view={view} />
       
                     {/* {file === "Upload GeoJSON" && <UploadGeoJSON view={view} fileName={(e)=>updateFile(e)} />} */}
                       
                    </>
                  )}
                </div>
              </div>
            </div>

            {view && (
              <>
                <Gpondb
                  view={view}
                  summary={summary}
                  ticket={ticket}
                  ref={gponRef}
                />

                <SelectGraphic
                  view={view}
                  summaryTableFun={summaryTableFun}
                  layerViews={[CPELayerView, InactiveCPELayerView, DCLayerView]} // DCLayerView
                  setMapDiv={setMapDiv}
                />
              </>
            )}
          </div>
        </div>
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