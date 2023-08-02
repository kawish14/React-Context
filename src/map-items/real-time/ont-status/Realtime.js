import React, { useState, useEffect } from "react";
import MapContext from "../../../context/mapContext";
import { socket } from "../socket";
import { addGraphics } from "./addGraphics";
import { recentDown } from "./RecentDown";
import {socketData} from '../../../components/header/notification/socketData'
import axios from 'axios'

export default class Realtime extends React.Component {
  static contextType = MapContext;

  constructor(props) {
    super(props);
    this.state = {
      months: [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "ARIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ],
      complete_date: null,
    };
  }

  componentDidMount() {
    let { customer } = this.context.view;

    let _this = this
    recentDown(this.context.view);
    socket.on("endpoint", async (data) => {
   
      let lastDowntime_complete, lastUptime_complete;

      if (data.lastdowntime) {
        let d_lastdowntime = new Date(data.lastdowntime);
        d_lastdowntime.toDateString();
        let lastdowntime_date = ("0" + d_lastdowntime.getDate()).slice(-2);
        let lastdowntime_month = this.state.months[d_lastdowntime.getMonth()];
        let lastdowntime_year = d_lastdowntime.getFullYear();
        let lastdowntime_Time = d_lastdowntime.toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        lastDowntime_complete =
          lastdowntime_month +
          " " +
          lastdowntime_date +
          "," +
          lastdowntime_year +
          ", " +
          lastdowntime_Time;
      }

      if (data.lastuptime) {
        let d_lastuptime = new Date(data.lastuptime);
        let lastuptime_date = d_lastuptime.getDate();
        let lastuptime_month = this.state.months[d_lastuptime.getMonth()];
        let lastuptime_year = d_lastuptime.getFullYear();
        let lastdowntime_Time = d_lastuptime.toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        lastUptime_complete =
          lastuptime_month +
          " " +
          lastuptime_date +
          "," +
          lastuptime_year +
          ", " +
          lastdowntime_Time;
      } 
      
      if (data.alarmstate == 2 || data.alarmstate == 4) {
        
         await recentDown(this.context.view);

         let graphic = addGraphics(
          data,
          lastDowntime_complete,
          lastUptime_complete,
          _this.context.view,
          "add",
        );
        graphic.then((region) => {
          _this.props.region(region);
        });

      }

       if (data.alarmstate == 0 || data.alarmstate == 1) {
        let real = customer.createQuery();
        real.where = `alarmstate in(2)`;

        await customer.queryFeatures(real).then((res) => {
          res.features.forEach(async (element) => {
            if (data.alias === element.attributes.id) {
              await recentDown(_this.context.view);
              let graphic = addGraphics(
                data,
                lastDowntime_complete,
                lastUptime_complete,
                _this.context.view,
                "delete",
              );
              graphic.then((region) => {
                _this.props.region(region);
              });
            }
          });
        });
      }
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  //  socket.off("endpoint"); 
  }

  render() {
    return null
  }
}
