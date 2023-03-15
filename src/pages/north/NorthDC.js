import React from "react";
import mapContext from "../../context/mapContext";
import "./widget/css/widget.css";
import { loadModules, setDefaultOptions } from "esri-loader";
import { Chart } from "react-google-charts";

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
      SeventyPercent: 70,
      width: "0%",
      receivePercent: null,

      southLayerView: null,
      popupText: "",
      locationGo: null,
      manuallyPause: false,

      playButtonClass: "btn",
      playButtonState: "stop",
      playButtonIconClass: "fa fa-pause",

      data: null,
      display: "none",

      LOSiOBJECTID: {},
      LOPOBJECTID: {},
    };

    this.chart = React.createRef();
  }

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
            width: "24px",
            height: "17px",
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
      id: "CPE-DCNorth",
      image: "images/database.png",
    };

    const queryParams = northCPELayer.createQuery();

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
                 // northDC.popupTemplate.actions = [relatedTable];

                  queryParams.where = `dc_id = ${e.graphic.attributes.id}`;
                  
                }
              }
            });
          }
        });
      });
    });



    _this.props.view.popup.on("trigger-action", function (event) {
      if (event.action.id === "CPE-DCNorth") {
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
                    console.log(e.attributes, result.features.length);
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
                            fieldName: "sub_area",
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
                            fieldName: "splitter_type",
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
  
                  northDC.popupTemplate = popupTemplate;

                })
              

                /*************** Apply CSS after passing data into state mentioned above *****************/

                _this.setState({
                  display: "block",
                });

                if (highlightSelect) {
                  highlightSelect.remove();
                }

                highlightSelect = layerView.highlight(result.features);
              }
            });
          });
      }
    });
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
