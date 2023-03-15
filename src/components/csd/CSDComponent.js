import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../HeaderComponent";
import MapContext from "../../context/mapContext";

import { loadModules, setDefaultOptions } from "esri-loader";

import Customer from "../../pages/south/Customer";
import CenterCustomer from "../../pages/central/CenterCustomer";
import NorthCustomer from "../../pages/north/NorthCustomer";

import NorthPOP from "../../pages/north/NorthPOP";
import CentralPOP from "../../pages/central/CentralPOP";
import POP from "../../pages/south/POP";

import SouthZone from "../../pages/south/SouthZone";
import NorthZone from "../../pages/north/NorthZone";
import CentralZone from "../../pages/central/CentralZone";

import SearchWidget from '../../pages/appWidget/searchWidget/SearchWidget'
import AppWidgets from "../admin/widget/AppWidgets";
import ViewMaps from "../../pages/appWidget/ViewMaps";
import Gpondb from "../admin/Gpondb";

import Sidebar from "../Sidebar";

import { WaveLoadings } from "../loading/LoadingComponent";

import axios from 'axios'
import { authenticationService } from '../../_services/authentication';

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function CSD() {
  const context = useContext(MapContext);

  const mapRef = useRef();
  const loading = useRef();

  const [mapHeight, mapHeightUpdate] = useState("75vh");
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

  const [summary, summaryTable] = useState(false);
  const summaryTableFun = (e) => {
    summaryTable(e);
  };

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
      });

      context.view.southCPELayer.when(
        function () {
          view.ui.remove(loading.current);

          if(authenticationService.currentUserValue){
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
          }

        },
        function (err) {
          alert("Error in South Layer");

          view.ui.add(loading.current);
        }
      );

      context.view.northCPELayer.when(
        function () {
          view.ui.remove(loading.current);
        },
        function (err) {
          alert("Error in North Layer");

          view.ui.add(loading.current);
        }
      );

      context.view.centralCPELayer.when(
        function () {
          view.ui.remove(loading.current);
        },
        function (err) {
          alert("Error in North Layer");

          view.ui.add(loading.current);
        }
      );

      let labelProvince = {
        symbol: {
          type: "text",
          color: "white",
          haloColor: "black",
          haloSize: 1,
          font: {
            family: "Playfair Display",
            size: 8,
            weight: "bold",
          },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: `$feature.NAME`,
        },
      };

      context.view.province.labelingInfo = labelProvince;
      context.view.province.renderer = {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [208, 174, 129, 0.8],
          outline: {
            width: 0.7,
            color: "white",
          },
        },
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
            weight: "bold",
          },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: `$feature.NAME`,
        },
      };

      context.view.cities.labelingInfo = labelClassCity;
      context.view.cities.renderer = {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [208, 174, 129, 0.8],
          outline: {
            width: 0.7,
            color: "white",
          },
        },
      };
    });

    return () => {
      if (!!view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#2a2e32" }}>
      <h1 ref={loading} style={styles.loading}>
        <WaveLoadings />
      </h1>

      {view && <Header view={view} />}

      <div style={styles.dashboard}>
        {view && <Sidebar view={view}></Sidebar>}

        <div
          ref={mapRef}
          style={{
            width: "99vw",
            height: mapHeight,
          }}
        >
          {view && (
            <>
              <Customer view={view} southCPEstatus={southCPEstatus} />
              <NorthCustomer view={view} northCPEstatus={northCPEstatus} />
              <CenterCustomer view={view} centralCPEstatus={centralCPEstatus} />

              <POP view={view} />
              <NorthPOP view={view} />
              <CentralPOP view={view} />

              <SouthZone view={view} />
              <NorthZone view={view} />
              <CentralZone view={view} />

              <SearchWidget view={view} />

              <AppWidgets view={view} />

              <ViewMaps view={view} />
            </>
          )}
        </div>
      </div>

      <div>
        {view && (
          <>
            <Gpondb
              view={view}
              southStatus={southStatus}
              northStatus={northStatus}
              centralStatus={centralStatus}
              summaryTableFun={summary}
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
  dashboard: {
    display: "flex",
    flexDirection: "row",
  },
};
