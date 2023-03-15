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


export default class SouthOFCStats extends React.Component {

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

      loading:true,

      sumBolean:false,
      sumAerialFeeder:0,
      sumBuriedFeeder:0,
      sumAerialDistribution:0,
      sumBuriedDistribution:0,
      sumDC:0,
      sumFAT:0

    };

    this.tableRef = React.createRef()
  }

  empty = arr => arr.length = 0;

  componentDidMount() {
    let _this = this;

    let { southDC,southFAT,southDistribution,southFeeder } = this.context.view;

    var towns = [];

    loadModules(
      ["esri/layers/GeoJSONLayer",
        "esri/smartMapping/statistics/summaryStatistics",
        "esri/geometry/geometryEngine",
      ],
      { css: false }
    ).then(([GeoJSONLayer,summaryStatistics, geometryEngine]) => {
      

      let distributionSouth = southDistribution.createQuery();
      distributionSouth.where = "1=1";

      southDistribution
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
            
            towns.push(e.attributes.town);
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

            let distributionSouthAerial = southDistribution.createQuery();
            distributionSouthAerial.where = `town in ('${e}') AND placement = 'Aerial' `;

            southDistribution
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

                
                 if(obj.data === "DHA") {

                  let total = (parseInt(AerialDist[i]) + 103.59).toFixed(2)
                  AerialDist[i] = total.toString()
                }

              });
          });

          Object.keys(counts).map((e,i) => {
            let feederSouthAerial = southFeeder.createQuery();
            feederSouthAerial.where = `town in ('${e}') AND placement = 'Aerial' `;

            southFeeder
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

            let distributionSouthBuried = southDistribution.createQuery();
            distributionSouthBuried.where = `town in ('${e}') AND placement = 'Buried' `;

            southDistribution
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
 
                if(obj.data === "DHA") {

                  let total = (parseInt(BuriedDist[i]) + 7.35).toFixed(2)
                  BuriedDist[i] = total.toString()
                } 

            
              });

          });

          Object.keys(counts).map((e,i) => {

            let obj =  {}

            obj.data = e

            let feederSouthBuried = southFeeder.createQuery();
            feederSouthBuried.where = `town in ('${e}') AND placement = 'Buried' `;

            southFeeder
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
              
                 if(obj.data === "DHA") {

                  let total = (parseInt(BuriedFeeder[i]) + 114.36).toFixed(2)
                  BuriedFeeder[i] = total.toString()

                } 
              
              });

          });

          /***************** DC and FAT *****************/

          Object.keys(counts).map((e) => {
            let southFATumm = southDC.createQuery();
            southFATumm.where = `area = '${e}'`;

            southDC.queryFeatures(southFATumm).then(function (response) {
              dc.push(response.features.length);
            });
          });


          Object.keys(counts).map((e) => {
            let southFATumm = southFAT.createQuery();
            southFATumm.where = `area = '${e}'`;

            southFAT.queryFeatures(southFATumm).then(function (response) {
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

        let feederSouthAerial = southFeeder.createQuery();
        feederSouthAerial.where = `placement = 'Aerial' `;

        southFeeder
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

        let feederSouthBuried = southFeeder.createQuery();
        feederSouthBuried.where = `placement = 'Buried' `;

        southFeeder
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
            let Total = km + 114.36
            _this.setState({
              buriedFeeder: Total.toFixed(2)
            })
           
        });

         /**************** TOTAL Length of AERIAL Distribution *********************/

         let distributionSouthAerial = southDistribution.createQuery();
         distributionSouthAerial.where = `placement = 'Aerial' `;
 
         southDistribution
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
             let Total = km + 103.59

             _this.setState({
               aerialDistribution: Total.toFixed(2)
             })
            
         });

          /**************** TOTAL Length of BURIED Distribution *********************/

          let distributionSouthBuried = southDistribution.createQuery();
          distributionSouthBuried.where = `placement = 'Buried' `;
  
          southDistribution
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
              let Total = km + 7.35
              _this.setState({
                buriedDistribution: Total.toFixed(2)
              })
             
          });

           /**************** TOTAL DC Count *********************/

           southDC.queryFeatureCount().then(function(count){
            _this.setState({
              dcCount:count
            })
          })

           /**************** TOTAL FAT Count *********************/

           southFAT.queryFeatureCount().then(function(count){
            _this.setState({
              fatCount:count
            })
          })

    });

    this.props.childProp(this.htmlToCSV)
 
  }

 /*  exportTableToExcel = () => {
    var html = document.getElementById("table");
	  this.htmlToCSV(html, "South Network Report.csv");
    
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

 
    let sumAerialFeeder = 0.00
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

    /* console.log("Aerial Feeder = ", sumAerialFeeder)
    console.log("Buried Feeder = ", sumBuriedFeeder)
    console.log("Aerial Distribution = ", sumAerialDistribution)
    console.log("Buried Distribution = ", sumBuriedDistribution)
    console.log("Dc = ", sumDC)
    console.log("FAT = ", sumFAT) */

    return (
      <ModalBody className="ModalBody" >
        <div id="southCPE">
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
                            <td className="sumAerialFeeder"  >{AerialFeeder[index]}</td>
                            <td className="sumBuriedFeeder"  >{BuriedFeeder[index]}</td>
                            <td className="sumAerialDistribution"  >{AerialDist[index]}</td>
                            <td className="sumBuriedDistribution"  >{BuriedDist[index]}</td>
                            <td className="sumDC"  >{dc[index]}</td>
                            <td className="sumFAT"  >{fat[index]}</td>
                        </tr>
                })
            }
            {/* <tr style={{backgroundColor:'#1f9b00d1', fontWeight:'bold' }}>
              <td>Total QC</td>
              <td>{this.state.aerialFeeder}</td>
              <td>{this.state.buriedFeeder}</td>
              <td>{this.state.aerialDistribution }</td>
              <td>{this.state.buriedDistribution}</td>
              <td>{this.state.dcCount}</td>
              <td>{this.state.fatCount}</td>
            </tr> */}

            <tr style={{backgroundColor:'#1f9b00d1', fontWeight:'bold' }}>
              <td>Total</td>
              <td>{sumAerialFeeder.toFixed(2)}</td>
              <td>{sumBuriedFeeder.toFixed(2)}</td>
              <td>{sumAerialDistribution.toFixed(2) }</td>
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
