import React from "react";
import mapContext from "../../context/mapContext";

export default class NorthCustomer extends React.Component {
  static contextType = mapContext;

  constructor(props) {
    super(props);
    this.state = {
      id: [],
      northOnline: null,
      northDyingGasp: null,
      northLOSWeek: null,
      northLOSOld: null,
      northGEMPack: null,
      northLOP: null,
      ticketNorth:null
    };
  }
  componentDidMount() {
    let context = this.context;

    let _this = this;

    let customerLayer = context.view.northCPELayer;

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

    //customerLayer.listMode = "hide";

    view.when(async function () {
      let northLOSWeek = customerLayer.createQuery();
      let northLOSOld = customerLayer.createQuery();
      let northOnline = customerLayer.createQuery();
      let northDyingGasp = customerLayer.createQuery();
      let northGEMPack = customerLayer.createQuery();
      let northLOP = customerLayer.createQuery();

      let northTicket = customerLayer.createQuery();

      // Tickets
      northTicket.where = `status = 'Active' AND ticketstatus = 'In-process' `;
      await customerLayer.queryFeatures(northTicket).then(function (response) {
        _this.setState({
          ticketNorth: response.features.length,
        });
        _this.props.northCPEstatus(_this.state);
      });

      // LOS Week
      northLOSWeek.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
      await customerLayer.queryFeatures(northLOSWeek).then(function (response) {
        _this.setState({
          northLOSWeek: response.features.length,
        });
        _this.props.northCPEstatus(_this.state);
      });

      // LOS OLD
      northLOSOld.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
      await customerLayer.queryFeatures(northLOSOld).then(function (response) {
        _this.setState({
          northLOSOld: response.features.length,
        });
        _this.props.northCPEstatus(_this.state);
      });

      // Online
      northOnline.where = "alarmstate = 0 AND status = 'Active'";
      await customerLayer.queryFeatures(northOnline).then(function (response) {
        _this.setState({
          northOnline: response.features.length,
        });
        _this.props.northCPEstatus(_this.state);
      });

      // Gying Gasp
      northDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
      await customerLayer
        .queryFeatures(northDyingGasp)
        .then(function (response) {
          _this.setState({
            northDyingGasp: response.features.length,
          });
          _this.props.northCPEstatus(_this.state);
        });

      // GEMPack
      northGEMPack.where = "alarmstate = 3 AND status = 'Active'";
      await customerLayer.queryFeatures(northGEMPack).then(function (response) {
        _this.setState({
          northGEMPack: response.features.length,
        });
        _this.props.northCPEstatus(_this.state);
      });

      // LOP
      northLOP.where = "alarmstate = 4 AND status = 'Active'";
      await customerLayer.queryFeatures(northLOP).then(function (response) {
        _this.setState({
          northLOP: response.features.length,
        });

        _this.props.northCPEstatus(_this.state);
      });
    });

    var queryExpression = "alarmstate = 2 AND status = 'Active'";
    customerLayer.definitionExpression = queryExpression;

    customerLayer.visible = true;

    customerLayer.legendEnabled = false;
    customerLayer.renderer = rendererCheck;
  }
  render() {
    return null;
  }
}
