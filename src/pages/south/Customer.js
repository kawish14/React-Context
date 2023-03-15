import React from "react";
import mapContext from "../../context/mapContext";

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
    };
  }

  componentDidMount() {
    const { southCPELayer } = this.context.view;
    let _this = this;
    let view = this.props.view;

    let dates = new Date();

    let lastSevenDays = new Date(dates);
    lastSevenDays.toDateString();
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);

    let year = lastSevenDays.getFullYear();

    let month = (date) => {
      const m = date.getMonth() + 1;
      if (m.toString().length === 1) {
        return `0${m}`;
      } else {
        return m;
      }
    };
    let date = ("0" + lastSevenDays.getDate()).slice(-2);

    let complete_date = year + "-" + month(lastSevenDays) + "-" + date;

    const name = "$feature.alarmstate";
    const cat = "$feature.category";
    const week = "$feature.lastdowntime";
    const ticketStatus = "$feature.ticketstatus";

    const valueExpression = `When( 

                ${name} == 0 && ${cat} == 'VIP', 'zero',
    
                ${name} == 1 && ${cat} == 'VIP', 'one',
    
                ${name} == 2 && ${cat} == 'VIP' && ${week} >= '${complete_date}', 'two',
    
                ${name} == 2 && ${cat} == 'VIP' && ${week} <= '${complete_date}', 'two_1',
    
                ${name} == 3 && ${cat} == 'VIP', 'three',
        
                ${name} == 4 && ${cat} == 'VIP', 'four',
                
                ${name} == 2 && ${cat} != 'VIP' && ${week} <= '${complete_date}' && ${ticketStatus} != 'In-process', 'two_1_not_vip',
                ${name} == 2 && ${cat} != 'VIP' && ${week} <= '${complete_date}' && ${ticketStatus} == 'In-process', 'c-two_1',
                
                ${name} == 2 && ${cat} != 'VIP' && ${week} >= '${complete_date}' && ${ticketStatus} != 'In-process', 2,
                ${name} == 2 && ${cat} != 'VIP' && ${week} >= '${complete_date}' && ${ticketStatus} == 'In-process', 'c-two',
               
                
                ${name} == 0 && ${cat} != 'VIP' && ${ticketStatus} != 'In-process', 0,
                ${name} == 0 && ${cat} != 'VIP' && ${ticketStatus} == 'In-process', 'c-0',
    
                ${name} == 1 && ${cat} != 'VIP' && ${ticketStatus} != 'In-process', 1,
                ${name} == 1 && ${cat} != 'VIP' && ${ticketStatus} == 'In-process', 'c-1',
    
                ${name} == 3 && ${cat} != 'VIP'  && ${ticketStatus} != 'In-process', 3,
                ${name} == 3 && ${cat} != 'VIP'  && ${ticketStatus} == 'In-process', 'c-3',
    
                ${name} == 4 && ${cat} != 'VIP' && ${ticketStatus} != 'In-process', 4,
                ${name} == 4 && ${cat} != 'VIP' && ${ticketStatus} == 'In-process', 'c-4',

                5
                )`;

    var rendererCheck = {
      type: "unique-value",
      //field: "alarminfo",
      valueExpression: valueExpression,
      uniqueValueInfos: [
        {
          value: "5Min",
          symbol: {
            type: "picture-marker",
            url: "images/down-arrow-red.gif",
            width: "35px",
            height: "40px",
            xoffset: 0,
            yoffset: 12,
          },
        },
        {
          value: "zero",
          symbol: {
            type: "picture-marker",
            url: "images/zero.png",
            color: "red",
            width: "17px",
            height: "17px",
          },
        },
        {
          value: "one",
          symbol: {
            type: "picture-marker",
            url: "images/one.png",
            color: "red",
            width: "23px",
            height: "23px",
          },
        },
        {
          value: "two",
          symbol: {
            type: "picture-marker",
            url: "images/two.png",
            color: "red",
            width: "25px",
            height: "25px",
          },
        },
        {
          value: "two_1",
          symbol: {
            type: "picture-marker",
            url: "images/two_1.png",
            color: "red",
            width: "24px",
            height: "24px",
          },
        },
        {
          value: "two_1_not_vip",
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
          value: "c-two_1",
          symbol: {
            type: "picture-marker",
            url: "images/los.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "c-two",
          symbol: {
            type: "picture-marker",
            url: "images/los.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "three",
          symbol: {
            type: "picture-marker",
            url: "images/three.png",
            color: "red",
            width: "21px",
            height: "21px",
          },
        },
        {
          value: "four",
          symbol: {
            type: "picture-marker",
            url: "images/four.png",
            color: "red",
            width: "20px",
            height: "20px",
          },
        },
        {
          value: "0",
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
          value: "c-0",
          symbol: {
            type: "picture-marker",
            url: "images/online.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "1",
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
          value: "c-1",
          symbol: {
            type: "picture-marker",
            url: "images/poweroff.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "2",
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
          value: "3",
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
          value: "c-3",
          symbol: {
            type: "picture-marker",
            url: "images/gem.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "4",
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
          value: "c-4",
          symbol: {
            type: "picture-marker",
            url: "images/lop.png",
            color: "red",
            width: "13px",
            height: "23px",
          },
        },
        {
          value: "5",
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

    view.when(async function () {
      let southLOSWeek = southCPELayer.createQuery();
      let southLOSOld = southCPELayer.createQuery();
      let southOnline = southCPELayer.createQuery();
      let southDyingGasp = southCPELayer.createQuery();
      let southGEMPack = southCPELayer.createQuery();
      let southLOP = southCPELayer.createQuery();

      let southTicket = southCPELayer.createQuery();

      // Tickets
      southTicket.where = `status = 'Active' AND ticketstatus = 'In-process' `;
      await southCPELayer.queryFeatures(southTicket).then(function (response) {
        _this.setState({
          ticketSouth: response.features.length,
        });
        _this.props.southCPEstatus(_this.state);
      });

      // LOS Week
      southLOSWeek.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
      await southCPELayer.queryFeatures(southLOSWeek).then(function (response) {
        _this.setState({
          southLOSWeek: response.features.length,
        });
        _this.props.southCPEstatus(_this.state);

        /*  response.features.map(e =>{
          let c_date = new Date()
          let d  = new Date(e.attributes.lastdowntime)
          let diff = c_date.getMinutes() - d.getMinutes()
          if (Math.abs(diff) <= 5)   console.log(c_date.getMinutes(), d.getMinutes(), "Diff - ", diff)
        
        }) */
      });

      // LOS OLD
      southLOSOld.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
      await southCPELayer.queryFeatures(southLOSOld).then(function (response) {
        _this.setState({
          southLOSOld: response.features.length,
        });
        _this.props.southCPEstatus(_this.state);
      });

      // Online
      southOnline.where = "alarmstate = 0 AND status = 'Active'";
      await southCPELayer.queryFeatures(southOnline).then(function (response) {
        _this.setState({
          southOnline: response.features.length,
        });
        _this.props.southCPEstatus(_this.state);
      });

      // Gying Gasp
      southDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
      await southCPELayer
        .queryFeatures(southDyingGasp)
        .then(function (response) {
          _this.setState({
            southDyingGasp: response.features.length,
          });
          _this.props.southCPEstatus(_this.state);
        });

      // GEMPack
      southGEMPack.where = "alarmstate = 3 AND status = 'Active'";
      await southCPELayer.queryFeatures(southGEMPack).then(function (response) {
        _this.setState({
          southGEMPack: response.features.length,
        });
        _this.props.southCPEstatus(_this.state);
      });

      // LOP
      southLOP.where = "alarmstate = 4 AND status = 'Active'";
      await southCPELayer.queryFeatures(southLOP).then(function (response) {
        _this.setState({
          southLOP: response.features.length,
        });

        _this.props.southCPEstatus(_this.state);
      });
    });

    var queryExpression = "alarmstate = 2 AND status = 'Active'";
    southCPELayer.definitionExpression = queryExpression;

    southCPELayer.visible = true;

    southCPELayer.legendEnabled = false;
    southCPELayer.renderer = rendererCheck;

   // southCPELayer.refreshInterval = 0.1;
  }

  render() {
    return null;
  }
}
