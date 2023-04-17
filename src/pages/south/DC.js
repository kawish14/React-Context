import React from "react";
import mapContext from "../../context/mapContext";
import "./widget/css/widget.css";
import { loadModules, setDefaultOptions } from "esri-loader";

import { Chart } from "react-google-charts";

export default class DC extends React.Component {
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

      highlight:null

    };

    this.chart = React.createRef();
  }


  componentDidMount() {
    let _this = this;

    let { southCPELayer, southDC } = this.context.view;

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

    southDC.renderer = rendererCheck;
    southDC.labelingInfo = labelClassDC;

    let relatedTable = {
      title: "CPE",
      id: "CPE-DC",
      image: "images/database.png",
    };

    const queryParams = southCPELayer.createQuery();

    let highlightSelect;

    _this.props.view.when(function () {
      _this.props.view.on("click", function (event) {
        _this.setState({
          popupText: "",
          data: null,

        });

        southDC.popupTemplate.content[1].text = _this.state.popupText;

        if (highlightSelect) {
          highlightSelect.remove();
        }

        _this.props.view.hitTest(event).then(function (response) {
          if (response.results.length) {
            response.results.map((e) => {
              if (e.graphic.layer) {
                if (e.graphic.layer.title === "South ODB/DC") {
                //  southDC.popupTemplate.actions = [relatedTable];

                  queryParams.where = `dc_id = ${e.graphic.attributes.id}`;
                }
              }
            });
          }
        });
      });
    });

    _this.props.view.popup.on("trigger-action", function (event) {
      if (event.action.id === "CPE-DC") {
        _this.props.view
          .whenLayerView(southCPELayer)
          .then(function (layerView) {
            southCPELayer.queryFeatures(queryParams).then(function (result) {
            
              if (result.features.length === 0) {
                return null;
              } else {
                let onlinePopup = [];
                let powerOffPopup = [];
                let linkDownPopup = [];
                let gemPacketPopup = [];
                let lopPopup = [];

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
                    console.log(e.attributes,result.features.length)
                  }
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
                            fieldName: "Splitter_Type",
                            visible: true,
                            label: "Splitter",
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
  
                  southDC.popupTemplate = popupTemplate;
  

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

{
  /*   <Pie
          data={this.state.data}
          options={{
            title:{
              display:true,
              text:'Alarm Status',
              fontSize:15,
              fontColor:'rgb(31, 145, 243)',
            },
            legend:{
              display:true,
              position:'right',
              align:'center',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                pointStyleWidth:2,
                padding:12,
                fontColor:'rgb(31, 145, 243)',
                fontSize:10,
                pointSize:8,
              }
            }
          }}
        /> */
}
