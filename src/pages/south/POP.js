import React from "react";
import mapContext from "../../context/mapContext";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default class POP extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.state = {
      relatedCPE: [],
      popID: null,
      popName: null,
    };
  }

  empty = (arr) => (arr.length = 0);

  componentDidMount() {
    let { view, updatePopURL } = this.context;

    let southPOP = view.southPOP;
    let southCPELayer = view.southCPELayer;

    let _this = this;

    let labelClassZone = {
      symbol: {
        type: "text",
        color: "white",
        haloColor: "black",
        haloSize: 1,
        font: {
          family: "Playfair Display",
          size: 10,
          weight: "bold",
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: `$feature.name + " - " + $feature.id`,
      },
    };

    var symbol = {
      type: "picture-marker",
      url: "images/pins/default.png",
      width: "20px",
      height: "20px",
    };

    const POPrender = {
      type: "simple",
      symbol: symbol,
    };

    southPOP.renderer = POPrender;
    southPOP.labelingInfo = labelClassZone;

    let relatedTable = {
      title: "CPE",
      id: "related-tableCPE",
      image: "images/database.png",
    };

   // southPOP.popupTemplate.actions = [relatedTable];

    const queryParams = southCPELayer.createQuery();

    _this.props.view.when(function () {
      _this.props.view.on("click", function (event) {
        _this.props.view.hitTest(event).then(function (response) {
          _this.empty(_this.state.relatedCPE);

          if (response.results.length) {
            let feature = response.results[0].graphic;

            response.results.map((e) => {
              if (e.graphic.attributes) {
                if (
                  e.graphic.attributes.name === "Rahat POP" ||
                  e.graphic.attributes.name === "Badar POP" ||
                  e.graphic.attributes.name === "DHA Phase02 POP" ||
                  e.graphic.attributes.name === "Plaza POP" ||
                  e.graphic.attributes.name === "BA POP" ||
                  e.graphic.attributes.name === "AP" ||
                  e.graphic.attributes.name === "Gulshan POP"
                ) {
                  _this.setState({
                    popID: e.graphic.attributes.id,
                    popName: e.graphic.attributes.name,
                  });

                  queryParams.where = `pop_id = ${e.graphic.attributes.id}`;
                }
              }
            });

            southCPELayer.queryFeatures(queryParams).then(function (results) {
              results.features.map((e) => {
                _this.state.relatedCPE.push(e.attributes);

                _this.setState({
                  relatedCPE: _this.state.relatedCPE,
                });
              });
            });
          }
        });
      });
    });

    _this.props.view.popup.on("trigger-action", function (event) {
      if (event.action.id === "related-tableCPE") {
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";

        const ws = XLSX.utils.json_to_sheet(_this.state.relatedCPE);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, ` ${_this.state.popName} - CPE` + fileExtension);
      }
    });

    /*  _this.props.view.on("click",function(){
            updatePopURL('alarmstate=2')

        }) */
  }
  render() {
    return null;
  }
}
