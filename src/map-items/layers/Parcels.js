import React, { useContext, useEffect, useState, useRef } from "react";
import MapContext from "../../context/mapContext";
import axios from "axios";
import { loadModules, setDefaultOptions } from "esri-loader";
import {api} from '../../url'
import './css/layer.css'

import {version} from '../../url'
setDefaultOptions({ version: version })

let layer;
let count = 0;
let a = 0;
let b = 0;

export default function Parcels(props) {
  let context = useContext(MapContext);

  const parcel_filter = useRef();
  const btn = useRef();
  const parcel_table = useRef()

  let empty = (arr) => (arr.length = 0);

  const [indexing] = useState([
    "created_user",
    "created_date",
    "last_edited_user",
    "last_edited_date",
    "gdb_geomattr_data",
    "sde_state_id",
    "shape",
    "query",
    "wf_status",
    "objectid",
    "landuse",
    "floor",
    "shops",
    "offices",
    "size",
    "comments",
    "plot",
    "street",
    "city",
    "province",
    "flats",
    "category",
    "type",
  ]);

  const [tableVisible, updateTableVisible] = useState("none")
  const [visibility, updateVisibility] = useState("hidden")

  const [latLon, updateLatLon] = useState(null);
  const [latLon1, updateLatLon1] = useState(null);

  const [townData, updateTownData] = useState([]);
  const [blockData, updateBlockData] = useState([]);
  const [subBlockData, updateSubBlockData] = useState([]);

  const [SelectTownData, updateSelectTownData] = useState(null);
  const [SelectBlockData, updateSelectBlockData] = useState(null);
  const [SelectSubBlockData, updateSelectSubBlockData] = useState(null);

  const [disabled, updateDisabled] = useState(false);
  const [disabled1, updateDisabled1] = useState(false);

  const [loading, UpdateLoading] = useState(true);
  const [dataLoading, updateDataLoading] = useState(false);

  const [data, updateData] = useState(null);
  const [tableData, updateTableData] = useState(null);


  useEffect(() => {
    let columnData = [];

    loadModules(["esri/widgets/Expand"], {
      css: false,
    }).then(([Expand]) => {
      let layerListExpand = new Expand({
        expandIconClass: "esri-icon-filter",
        view: props.view,
        content: parcel_filter.current,
        group: "bottom-right",
        expanded: false,
      });

      // props.view.ui.remove(layerListExpand);
      props.view.when(function () {
        updateVisibility("visible");
        props.view.ui.add(layerListExpand, "top-right");
        props.view.ui.add(parcel_table.current);
      });
    });

    let CQL_FILTER = `town NOT in(' ') AND town is not null`;

    axios
      .get(
        `${api}/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Aparcel_evw&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`
      )
      .then(function (response) {
        empty(townData);

        updateData(response.data);
        UpdateLoading(!loading);

        response.data.features.map((e, i) => {
          columnData.push(e.properties.town);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        let uniqueChars = [...new Set(columnData)];
       // townData.push(uniqueChars);

        const sortedList = uniqueChars.sort((a, b) => a.localeCompare(b));
        //console.log(sortedList.toString());

        townData.push(sortedList);

        updateTownData(townData);

        empty(columnData);


      });

    

  }, []);

  let townFun = (e) => {
    let columnData = [];

    updateSelectTownData(e.target.value);
    UpdateLoading(true);

    empty(blockData);
    empty(subBlockData);
    updateSelectBlockData(null);
    updateSelectSubBlockData(null);
    updateDisabled(false);
    updateDisabled1(false);

    let CQL_FILTER = `town='${e.target.value}'`;

    axios
      .get(
        `${api}/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Aparcel_evw&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`
      )
      .then((response) => {
        response.data.features.map((e) => {
          columnData.push(e.properties.block_phase_sector);
          UpdateLoading(false);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
       // const sortedList = columnData.sort((a, b) => a.localeCompare(b));
        let uniqueChars = [...new Set(columnData)];

        blockData.push(uniqueChars.sort());

        updateBlockData(blockData);
        empty(columnData);

        updateTableData({
          town: "",
          block: "",
          subBlock: "",
          residential: 0,
          commercial: 0,
          total: 0,
        });
      });

    /*     data.features.map((e) => {
      if (e.properties.town === town) {
        columnData.push(e.properties.block_phase_sector);
      }
    }); */
  };

  let blockFun = (e) => {
    updateSelectSubBlockData(null);
    updateDisabled1(false);
    updateDisabled(false);
    UpdateLoading(true);

    let CQL_FILTER = `town='${SelectTownData}' AND block_phase_sector='${e.target.value}'`;

    let columnData = [];

    updateSelectBlockData(e.target.value);
    let obj = {
      block: e.target.value,
      subBlock: "",
      residential: 0,
      commercial: 0,
      total: 0,
    };

    empty(subBlockData);

    axios
      .get(
        `${api}/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Aparcel_evw&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`
      )
      .then((response) => {
        response.data.features.map((e) => {
          columnData.push(e.properties.sub_block_phase_sector);
          UpdateLoading(false);
          updateDisabled(true);
          updateLatLon(e.geometry.coordinates[0][0]);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        let uniqueChars = [...new Set(columnData)];
        subBlockData.push(uniqueChars.sort());

        updateSubBlockData(subBlockData);
        empty(columnData);

        updateTableData(obj);
      });
  };

  let getData = (e) => {
    UpdateLoading(true);
    updateDisabled1(false);
    updateSelectSubBlockData(e.target.value);

    let obj = {
      block: SelectBlockData,
      subBlock: e.target.value,
      residential: 0,
      commercial: 0,
      total: 0,
    };

    let CQL_FILTER = `town='${SelectTownData}' AND block_phase_sector='${SelectBlockData}' AND sub_block_phase_sector='${e.target.value}'`;
    axios
      .get(
        `${api}/geoserver/South_PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=South_PostGIS%3Aparcel_evw&maxFeatures=1000000&CQL_FILTER=${CQL_FILTER}&outputFormat=application%2Fjson`
      )
      .then((response) => {
        response.data.features.map((e) => {
          UpdateLoading(false);
          updateDisabled1(true);
          updateLatLon1(e.geometry.coordinates[0][0]);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        updateTableData(obj);
      });
  };

  let query = (e) => {

    updateTableVisible("")

    let value = e.target.value;
    let customLayerParameters = {};

   // props.view.map.remove(layer);

    count = 0;
    a = 0;
    b = 0;

    updateDataLoading(true);

    if (value !== SelectSubBlockData) {
      updateDataLoading(false);

      customLayerParameters.CQL_FILTER = `town='${SelectTownData}' AND block_phase_sector='${SelectBlockData}'`;

      customLayerParameters.format = "image/png";

      props.view.goTo({
        center: latLon,
        zoom: 16,
      });

      data.features.map((e) => {
        if (e.properties.block_phase_sector === value) {
          if (e.properties.category === "Residential") {
            a += e.properties.units;
          }
          if (e.properties.category === "Commercial") {
            b += e.properties.units;
          }

          count += e.properties.units;
        }
      });

      updateTableData({
        town: SelectTownData,
        block: SelectBlockData,
        subBlock: "",
        residential: a,
        commercial: b,
        total: count,
      });

      // updateSelectSubBlockData(null);
    } else {
      updateDataLoading(false);

      customLayerParameters.CQL_FILTER = `town='${SelectTownData}' AND block_phase_sector='${SelectBlockData}' AND sub_block_phase_sector='${SelectSubBlockData}'`;

      customLayerParameters.format = "image/png";

      props.view.goTo({
        center: latLon1,
        zoom: 16,
      });

      data.features.map((e) => {
        if (e.properties.sub_block_phase_sector === value) {
          if (e.properties.category === "Residential") {
            a += e.properties.units;
          }
          if (e.properties.category === "Commercial") {
            b += e.properties.units;
          }

          count += e.properties.units;
        }
      });

      updateTableData({
        town: SelectTownData,
        block: SelectBlockData,
        subBlock: SelectSubBlockData,
        residential: a,
        commercial: b,
        total: count,
      });
    }

    context.view.WMSlayer.sublayers.items[0].title= `${SelectTownData} - ${SelectBlockData} - ${SelectSubBlockData}`
    context.view.WMSlayer.customLayerParameters = customLayerParameters
 /*    loadModules(["esri/layers/WMSLayer"], { css: false }).then(([WMSLayer]) => {
      layer = new WMSLayer({
        url: `${api}/geoserver/South_PostGIS/wms`,
        title: "Parcels",
        sublayers: [
          {
            name: "parcel_evw",
            title: `${SelectTownData} - ${SelectBlockData} - ${SelectSubBlockData}`,
          },
        ],
        customLayerParameters: customLayerParameters,
      });

    }); */
    
    props.parcelLayer(context.view.WMSlayer)
  };

  return (
    <>
      <div className="mainParcelDiv" ref={parcel_filter} style={{ visibility:visibility }}>
        <div className="TownDiv">
          <label className="labelParcel">Town</label>
          <select className="parcelSelection" onChange={townFun}>
            <option>Select Town</option>
            {townData.length > 0
              ? townData[0].map((e, i) => {
                  return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                  );
                })
              : null}
          </select>
        </div>

          <br />

        <div className="BlockDiv">
          <label className="labelParcel">Block/Phase</label>
          <select className="parcelSelection" onChange={blockFun}>
            <option>Select Block</option>
            {blockData.length > 0
              ? blockData[0].map((e, i) => {
                  return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                  );
                })
              : null}
          </select>

          <button
            ref={btn}
            onClick={query}
            disabled={!disabled}
            value={SelectBlockData}
          >
            View
          </button>
        </div>

          <br />

        <div className="SubBlockDiv">
          <label className="labelParcel">Sub Block</label>
          <select className="parcelSelection" onChange={getData}>
            <option>Select Sub Block</option>
            {subBlockData.length > 0
              ? subBlockData[0].map((e, i) => {
                  return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                  );
                })
              : null}
          </select>
          <button
            ref={btn}
            onClick={query}
            disabled={!disabled1}
            value={SelectSubBlockData}
          >
            View
          </button>
        </div>

        <br/>

        {loading ? <span style={{color:'red', fontWeight:'bold'}}> Loading...</span> : null}
      </div>

      <table ref={parcel_table} 
        className="table table-striped  js-basic-example" // table table-bordered table-striped  js-basic-example
        style={{bottom:0, display:tableVisible, borderCollapse: 'collapse'}}
      > 
        <thead >
          <tr style={{border:'none'}} >
            <img src="images/cross.png" alt="" style={{cursor:'pointer'}} onClick={() =>  updateTableVisible("none")} />
          </tr>
        </thead>

        <thead style={{ backgroundColor: "#086da9", color: "white" }}>
          <tr>
            <th>Town</th>
            <th>Block</th>
            <th>Sub Block</th>
            <th>Residential HPs</th>
            <th>Commercial HPs</th>
            <th>Total HPs</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "#222222", color: "white" }}>
          <tr>
            <td>{SelectTownData}</td>
            <td>{tableData ? tableData.block : null}</td>
            <td>{tableData ? tableData.subBlock : null}</td>
            <td>{tableData ? tableData.residential : null}</td>
            <td>{tableData ? tableData.commercial : null}</td>
            <td>{tableData ? tableData.total : null}</td>
          </tr>
        </tbody>
      </table>
     
    </>
  );
}
