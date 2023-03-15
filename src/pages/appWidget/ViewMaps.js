import React from "react";
import MapContext from "../../context/mapContext";
import { NCE } from "../../url";

export default class ViewMaps extends React.Component {
  static contextType = MapContext;
  componentDidMount() {
    let context = this.context.view;
    let _this = this
    let view = this.props.view;

    var popupTemplate = {
      title: "Customer",
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
              fieldName: "address",
              visible: true,
              label: "Address",
            },
            {
              fieldName: "dc_id",
              visible: true,
              label: "DC/ODB ID",
            },
            {
              fieldName: "activationdate",
              visible: true,
              label: "Activation Date",
            },
            {
              fieldName: "mobilenum",
              visible: true,
              label: "Mobile No.",
            },
            {
              fieldName: "type",
              visible: true,
              label: "Type",
            },
            {
              fieldName: "area_town",
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
            } /*{
                fieldName: "fat",
                visible: true,
                label: "FAT",
            }, {
                fieldName: "dc_odb",
                visible: true,
                label: "DC/ODB",
            }, {
                fieldName: "pop_id",
                visible: true,
                label: "POP",
            },*/,
            {
              fieldName: "ticketid",
              visible: true,
              label: "Ticket ID",
            },
            {
              fieldName: "ticketstatus",
              visible: true,
              label: "Ticket Status",
            },
            {
              fieldName: "tickettype",
              visible: true,
              label: "Ticket Type",
            },
            {
              fieldName: "ticketopentime",
              visible: true,
              label: "Ticket Open Time",
            },
            {
              fieldName: "ticketresolvetime",
              visible: true,
              label: "Ticket Resolve Time",
            },

            {
              fieldName: "olt",
              visible: true,
              label: "OLT",
            },
            {
              fieldName: "frame",
              visible: true,
              label: "Frame",
            },
            {
              fieldName: "slot",
              visible: true,
              label: "Slot",
            },
            {
              fieldName: "port",
              visible: true,
              label: "Port",
            },
            {
              fieldName: "ontid",
              visible: true,
              label: "ONT ID",
            },
            {
              fieldName: "ontmodel",
              visible: true,
              label: "ONT Model",
            },
            {
              fieldName: "alarminfo",
              visible: true,
              label: "Alarm Info",
            },
            {
              fieldName: "bandwidth",
              visible: true,
              label: "Bandwidth",
            },
            {
              fieldName: "uptime",
              visible: true,
              label: "Last-UP-Time",
            },
            {
              fieldName: "downtime",
              visible: true,
              label: "Last-Down-Time",
              /*format:{
                  dateFormat:"day-short-month-year-long-time"
              } */
            },
          ],
        },
        {
          type: "text",
          text: " ",
          //text: ` ONT Rx Power: ${power.ontrx.bold()} dBm`,
        },
      ],
    };

    view.on("click", function (event) {
      view.hitTest(event).then(function (response) {

        response.results.filter(function (result) {
          if (result.graphic.layer === null) {
            return true;
          } else if (
            result.graphic.layer.title === "South Customer" ||
            result.graphic.layer.title === "North Customer" ||
            result.graphic.layer.title === "Central Customer"
          ) {
            const olt = result.graphic.attributes.olt;
            const slot = result.graphic.attributes.slot;
            const port = result.graphic.attributes.port;
            const ontid = result.graphic.attributes.ontid;

            fetch(`${NCE}/${olt}/${slot}/${port}/${ontid}/`)
              .then(
                (response) => {
                  if (response.ok) {
                    return response;
                  } else {
                    var error = new Error(
                      "Error" + response.status + ":" + response.statusText
                    );
                    error.response = response;
                    throw error;
                  }
                },
                (error) => {
                  var errmess = new Error(error.message);
                  throw errmess;
                }
              )
              .then((response) => response.json())
              .then((power) => {
                popupTemplate.content[1].text = ` ONT Rx Power: ${power.ontrx.bold()} dBm`
                if(result.graphic.layer.title === "South Customer") context.southCPELayer.popupTemplate = popupTemplate;
                if(result.graphic.layer.title === "North Customer" ) context.northCPELayer.popupTemplate = popupTemplate;
                if(result.graphic.layer.title === "Central Customer") context.centralCPELayer.popupTemplate = popupTemplate;
                
              })
              .catch((err) => {
                console.log(err);
              });
          }

          return null;
        });
      });
    });
  }
  render() {
    return null;
  }
}
