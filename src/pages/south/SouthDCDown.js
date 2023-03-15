import React from "react";
import mapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import ODBDown from "../../components/DCDown";
import socketIOClient from "socket.io-client";
import ringer from "../../sound/industry-alarm-tone.mp3";
import "./widget/css/widget.css";
import {ENDPOINT} from '../../url'

import {version} from '../../url'
setDefaultOptions({ version: version })

const audio = new Audio(ringer);

// const ENDPOINT = "http://gis.tes.com.pk:5001";
//const ENDPOINT = "http://localhost:5002"

const socket = socketIOClient(ENDPOINT);

let counts = {
  totalCPE: {},
  losCPE: {},
  lopCPE: {},
  losDCDetails: {},
};

let num = 0;
let lopNum = 0

export default class SouthDCDown extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      LOSiDC: [],
      LOP_DC: [],
      DC_DetailLOP: null,
      DC_DetailLOSi: null,
      SeventyPercent: 70,
      width: "0%",
      receivePercent: null,

      manuallyPause: false,

      playButtonClass: "btn",
      playButtonState: "stop",
      playButtonIconClass: "fa fa-pause",

      LOSiOBJECTID: {},
      LOPOBJECTID: {},

      losCount:null

    };

    this.buttons = React.createRef();
  }

  empty = (arr) => (arr.length = 0);

  socketFunction = () => {
    let { loginRole, southDC,southCPELayer } = this.context.view;
    let _this = this

    socket.on("endpoint", async (data) => {
      if (loginRole.role === "SouthDEVuser" || loginRole.role === "Admin") {

        let d = data.olt;

        if (d.indexOf("KHI") === 0) {

          if (data.alarmstate == 2 || data.alarmstate == 4) {
            for (const key in counts.losCPE) {
              delete counts.losCPE[key];
            }
            for (const key in counts.lopCPE) {
              delete counts.lopCPE[key];
            }
            for (const key in counts.totalCPE) {
              delete counts.totalCPE[key];
            }

            _this.initialFunction();
          }
          else if (data.alarmstate == 0 || data.alarmstate == 1){

            const queryParams = southCPELayer.createQuery();
            southCPELayer.queryFeatures(queryParams).then(function (results) {
              results.features.map((res, i) => {
                if (res.attributes.alarmstate === 2) {
                  //console.log(results.features.length)
                  _this.setState({
                    losCount:results.features.length
                  })
                }
              })
            })

          }

        }
      }
    });
  };

  componentDidMount() {
    this.socketFunction();
    this.initialFunction();
  }

  initialFunction() {
    let { southCPELayer, southDC } = this.context.view;

    let _this = this;
    let view = this.props.view;

    let totalCustomers = [];
    let losCount = [];
    let lopCount = [];

    _this.empty(_this.state.LOSiDC);
    _this.empty(_this.state.LOP_DC);

    _this.empty(totalCustomers);
    _this.empty(losCount);

    const queryParamsDC = southDC.createQuery();
    const queryParamsDC_LOP = southDC.createQuery();

    const queryParams = southCPELayer.createQuery();
    queryParams.where = "status = 'Active'";
    
    southCPELayer.queryFeatures(queryParams).then(function (results) {
      results.features.map((res, i) => {
        totalCustomers.push(res.attributes.dc_id);

        if (res.attributes.alarmstate === 2) {
          losCount.push(res.attributes.dc_id);
        }
        if (res.attributes.alarmstate === 4) {
          lopCount.push(res.attributes.dc_id);
        }
      });

      for (let i = 0; i < totalCustomers.length; i++) {
        if (counts.totalCPE[totalCustomers[i]]) {
          counts.totalCPE[totalCustomers[i]] += 1;
        } else {
          counts.totalCPE[totalCustomers[i]] = 1;
        }
      }

      for (let i = 0; i < losCount.length; i++) {
        if (counts.losCPE[losCount[i]]) {
          counts.losCPE[losCount[i]] += 1;
        } else {
          counts.losCPE[losCount[i]] = 1;
        }
      }
      for (let i = 0; i < lopCount.length; i++) {
        if (counts.lopCPE[lopCount[i]]) {
          counts.lopCPE[lopCount[i]] += 1;
        } else {
          counts.lopCPE[lopCount[i]] = 1;
        }
      }

      /**************************** LOSi **************************************/

      Object.keys(counts.losCPE).map((losItem, i) => {
        // console.log("LOSi Count ",losItem,counts.losCPE[losItem], "Total CPE", losItem,counts.totalCPE[losItem])

        let a = parseInt(counts.losCPE[losItem] * 100);
        let percentage = parseFloat(a / counts.totalCPE[losItem]);

        switch (true) {
          case percentage >= _this.state.SeventyPercent:
            
            _this.state.LOSiDC.push(losItem);

            _this.setState({
              LOSiDC: _this.state.LOSiDC,
              /*  isChecked: true,
              width: "23%",  */
              receivePercent: percentage.toFixed(0),
            });
        
            break;

          default:
        }
      });


      queryParamsDC.where = `id in (${_this.state.LOSiDC})`;

      southDC.queryFeatures(queryParamsDC).then(function (result) {

        _this.setState({
          DC_DetailLOSi: result.features,
        });

      });

      /***************************** LOP ***********************************/

      Object.keys(counts.lopCPE).map((lopItem, i) => {
        // console.log("LOP Count ",lopItem,counts.lopCPE[lopItem], "Total CPE", lopItem,counts.totalCPE[lopItem])

        let a = parseInt(counts.lopCPE[lopItem] * 100);
        let percentage = parseFloat(a / counts.totalCPE[lopItem]);
       
        switch (true) {
          
          case percentage >= _this.state.SeventyPercent:
            _this.state.LOP_DC.push(lopItem);

            _this.setState({
              LOP_DC: _this.state.LOP_DC,
              /*  isChecked: true,
              width: "23%",  */
              receivePercent: percentage.toFixed(0),
            });

            break;

          default:
        }
        
      });

      queryParamsDC_LOP.where = `id in (${_this.state.LOP_DC})`;

      southDC.queryFeatures(queryParamsDC_LOP).then(function (result) {
        _this.setState({
          DC_DetailLOP: result.features,
        });

      });
    });
    
  }

  locationGo = (e) => {
    let _this = this;
    let { southDC } = this.context.view;

    const queryParamsDC = southDC.createQuery();

    queryParamsDC.where = `id in (${e.target.title})`;

    southDC.queryFeatures(queryParamsDC).then(function (result) {
      _this.props.view.goTo({
        center: [
          result.features[0].geometry.longitude,
          result.features[0].geometry.latitude,
        ],
        zoom: 17,
      });
    });
  };

  LOSiUpdate = (prevState) => {
    let { southDC, graphicLayerLOSiDC,graphicLayer } = this.context.view;

    let _this = this

    if (num === 0) {
      if (this.state.DC_DetailLOSi) {
        if (this.state.DC_DetailLOSi.length !== 0) {
          this.state.DC_DetailLOSi.map((e,index) => {

            loadModules(["esri/Graphic","esri/layers/GraphicsLayer","esri/geometry/Point",],
            { css: false }).then(async ([Graphic, GraphicsLayer, Point]) => {
              let point = {
                type: "point",
                longitude: e.geometry.longitude,
                latitude: e.geometry.latitude,
              };
  
              let markerSymbol = {
                type: "picture-marker",
                url: "images/down-arrow-red.gif",
                width: "35px",
                height: "40px",
                xoffset: 0,
                yoffset: 12,
              };
  
              let attr = {
                name:e.attributes.name,
                id:e.attributes.id,
                pop:e.attributes.pop_id
              }
              
              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes:attr
              });
  
              graphicLayerLOSiDC.graphics.add(pointGraphic);
            })
         

          });

          audio.loop = true;
          audio.play();

          _this.setState({
            playButtonState: "stop",
            playButtonIconClass: "fa fa-pause",
            isChecked: true,
            width: "20vw",
          });
        }
      }
    } else if (prevState.DC_DetailLOSi) {
      if (prevState.DC_DetailLOSi.length !== this.state.DC_DetailLOSi.length) {
        if (
          this.state.DC_DetailLOSi.length === 0 &&
          this.state.DC_DetailLOP.length === 0
        ) {
          audio.loop = false;

          graphicLayerLOSiDC.graphics.removeAll();

          this.setState({
            playButtonState: "play",
            playButtonIconClass: "fa fa-play",
            isChecked: false,
            width: "0%",
          });
        } else if (
          this.state.DC_DetailLOSi.length === 0 &&
          this.state.DC_DetailLOP.length !== 0
        ) {
          graphicLayerLOSiDC.graphics.removeAll();
        } else if (this.state.DC_DetailLOSi.length !== 0) {
          graphicLayerLOSiDC.graphics.removeAll();

          if(prevState.DC_DetailLOSi.length <= this.state.DC_DetailLOSi.length){
            audio.loop = true;
            audio.play(); 
  
            this.setState({
              playButtonState: "stop",
              playButtonIconClass: "fa fa-pause",
              isChecked: true,
              width: "20vw",
            }); 
          }

          this.state.DC_DetailLOSi.map((e) => {

            loadModules(["esri/Graphic","esri/layers/GraphicsLayer","esri/geometry/Point",],
            { css: false }).then(async ([Graphic, GraphicsLayer, Point]) => {
              let point = {
                type: "point",
                longitude: e.geometry.longitude,
                latitude: e.geometry.latitude,
              };
  
              let markerSymbol = {
                type: "picture-marker",
                url: "images/down-arrow-red.gif",
                width: "35px",
                height: "40px",
                xoffset: 0,
                yoffset: 12,
              };
  
              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
              });
  
              graphicLayerLOSiDC.graphics.add(pointGraphic);
            })
            
          });

          if (!this.state.manuallyPause ) {

            audio.loop = true;
            audio.play();

            this.setState({
              playButtonState: "stop",
              playButtonIconClass: "fa fa-pause",
              isChecked: true,
              width: "20vw",
            });
          }
        }
      }
    }

    num = 1;
  };

  LOPUpdate = (prevState) => {
    let { southDC, graphicLayerLOPDC } = this.context.view;

    if (lopNum === 0) {
      if (this.state.DC_DetailLOP) {
        if (this.state.DC_DetailLOP.length !== 0) {
          this.state.DC_DetailLOP.map((e) => {

            loadModules(["esri/Graphic","esri/layers/GraphicsLayer","esri/geometry/Point",],
            { css: false }).then(async ([Graphic, GraphicsLayer, Point]) => {
              let point = {
                type: "point",
                longitude: e.geometry.longitude,
                latitude: e.geometry.latitude,
              };
  
              let markerSymbol = {
                type: "picture-marker",
                url: "images/down-arrow-yellow.gif",
                width: "35px",
                height: "40px",
                xoffset: 0,
                yoffset: 12,
              };
  
              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
              });
  
              graphicLayerLOPDC.graphics.add(pointGraphic);
            })
            
          });

          audio.loop = true;
          audio.play();

          this.setState({
            playButtonState: "stop",
            playButtonIconClass: "fa fa-pause",
            isChecked: true,
            width: "20vw",
          });
        }
      }
    } else if (prevState.DC_DetailLOP) {
      if (prevState.DC_DetailLOP.length !== this.state.DC_DetailLOP.length) {
        if (
          this.state.DC_DetailLOP.length === 0 &&
          this.state.DC_DetailLOSi.length === 0
        ) {
          graphicLayerLOPDC.graphics.removeAll();

          audio.loop = false;

          this.setState({
            playButtonState: "play",
            playButtonIconClass: "fa fa-play",
            isChecked: false,
            width: "0%",
          });
        } else if (
          this.state.DC_DetailLOP.length === 0 &&
          this.state.DC_DetailLOSi !== 0
        ) {
          graphicLayerLOPDC.graphics.removeAll();
        } else if (this.state.DC_DetailLOP.length !== 0) {
          graphicLayerLOPDC.graphics.removeAll();

          this.state.DC_DetailLOP.map((e) => {

            loadModules(["esri/Graphic","esri/layers/GraphicsLayer","esri/geometry/Point",],
            { css: false }).then(async ([Graphic, GraphicsLayer, Point]) => {
              let point = {
                type: "point",
                longitude: e.geometry.longitude,
                latitude: e.geometry.latitude,
              };
  
              let markerSymbol = {
                type: "picture-marker",
                url: "images/down-arrow-yellow.gif",
                width: "35px",
                height: "40px",
                xoffset: 0,
                yoffset: 12,
              };
  
              let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
              });
  
              graphicLayerLOPDC.graphics.add(pointGraphic);
            })
           
          });

          if (!this.state.manuallyPause) {
      

            audio.loop = true;
            audio.play();

            this.setState({
              playButtonState: "stop",
              playButtonIconClass: "fa fa-pause",
              isChecked: true,
              width: "20vw",
            });
          }
        }
      }
    }

    lopNum = 1;
  };

  componentDidUpdate(prevProps, prevState) {
    let { southDC, graphicLayerLOSiDC,graphicLayer } = this.context.view;

    if (prevState.DC_DetailLOSi !== this.state.DC_DetailLOSi) {
      this.LOSiUpdate(prevState);
    }

    if (prevState.DC_DetailLOP !== this.state.DC_DetailLOP) {
      this.LOPUpdate(prevState);
    }
    
     if(prevState.losCount !== this.state.losCount){
      this.initialFunction();
 
    } 

  }

  componentWillUnmount() {
    audio.loop = false;

    socket.disconnect();
  }

  buttonPlayPress = () => {
    if (
      /* this.state.DC_DetailLOSi.length !== 0 && this.state.DC_DetailLOP.length !== 0 && */
      this.state.playButtonState === "stop"
    ) {
      this.setState({
        playButtonState: "play",
        //  playButtonClass:"btn-success",
        playButtonIconClass: "fa fa-play",
        manuallyPause: true,
      });

      audio.loop = false;
    }
  };

  render() {
    return (
      <>
        {this.state.isChecked ? (
          <ODBDown
            DC_DetailLOSi={this.state.DC_DetailLOSi}
            DC_DetailLOP={this.state.DC_DetailLOP}
            width={this.state.width}
            buttonPlayPress={this.buttonPlayPress}
            playButtonIconClass={this.state.playButtonIconClass}
            locationGo={this.locationGo}
           // vehicle={this.state.vehicleRadius}
            view={this.props.view}
          />
        ) : null}

         {/* <button onClick={() => {
          this.setState({SeventyPercent:70}) 
          }}>70%</button>
          <button onClick={() =>{
          this.setState({SeventyPercent:30})
          }}>30%</button>  */}
      </>
    );
  }
}
