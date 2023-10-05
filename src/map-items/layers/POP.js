import React from "react";
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import './css/layer.css'

import {version} from '../../url'

setDefaultOptions({ version: version });
export default class POP extends React.Component {
  static contextType = MapContext;
  constructor(props) {
    super(props);
    this.state = {
      relatedCPE: [],
      popID: null,
      popName: null,
      maxSlot: null,
      used_ports: null,
      free_ports: null,
      show: false,
      display: "none",
    };
    this.table = React.createRef();
  }

  empty = (arr) => (arr.length = 0);

  componentDidMount(){
    let {POP, customer} = this.context.view
    let _this = this

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
  
      POP.renderer = POPrender;
      POP.labelingInfo = labelClassZone;

      let relatedTable = {
        title: "OLT",
        id: "related-tableCPE",
        image: "images/database.png",
      };
  
      const queryParams = customer.createQuery();
  
      _this.props.view.when(function () {
        _this.props.view.on("click", function (event) {
          _this.props.view.hitTest(event).then(function (response) {
            _this.empty(_this.state.relatedCPE);
  
            if (response.results.length) {
              let feature = response.results[0].graphic;
  
              response.results.map((e) => {
                if (e.graphic.layer) {
                
                  if (e.graphic.layer.title === "POP") {
                   // POP.popupTemplate.actions = [relatedTable];
  
                    _this.setState({
                      popID: e.graphic.attributes.id,
                      popName: e.graphic.attributes.name,
                     display:"none"
                    });
  
                    queryParams.where = `pop_id = ${e.graphic.attributes.id}`;
                  }
                }
               
              });
  
              customer.queryFeatures(queryParams).then(function (results) {
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
          /*   const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
          const fileExtension = ".xlsx";
  
          const ws = XLSX.utils.json_to_sheet(_this.state.relatedCPE);
          const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
          const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const data = new Blob([excelBuffer], { type: fileType });
  
          FileSaver.saveAs(data, ` ${_this.state.popName} - CPE` + fileExtension); */
  
          let total_fsp = new Set();
          let maxSlot = new Set();
  
          // Iterate over the array and add fsp values to the Set
          for (let i = 0; i < _this.state.relatedCPE.length; i++) {
            total_fsp.add(_this.state.relatedCPE[i].nce_fsp);
            maxSlot.add(_this.state.relatedCPE[i].slot)
          }
      
          // Get the total count of unique fsp values
          let totalCount = total_fsp.size;
          console.log("total CPE:", _this.state.relatedCPE.length, "Cards:",maxSlot.size)
          _this.setState({
            cards: maxSlot.size,
            used_ports: totalCount,
            free_ports: maxSlot.size * 16 - totalCount,
            display:"inline-table"
          });
  
          loadModules(["esri/popup/content/CustomContent"], {
            css: false,
          }).then(([CustomContent]) => {
  
            const contentWidget = new CustomContent({
              outFields: ["*"],
              creator: function () {
                return _this.table.current;
              },
            });
  
            let popupTemplate = {
        
              title: "POP",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "name",
                      visible: true,
                      label: "Name",
                      format: {
                        digitSeparator: false,
                        places: 0,
                      },
                    },
                    {
                      fieldName: "id",
                      visible: true,
                      label: "ID",
                    },
                    {
                      fieldName: "plot",
                      visible: true,
                      label: "Plot",
                    },
                    {
                      fieldName: "street",
                      visible: true,
                      label: "Street",
                    },
                    {
                      fieldName: "area",
                      visible: true,
                      label: "Area/Town",
                    },
                    {
                      fieldName: "block_phase_sector",
                      visible: true,
                      label: "block/Phase",
                    },
                  ],
                },
                contentWidget
              ],
            };
  
            POP.popupTemplate = popupTemplate
  
          });
        }
      });

  }
  render() {
    return (
        <table className="summary" ref={this.table} style={{display:this.state.display}}>
        <thead>
          <tr>
            <th className="head">Cards</th>
            <th className="head">Used Ports</th>
            <th className="head">Free Ports</th>
           {/*  <th className="head">Customer Count</th> */}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="data">{this.state.cards === -Infinity ? 0 : this.state.cards }</td>
            <td className="data">{this.state.used_ports}</td>
            <td className="data">{this.state.free_ports === -Infinity ? 0 : this.state.free_ports}</td>
            {/* <td className="data">{this.state.relatedCPE.length}</td> */}
          </tr>
        </tbody>
      </table>
    );
  }
}
