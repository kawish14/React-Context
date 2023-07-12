import React from "react";
import mapContext from "../../context/mapContext";
import "./widget/css/widget.css";
import { loadModules } from "esri-loader";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Chart } from "react-google-charts";
import { NCE } from "../../url";

export default class NorthDC extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      LOSiDC: [],
      LOP_DC: [],
      DC_DetailLOP: null,
      DC_DetailLOSi: null,
      width: "0%",

      southLayerView: null,
      popupText: "",

      data: null,
      display: "none",

      highlight:null,
      download:null,
      dc_id:null,

      loading: false,
      loadingInterval:0,
      totalCPE:0,
      percent:0

    };

    this.chart = React.createRef();
  }

  
  fetchData = (olt, slot, port, ontid) => {
    return fetch(`${NCE}/${olt}/${slot}/${port}/${ontid}/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      })
      .then((power) => {
        this.setState((prevState) => ({
          loadingInterval: prevState.loadingInterval + 1,
        }));
        return power.ontrx;
      });
  };

  componentDidMount() {
    let _this = this;

    let { northCPELayer, northDC } = this.context.view;

    const wf_status = "$feature.wf_status";

    const valueExpression = `When (${wf_status} == 0 , 'Status-AsBuilt' ,${wf_status} == 1 , 'Status-Design','none')`;

    var rendererCheck = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      valueExpression: valueExpression,
      uniqueValueInfos: [
        /************************  As Built Network ***********************/
        {
          value: "Status-AsBuilt",
          symbol: {
            type: "picture-marker",
            url: "images/DC.png",
            width: "30px",
            height: "15px",
          },
        },
        /************************  Design Network ***********************/
        {
          value: "Status-Design",
          symbol: {
            type: "picture-marker",
            url: "images/dc1.png",
            width: "20px",
            height: "14px",
          },
        },
      ],
    };

    let labelClassDC = {
      symbol: {
        type: "text", // autocasts as new TextSymbol()
        color: "white",
        haloColor: "black",
        haloSize: 1,
        font: {
          // autocast as new Font()
          family: "Playfair Display",
          size: 10,
          weight: "bold",
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: `$feature.id + " - " + $feature.name`,
      },
    };

    northDC.renderer = rendererCheck;
    northDC.labelingInfo = labelClassDC;

    let relatedTable = {
      title: "CPE",
      id: "CPE-NorthDC",
      image: "images/database.png",
    };

    let download = {
      title: "Download",
      id: "download-NorthCPE",
      image: "images/download.png",
    };

    const queryParams = northCPELayer.createQuery();
    queryParams.outFields = ["objectid", "id","dc_id","splitter_id", "name", "type", "address", "downtime","uptime","area_town",
                              "sub_area","city","olt", "frame","slot","port","ontid","ontmodel","alarminfo","alarmstate",
                            "ticketstatus","tickettype","ticketopentime","ticketresolvetime"]

    let highlightSelect;

    _this.props.view.when(function () {
      _this.props.view.on("click", function (event) {
        _this.setState({
          popupText: "",
          data: null,

        });

        northDC.popupTemplate.content[1].text = _this.state.popupText;

        if (highlightSelect) {
          highlightSelect.remove();
        }

        _this.props.view.hitTest(event).then(function (response) {
          if (response.results.length) {
            response.results.map((e) => {
              if (e.graphic.layer) {
                if (e.graphic.layer.title === "North ODB/DC") {
                  if (_this.state.highlight) {
  
                    _this.state.highlight.remove();
                    
                  }
                  northDC.popupTemplate.actions = [relatedTable];

                  queryParams.where = `dc_id = ${e.graphic.attributes.id}`;
                  _this.setState({
                    dc_id:e.graphic.attributes.id,
                    loading:false,
                    loadingInterval:0
                  })

                }
              }
              return null
            });
          }
        });
      });
    });

    _this.props.view.popup.on("trigger-action", function (event) {

      if (event.action.id === "download-NorthCPE") {
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";

        const ws = XLSX.utils.json_to_sheet(_this.state.download);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, `DC - ${_this.state.dc_id}` + fileExtension);
      }

      if (event.action.id === "CPE-NorthDC") {
        let array = []

        _this.props.view
          .whenLayerView(northCPELayer)
          .then(function (layerView) {
            northCPELayer.queryFeatures(queryParams).then(function (result) {
            
              if (result.features.length === 0) {
                return null;
              } else {
                let onlinePopup = [];
                let powerOffPopup = [];
                let linkDownPopup = [];
                let gemPacketPopup = [];
                let lopPopup = [];

                _this.setState({
                  loading:true,
                  totalCPE:result.features.length
                })
                const promises = result.features.map((e) => {
                  const data = e.attributes;

                  const olt = e.attributes.olt;
                  const slot = e.attributes.slot;
                  const port = e.attributes.port;
                  const ontid = e.attributes.ontid;
                
                  return _this.fetchData(olt, slot, port, ontid)
                    .then((ontrxData) => {
                      data.ontrx = ontrxData;

                      return data;
                    })
                    .catch((err) => {
                      console.log(err);
                      return data;
                    });
                });
                
                Promise.all(promises)
                  .then((dataArray) => {
                    
                    dataArray.forEach((data) => {
                      array.push(data);

                      _this.setState({
                        download: array,
                        loading:false,
                        loadingInterval:0
                      });

                      northDC.popupTemplate.actions = [download];
                    });


                  })
                  .catch((err) => {
                    console.log(err);
                  });


                result.features.map((e, i) => {

                  if (e.attributes.alarmstate === 0) {
                    onlinePopup.push(e.attributes);
                  }
                  if (e.attributes.alarmstate === 1) {
                    powerOffPopup.push(e.attributes);
                  }
                  if (e.attributes.alarmstate === 2) {
                    linkDownPopup.push(e.attributes);
                  }
                  if (e.attributes.alarmstate === 3) {
                    gemPacketPopup.push(e.attributes);
                  }
                  if (e.attributes.alarmstate === 4) {
                    lopPopup.push(e.attributes);
                  }

                  return null
                });

                /************************ Chart Data ***************************/

                let data = [
                  ["Alarm", "Count"],
                  ["Online", onlinePopup.length],
                  ["Power Off", powerOffPopup.length],
                  ["Link Down", linkDownPopup.length],
                  ["GEM Packet Loss", gemPacketPopup.length],
                  ["Low Optical Power", lopPopup.length],
                ];

                _this.setState({
                  data: data,
                  popupText: `Total active customer of selected DC/ODB are:  <strong style="color:red">${result.features.length}</strong>`,
                });

                /*********************** CUSTOM CONTENT OF CHART TO ADD IN POPUP *********************/

                loadModules(["esri/popup/content/CustomContent"], {
                  css: false,
                }).then(([CustomContent]) => {

                  const contentWidget = new CustomContent({
                    outFields: ["*"],
                    creator: function () {
                      return _this.chart.current;
                    },
                  });

                  let popupTemplate = {
                    title: "ODB/DC",
                    content: [
                      {
                        type: "fields",
                        fieldInfos: [
                          {
                            fieldName: "name",
                            visible: true,
                            label: "Name",
                            format: {
                              digitSeparator: true,
                              places: 0,
                            },
                          },
                          {
                            fieldName: "id",
                            visible: true,
                            label: "ID",
                            format: {
                              digitSeparator: false,
                              places: 0,
                            },
                          },
                          {
                            fieldName: "pop_id",
                            visible: true,
                            label: "POP ID",
                            format: {
                              digitSeparator: false,
                              places: 0,
                            },
                          },
                          {
                            fieldName: "placement",
                            visible: true,
                            label: "Placement",
                          },
                          {
                            fieldName: "plot",
                            visible: true,
                            label: "Plot",
                          },
                          {
                            fieldName: "area",
                            visible: true,
                            label: "Area",
                          },
                          {
                            fieldName: "block_phase_sector",
                            visible: true,
                            label: "Sub Area",
                          },
                          {
                            fieldName: "city",
                            visible: true,
                            label: "City",
                          },
                          {
                            fieldName: "capacity",
                            visible: true,
                            label: "Capacity",
                          },
                          {
                            fieldName: "splitter_count",
                            visible: true,
                            label: "Splitter Count",
                          },
                        ],
                      },
                      {
                        type: "text",
                        text: _this.state.popupText,
                      },
                      contentWidget,
                    ],
                  };
  
                  northDC.popupTemplate = popupTemplate;
  
                })
               
                /*************** Apply CSS after passing data into state mentioned above *****************/

                if (_this.state.highlight) {
                  _this.state.highlight.remove();
                }

                _this.setState({
                  display: "block",
                  highlight : layerView.highlight(result.features)
                })
               
              }

            });
          });
      }
    });

    loadModules(["esri/core/watchUtils"], {
      css: false,
    }).then(([watchUtils]) => {
      watchUtils.whenTrue(_this.props.view.popup, "visible", function () {
        watchUtils.whenFalseOnce(_this.props.view.popup, "visible", function () {
          if (_this.state.highlight) {
  
            _this.state.highlight.remove();
            
          }
        });
      });
    })

  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.loadingInterval !== this.state.loadingInterval){
      let percent = this.state.loadingInterval*100/this.state.totalCPE

      this.setState({
        percent:parseInt(percent.toFixed(0))
      })
   
    }
  }

  render() {
    const options = {
      //title: "Alarm Status",
      is3D: true,
      backgroundColor: "#242424",
      colors: ["#09e909", "#0909a5", "#ab0606", "#3a3939", "#c1c10a"],
      chartArea: {
        width: 800,
        height: 800,
      },
      legend: {
        position: "right",
        textStyle: { color: "#1f91f3", fontSize: 10 },
      },
      tooltip: {
        trigger: "selection",
      },
    };
    return (

        <div ref={this.chart} style={{ display: this.state.display }}>
         <div style={{color:'red', fontWeight:'bold', fontSize:"0.77em"}}>{this.state.loading ? <span>{this.state.percent}% ONTRx Loading....</span> : null } </div>
          {this.state.data !== null ? (
            <Chart
              chartType="PieChart"
              data={this.state.data}
              options={options}
              width={"100%"}
              height={"20vh"}
            />
          ) : null}
        </div>
      
    );
  }
}


