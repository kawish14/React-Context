import React from "react";
import mapContext from "../../context/mapContext";
import { complete_date } from "../complete_date";
import {NCE} from '../../url'

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

export default class Customer extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);
    this.state = {
      id: [],
      southOnline: null,
      southDyingGasp: null,
      southLOSWeek: null,
      southLOSOld: null,
      southGEMPack: null,
      southLOP: null,
      intervalId: null,
      ticketSouth: null,
      filterCriteria:null
    };
  }

  componentDidMount() {
    const {loginRole,region} = this.context.view;
    let queryExpression
    if (loginRole.role === "Admin") {
      queryExpression = "( (region = 'North' AND alarmstate IN (2,3,4)) OR (region IN ('South','Central') AND alarmstate IN (2,4)) )";
    }
    else if (loginRole.role === "North") {
      queryExpression = "region = 'North' AND alarmstate IN (2,3,4)";

    }
    else{
      queryExpression = "alarmstate IN (2,4)";
    }

    
    this.symbology(queryExpression)
    this.setState({
      filterCriteria:queryExpression
    })

  }

/*   componentDidUpdate(prevProps,prevState){
   
    if(prevState.filterCriteria !== this.context.filterCriteria ) {
      this.setState({
        filterCriteria:this.context.filterCriteria
      })
      console.log(this.state.filterCriteria)
      this.symbology(this.context.filterCriteria)
    }
   
  } */
  symbology(queryExpression){
    let _this = this
    const { customer,region } = this.context.view;
    const name = "$feature.alarmstate";
    const cat = "$feature.category";
    const week = "$feature.lastdowntime";
    const ticketStatus = "$feature.ticketstatus";

    let valueExpression = `When( 

                ${name} == 0 && ${cat} == 'VIP', 'VIP Online',
    
                ${name} == 1 && ${cat} == 'VIP', 'VIP Power Off',
    
                ${name} == 2 && ${cat} == 'VIP' && ${week} >= '${complete_date}', 'VIP LOSi < 1 week',
    
                ${name} == 2 && ${cat} == 'VIP' && ${week} <= '${complete_date}', 'VIP LOSi > 1 week',
    
                ${name} == 3 && ${cat} == 'VIP', 'VIP GEM Packet Loss',
        
                ${name} == 4 && ${cat} == 'VIP', 'VIP LOP',
                
                ${name} == 2 && ${cat} != 'VIP' && ${week} <= '${complete_date}' && ${ticketStatus} != 'In-process', 'Ordinary LOSi > 1 week',
                ${name} == 2 && ${cat} != 'VIP' && ${week} <= '${complete_date}' && ${ticketStatus} == 'In-process', 'LOSi Ticket > 1 week',
                
                ${name} == 2 && ${cat} != 'VIP' && ${week} >= '${complete_date}' && ${ticketStatus} != 'In-process', 'Ordinary LOSi < 1 week',
                ${name} == 2 && ${cat} != 'VIP' && ${week} >= '${complete_date}' && ${ticketStatus} == 'In-process', 'LOSi Ticket < 1 week',
               
                
                ${name} == 0 && ${cat} != 'VIP' && ${ticketStatus} != 'In-process', 'Ordinary Online',
                ${name} == 0 && ${cat} != 'VIP' && ${ticketStatus} == 'In-process', 'Online Ticket',
    
                ${name} == 1 && ${cat} != 'VIP' && ${ticketStatus} != 'In-process', 'Ordinary Power Off',
                ${name} == 1 && ${cat} != 'VIP' && ${ticketStatus} == 'In-process', 'Power Off Ticket',
    
                ${name} == 3 && ${cat} != 'VIP'  && ${ticketStatus} != 'In-process', 'Ordinary GEM Packet Loss',
                ${name} == 3 && ${cat} != 'VIP'  && ${ticketStatus} == 'In-process', 'GEM Packet Loss Ticket',
    
                ${name} == 4 && ${cat} != 'VIP' && ${ticketStatus} != 'In-process', 'Ordinary LOP',
                ${name} == 4 && ${cat} != 'VIP' && ${ticketStatus} == 'In-process', 'LOP Ticket',
                'Other'
                )`;

    var rendererCheck = {
      type: "unique-value",
      //field: "alarminfo",
      valueExpression: valueExpression,
      uniqueValueInfos: [
        {
          value: "VIP Online",
          symbol: {
            type: "picture-marker",
            url: "images/zero.png",
            color: "red",
            width: "17px",
            height: "17px",
          },
        },
        {
          value: "VIP Power Off",
          symbol: {
            type: "picture-marker",
            url: "images/one.png",
            color: "red",
            width: "23px",
            height: "23px",
          },
        },
        {
          value: "VIP LOSi < 1 week",
          symbol: {
            type: "picture-marker",
            url: "images/two.png",
            color: "red",
            width: "25px",
            height: "25px",
          },
        },
        {
          value: "VIP LOSi > 1 week",
          symbol: {
            type: "picture-marker",
            url: "images/two_1.png",
            color: "red",
            width: "24px",
            height: "24px",
          },
        },
        {
          value: "Ordinary LOSi > 1 week",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: [255, 170, 0],
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "LOSi Ticket > 1 week",
          symbol: {
            type: "picture-marker",
            url: "images/losiTicketWeek.png",
            color: "red",
            width: "22px",
            height: "25px",
          },
        },
        {
          value: "LOSi Ticket < 1 week",
          symbol: {
            type: "picture-marker",
            url: "images/los.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "VIP GEM Packet Loss",
          symbol: {
            type: "picture-marker",
            url: "images/three.png",
            color: "red",
            width: "21px",
            height: "21px",
          },
        },
        {
          value: "VIP LOP",
          symbol: {
            type: "picture-marker",
            url: "images/four.png",
            color: "red",
            width: "20px",
            height: "20px",
          },
        },
        {
          value: "Ordinary Online",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "green",
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "Online Ticket",
          symbol: {
            type: "picture-marker",
            url: "images/online.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "Ordinary Power Off",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "blue",
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "Power Off Ticket",
          symbol: {
            type: "picture-marker",
            url: "images/poweroff.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "Ordinary LOSi < 1 week",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "red",
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "Ordinary GEM Packet Loss",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "black",
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "GEM Packet Loss Ticket",
          symbol: {
            type: "picture-marker",
            url: "images/gem.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "Ordinary LOP",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "yellow",
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
        {
          value: "LOP Ticket",
          symbol: {
            type: "picture-marker",
            url: "images/lop.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "Other",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "white",
            size: "6.5px",
            outline: {
              color: [255, 255, 255, 1],
              width: 0.4,
            },
          },
        },
      ],
    };


    customer.definitionExpression = queryExpression;
    const placeholders = region.map((region, index) => `'${region}'`).join(',');
/* 
    customer.when(function(){
      setTimeout(() =>{
        customer.customParameters.CQL_FILTER = `region in (${placeholders}) and alarmstate in (0,1,2,3,4)`;
        customer.refresh();
        customer.definitionExpression = queryExpression;
        _this.props.gponTable(true)
      }, 5000);
    }) */


    customer.visible = true;

    customer.renderer = rendererCheck;
    // customer.featureReduction = {
    //   type: "cluster",
    //   clusterMinSize: 16.5,
    //   labelingInfo: [
    //     {
    //       deconflictionStrategy: "none",
    //       labelExpressionInfo: {
    //         expression: "Text($feature.cluster_count, '#,###')",
    //       },
    //       symbol: {
    //         type: "text",
    //         color: "white",
    //         font: {
    //           family: "Noto Sans",
    //           size: "12px",
    //         },
    //       },
    //       labelPlacement: "center-center",
    //     },
    //   ],
      
    //   popupTemplate: {
    //     title: "Cluster Summary",
    //     content: "This cluster represents <b>{cluster_count}</b> features.",
    //     fieldInfos: [
    //       {
    //         fieldName: "cluster_count",
    //         format: {
    //           places: 0,
    //           digitSeparator: true,
    //         },
    //       },
    //     ],
    //   },
    // }
    // customer.refreshInterval = 0.1;

    this.ONTRx();
  }

  ONTRx() {
    let _this = this
    const { customer } = this.context.view;
    _this.props.view.on("click", function (event) {
      _this.props.view.hitTest(event).then(function (response) {
        response.results.filter(function (result) {
          if (result.graphic.layer === null) {
            return true;
          } else if (result.graphic.layer.title === "Active Customer") {
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
                popupTemplate.content[1].text = ` ONT Rx Power: ${power.ontrx.bold()} dBm`;
                customer.popupTemplate = popupTemplate;
              })
              .catch((err) => {
                console.log(err);
              });
          }

          return null
        });
      });
    });
  }

  render() {
    return null;
  }
}
