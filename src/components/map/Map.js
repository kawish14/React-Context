import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../.././context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import "./user.css";
import HeaderComponent from "../header/HeaderComponent";
import Sidebar from "../sidebar/Sidebar";
import {WaveLoadings} from '../loading/LoadingComponent'
import { componentsRole,componentsPermission, otherComponents } from "./RoleBaseComponent";

import {version} from '../../url'

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

  const [region, setRegion] = useState('North');
  const regionFun = (e) => { setRegion(e) }

  const [search, updateSearch] = useState(null)
  const searchUpdateFun = (e) => {updateSearch(e)}

  const [ticket, updateTicket] = useState(null)
  const updateTicketFun = (e) => {updateTicket(e)}

  const [gponTable, setGponTable] = useState(false)

  const [file, updateFile] = useState(null)

  const [CPELayerView, UpdateCPELayerView] = useState(null)
  const [InactiveCPELayerView, UpdateInactiveCPELayerView] = useState(null)
  const [DCLayerView, UpdateDCLayerView] = useState(null)

  const [onFilterChange, setOnFilterChange] = useState({"South":[2,4], "North":[2,3,4], "Central":[2,4]});

  const [dataLoading, setDataLoading] = useState(true)
  const dataloadingFun = (e) => { setDataLoading(e) } 

  useEffect(() => {
    if(loginRole.role === 'Admin' || loginRole.role === 'North'){
      regionFun('North')
    }
    else if(loginRole.role === 'South'){
      regionFun('South')
    }
    else if(loginRole.role === 'Central'){
      regionFun('Central')
    }
    else {
      regionFun('North')
    }

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
            region = {region}
            onFilterChange={setOnFilterChange}
            dataloading={dataloadingFun}
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
                      {componentsRole.map(({ component: Component, roles, key }) => {
                        // Check if the user's role is in the array of roles for this component
                        if (roles.includes(loginRole.role)) {
                          return (
                            <Component
                              key={key}
                              view={view}
                              gponTable={setGponTable}
                              searchUpdateFun={searchUpdateFun}
                            />
                          );
                        }
                        return null;
                      })}

                      {componentsPermission.map(
                        ({ component: Component, permission, key }) => {
                          // Check if the user has the required role to render the component
                          if (loginRole.permission === permission) {
                            return <Component key={key} view={view} />;
                          }
                          return null; // Render nothing if the user doesn't have the required role
                        }
                      )}

                     
                    </>
                  )}
                </div>
              </div>
            </div>

            {view && (
              <>
                {otherComponents.map(({ component: Component, roles, key }) => {
                  // Check if the user's role is in the array of roles for this component
                  if (roles.includes(loginRole.role)) {
                    return (
                      <Component
                        key={key}
                        view={view}
                        summary={summary}
                        ticket={ticket}
                        ref={gponRef}
                        summaryTableFun={summaryTableFun}
                        region = {regionFun}
                        dataloading = {dataLoading}
                        dataloadingFun = {dataloadingFun}
                        currentFilters={onFilterChange}
                        layerViews={[
                          CPELayerView,
                          InactiveCPELayerView,
                          DCLayerView,
                        ]} // DCLayerView
                        setMapDiv={setMapDiv}
                      />
                    );
                  }
                  return null;
                })}
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