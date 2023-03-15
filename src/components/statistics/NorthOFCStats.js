import React, { useState, useEffect, useRef } from "react";
import MapContext from "../../context/mapContext";
import {ModalBody} from "reactstrap";

import { loadModules, setDefaultOptions } from "esri-loader";
import "../admin/widget/css/widget.css";
import "./stats.css";

import {version} from '../../url'
setDefaultOptions({ version: version })

let counts = {};
let report = [];

let AerialFeeder = [];
let BuriedFeeder = [];

let AerialDist = [];
let BuriedDist = [];

let dc = [];
let fat = []

export default class NorthOFCStats extends React.Component {

  static contextType = MapContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "None",
      aerialFeeder: null,
      buriedFeeder: null,
      aerialDistribution: null,
      buriedDistribution: null,
      dcCount: null,
      fatCount: null,
      dataLength:null
    };

    this.tableRef = React.createRef()
  }

  empty = arr => arr.length = 0;

  componentDidMount() {
    let _this = this;

    let { northDC,northFAT,northDistribution,northFeeder } = this.context.view;

    var towns = [];

    loadModules(
      [
        "esri/smartMapping/statistics/summaryStatistics",
        "esri/geometry/geometryEngine",
      ],
      { css: false }
    ).then(([summaryStatistics, geometryEngine]) => {
      

      let distributionSouth = northDistribution.createQuery();
      distributionSouth.where = "1=1";

      northDistribution
        .queryFeatures(distributionSouth)
        .then(function (response) {

          _this.empty(report)
          _this.empty(AerialFeeder)
          _this.empty(BuriedFeeder)
          _this.empty(AerialDist)
          _this.empty(BuriedDist)
          _this.empty(dc)
          _this.empty(fat)

          report.push(
            [
            "Area/Town",
            "Aerial Feeder",
            "Buried Feeder",
            "Aerial Distribution",
            "Buried Distribution",
            "DC/ODB",
            "FAT",
          ]
          )
          
          response.features.map((e, i) => {
            
            towns.push(e.attributes.area);
          });

          for (let i = 0; i < towns.length; i++) {
            if (counts[towns[i]]) {
              counts[towns[i]] += 1;
            } else {
              counts[towns[i]] = 1;
            }
          }

          report.push(Object.keys(counts));
    

          /*********************** AERIAL FEEDER AND DISTRIBUTION ************************/

          Object.keys(counts).map((e,i) => {
            let obj ={}

            obj.data = e

            let distributionSouthAerial = northDistribution.createQuery();
            distributionSouthAerial.where = `area in ('${e}') AND placement = 'Aerial' `;

            northDistribution
              .queryFeatures(distributionSouthAerial)
              .then(function (response) {
                var polylineLength = [];
                let sum = 0;

                response.features.map((e, i) => {
                  polylineLength.push(
                    geometryEngine.geodesicLength(e.geometry, "meters")
                  );
                });

                for (var index = 0; index < polylineLength.length; index++) {
                  sum += polylineLength[index];
                }
                let km = (sum * 1.2) / 1000;
                AerialDist.push(km.toFixed(2));

                
                // if(obj.data === "DHA") {

                //   let total = (parseInt(AerialDist[i]) + 103.59).toFixed(2)
                //   AerialDist[i] = total.toString()
                // }

              });
          });

          Object.keys(counts).map((e,i) => {
            let feederSouthAerial = northFeeder.createQuery();
            feederSouthAerial.where = `area in ('${e}') AND placement = 'Aerial' `;

            northFeeder
              .queryFeatures(feederSouthAerial)
              .then(function (response) {
                var polylineLength = [];
                let sum = 0;

                response.features.map((e, i) => {
                  polylineLength.push(
                    geometryEngine.geodesicLength(e.geometry, "meters")
                  );
                });

                for (var index = 0; index < polylineLength.length; index++) {
                  sum += polylineLength[index];
                }

                let km = (sum * 1.2) / 1000;
                AerialFeeder.push(km.toFixed(2));
              });
          });

          /*********************** BURIED FEEDER AND DISTRIBUTION ************************/

          Object.keys(counts).map((e,i) => {

            let obj =  {}

            obj.data = e

            let distributionSouthBuried = northDistribution.createQuery();
            distributionSouthBuried.where = `area in ('${e}') AND placement = 'Buried' `;

            northDistribution
              .queryFeatures(distributionSouthBuried)
              .then(function (response) {
                var polylineLength = [];
                let sum = 0;
              
                response.features.map((e, i) => {

                  polylineLength.push(
                    geometryEngine.geodesicLength(e.geometry, "meters")
                  );

                });

                for (var index = 0; index < polylineLength.length; index++) {

                  sum += polylineLength[index];
                }
               
                let km = (sum * 1.2) / 1000;
                BuriedDist.push(km.toFixed(2));
/* 
                if(obj.data === "DHA") {

                  let total = (parseInt(BuriedDist[i]) + 7.35).toFixed(2)
                  BuriedDist[i] = total.toString()
                } */

            
              });

          });

          Object.keys(counts).map((e,i) => {

            let obj =  {}

            obj.data = e

            let feederSouthBuried = northFeeder.createQuery();
            feederSouthBuried.where = `area in ('${e}') AND placement = 'Buried' `;

            northFeeder
              .queryFeatures(feederSouthBuried)
              .then(function (response) {
                var polylineLength = [];
                let sum = 0;

                response.features.map((e, i) => {

                  polylineLength.push(
                    geometryEngine.geodesicLength(e.geometry, "meters")
                  );
                });

                for (var index = 0; index < polylineLength.length; index++) {
                  sum += polylineLength[index];
                }

                let km = (sum * 1.2) / 1000;
                BuriedFeeder.push(km.toFixed(2));
                
              /*   if(obj.data === "DHA") {

                  let total = (parseInt(BuriedFeeder[i]) + 114.36).toFixed(2)
                  BuriedFeeder[i] = total.toString()

                } */
              
              });

          });

          /***************** DC and FAT *****************/

          Object.keys(counts).map((e) => {
            let southFATumm = northDC.createQuery();
            southFATumm.where = `area = '${e}'`;

            northDC.queryFeatures(southFATumm).then(function (response) {
              dc.push(response.features.length);
            });
          });

           Object.keys(counts).map((e) => {
            let southFATumm = northFAT.createQuery();
            southFATumm.where = `area = '${e}'`;

            northFAT.queryFeatures(southFATumm).then(function (response) {
              fat.push(response.features.length);
            });
          });

          report.push(AerialFeeder);
          report.push(BuriedFeeder);
          
          report.push(AerialDist);
          report.push(BuriedDist);

          report.push(fat)


        });

        /**************** TOTAL Length of AERIAL Feeder *********************/

        let feederSouthAerial = northFeeder.createQuery();
        feederSouthAerial.where = `placement = 'Aerial' `;

        northFeeder
          .queryFeatures(feederSouthAerial)
          .then(function (response) {
            var polylineLength = [];
            let sum = 0;

            response.features.map((e, i) => {
              polylineLength.push(
                geometryEngine.geodesicLength(e.geometry, "meters")
              );
            });

            for (var index = 0; index < polylineLength.length; index++) {
              sum += polylineLength[index];
            }

            let km = (sum * 1.2) / 1000;
            _this.setState({
              aerialFeeder: km.toFixed(2)
            })
           
        });


        /**************** TOTAL Length of BURIED Feeder *********************/

        let feederSouthBuried = northFeeder.createQuery();
        feederSouthBuried.where = `placement = 'Buried' `;

        northFeeder
          .queryFeatures(feederSouthBuried)
          .then(function (response) {
            var polylineLength = [];
            let sum = 0;

            response.features.map((e, i) => {
              polylineLength.push(
                geometryEngine.geodesicLength(e.geometry, "meters")
              );
            });

            for (var index = 0; index < polylineLength.length; index++) {
              sum += polylineLength[index];
            }

            let km = (sum * 1.2) / 1000;
            _this.setState({
              buriedFeeder:km.toFixed(2)
            })
           
        });

         /**************** TOTAL Length of AERIAL Distribution *********************/

         let distributionSouthAerial = northDistribution.createQuery();
         distributionSouthAerial.where = `placement = 'Aerial' `;
 
         northDistribution
           .queryFeatures(distributionSouthAerial)
           .then(function (response) {
             var polylineLength = [];
             let sum = 0;
 
             response.features.map((e, i) => {
               polylineLength.push(
                 geometryEngine.geodesicLength(e.geometry, "meters")
               );
             });
 
             for (var index = 0; index < polylineLength.length; index++) {
               sum += polylineLength[index];
             }
 
             let km = (sum * 1.2) / 1000;
             _this.setState({
               aerialDistribution: km.toFixed(2)
             })
            
         });

          /**************** TOTAL Length of BURIED Distribution *********************/

          let distributionSouthBuried = northDistribution.createQuery();
          distributionSouthBuried.where = `placement = 'Buried' `;
  
          northDistribution
            .queryFeatures(distributionSouthBuried)
            .then(function (response) {
              var polylineLength = [];
              let sum = 0;
  
              response.features.map((e, i) => {
                polylineLength.push(
                  geometryEngine.geodesicLength(e.geometry, "meters")
                );
              });
  
              for (var index = 0; index < polylineLength.length; index++) {
                sum += polylineLength[index];
              }
  
              let km = (sum * 1.2) / 1000;
              _this.setState({
                buriedDistribution: km.toFixed(2)
              })
             
          });


          /**************** TOTAL DC Count *********************/

          northDC.queryFeatureCount().then(function(count){
            _this.setState({
              dcCount:count
            })
          })


           /**************** TOTAL FAT Count *********************/

           northFAT.queryFeatureCount().then(function(count){
            _this.setState({
              fatCount:count
            })
          })

    });

    this.props.childProp(this.htmlToCSV)
  }

 /*  exportTableToExcel = () => {
    var html = document.getElementById("table");
	  this.htmlToCSV(html, "Central Network Report.csv");
  } */

  htmlToCSV = (html, filename) => {
    
    var data = [];
        
    for (var i = 0; i < html.rows.length; i++) {
      var row = [], cols = html.rows[i].querySelectorAll("td, th");
          
      for (var j = 0; j < cols.length; j++) {
              row.push(cols[j].innerText);
          }
              
      data.push(row.join(",")); 		
    }
  
    this.downloadCSVFile(data.join("\n"), filename);
  }

  downloadCSVFile = (csv, filename) => {
    var csv_file, download_link;
  
    csv_file = new Blob([csv], {type: "text/csv"});
  
    download_link = document.createElement("a");
  
    download_link.download = filename;
  
    download_link.href = window.URL.createObjectURL(csv_file);
  
    download_link.style.display = "none";
  
    document.body.appendChild(download_link);
  
    download_link.click();
  }
  
  render() {
  
    let sumAerialFeeder = 0
    let sumBuriedFeeder = 0 
    let sumAerialDistribution = 0
    let sumBuriedDistribution = 0
    let sumDC = 0
    let sumFAT = 0

    for (var i = 0; i < Object.keys(counts).length; i++) {
      sumAerialFeeder += parseFloat(AerialFeeder[i])
      sumBuriedFeeder += parseFloat(BuriedFeeder[i])

      sumAerialDistribution += parseFloat(AerialDist[i])
      sumBuriedDistribution += parseFloat(BuriedDist[i])

      sumDC += parseInt(dc[i])
      sumFAT += parseInt(fat[i])
    }

    return (
      <ModalBody className="ModalBody" >
      <div id="centerCPE">
      <table id="table" ref={this.tableRef}
        className="graphicTable"
        >
          <thead className="thead">
            <tr>
              <th>Area/Town</th>
              <th>Aerial Feeder</th>
              <th>Buried Feeder</th>
              <th>Aerial Distribution</th>
              <th>Buried Distribution</th>
              <th>DC/ODB</th>
              <th>FAT</th>
            </tr>
          </thead>

          <tbody className="tbody">
            {
                Object.keys(counts).map((item, index) => {
                    
                  return  <tr key = {index}>
                            <td >{item}</td>
                            <td >{AerialFeeder[index]}</td>
                            <td >{BuriedFeeder[index]}</td>
                            <td >{AerialDist[index]}</td>
                            <td >{BuriedDist[index]}</td>
                            <td >{dc[index]}</td>
                            <td >{fat[index]}</td>
                        </tr>
                })
            }
            <tr style={{backgroundColor:'#1f9b00d1', fontWeight:'bold' }}>
              <td>Total</td>
              <td>{sumAerialFeeder.toFixed(2)}</td>
              <td>{sumBuriedFeeder.toFixed(2)}</td>
              <td>{sumAerialDistribution.toFixed(2)}</td>
              <td>{sumBuriedDistribution.toFixed(2)}</td>
              <td>{sumDC}</td>
              <td>{sumFAT}</td>
            </tr>

          </tbody>
        </table>
      </div>
      
      
      </ModalBody>
    );
  }
}
