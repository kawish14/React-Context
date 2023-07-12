import React, { useState, useEffect } from "react";
import mapContext from "../../context/mapContext";
import io from "socket.io-client";
import { loadModules, setDefaultOptions } from "esri-loader";
import {SouthRecent,NorthRecent,CentralRecent} from './recent-down/recentDown'
import {southAddGraphic,northAddGraphic,centralAddGraphic} from './add-graphics/index'
import { UpdateCPEStatus } from "../../components/UpdateCPEStatus";
import { ENDPOINT } from "../../url";

import { version } from "../../url";
import Axios from "axios";
setDefaultOptions({ version: version });

const socket = io(ENDPOINT);

class Realtime extends React.Component {
  static contextType = mapContext;

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
      southCPE: [],
      northCPE: [],
      centralCPE: [],

      southOnline: null,
      southDyingGasp: null,
      southLOSWeek: null,
      southLOSOld: null,
      southGEMPack: null,
      southLOP: null,
      ticketSouth: null,

      centralOnline: null,
      centralDyingGasp: null,
      centralLOSWeek: null,
      centralLOSOld: null,
      centralGEMPack: null,
      centralLOP: null,
      ticketCentral: null,

      northOnline: null,
      northDyingGasp: null,
      northLOSWeek: null,
      northLOSOld: null,
      northGEMPack: null,
      northLOP: null,
      ticketNorth: null,

      complete_date: null,
    };
  }

  async southFun(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let _this = this;
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer,recentDownSouth } =
      _this.context.view;

    if (data.alarmstate == 2) {
      SouthRecent(complete_date, _this.context.view);
      await southAddGraphic(
        data,
        complete_date,
        lastDowntime_complete,
        lastUptime_complete,
        _this.context.view
      );

      let CPEStatus = UpdateCPEStatus(
        loginRole,
        southCPELayer,
        northCPELayer,
        centralCPELayer
      );
      CPEStatus.then((data) => {
        _this.props.southCPEstatus(data);
      });
    }

    if (data.alarmstate == 0 || data.alarmstate == 1 || data.alarmstate == 4) {
      let south = southCPELayer.createQuery();
      south.where = `alarmstate in (2) AND status = 'Active'`;

      await southCPELayer.queryFeatures(south).then(async (res) => {
        await res.features.forEach(async (e) => {
          if (data.alias === e.attributes.id) {
           
            await southAddGraphic(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete,
              _this.context.view
            );

            let CPEStatus = UpdateCPEStatus(
              loginRole,
              southCPELayer,
              northCPELayer,
              centralCPELayer
            );
            CPEStatus.then((data_) => {
              _this.props.southCPEstatus(data_);
              SouthRecent(complete_date, _this.context.view);
            });
          }
        });
      });
    }
  }

  async northFun(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let _this = this;
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      _this.context.view;

    if (data.alarmstate == 2) {
      NorthRecent(complete_date, _this.context.view);
      await northAddGraphic(
        data,
        complete_date,
        lastDowntime_complete,
        lastUptime_complete,
        _this.context.view
      );

      let CPEStatus = UpdateCPEStatus(
        loginRole,
        southCPELayer,
        northCPELayer,
        centralCPELayer
      );
      CPEStatus.then((data) => {
        _this.props.northCPEstatus(data);
      });
    }

    if (data.alarmstate == 0 || data.alarmstate == 1 || data.alarmstate == 4) {
      let north = northCPELayer.createQuery();
      north.where = `alarmstate in(2) AND status = 'Active'`;

      await northCPELayer.queryFeatures(north).then((res) => {
        res.features.forEach(async (element) => {
          if (data.alias === element.attributes.id) {
          
            await northAddGraphic(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete,
              _this.context.view
            );

            let CPEStatus = UpdateCPEStatus(
              loginRole,
              southCPELayer,
              northCPELayer,
              centralCPELayer
            );
            CPEStatus.then((data) => {
              _this.props.northCPEstatus(data);
              NorthRecent(complete_date, _this.context.view);
            });
          }
        });
      });
    }
  }

  async centralFun(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let _this = this;
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      _this.context.view;

    if (data.alarmstate == 2) {
      CentralRecent(complete_date, _this.context.view);
      await centralAddGraphic(
        data,
        complete_date,
        lastDowntime_complete,
        lastUptime_complete,
        _this.context.view
      );
      let CPEStatus = UpdateCPEStatus(
        loginRole,
        southCPELayer,
        northCPELayer,
        centralCPELayer
      );
      CPEStatus.then((data) => {
        _this.props.centralCPEstatus(data);
      });
    }

    if (data.alarmstate == 0 || data.alarmstate == 1 || data.alarmstate == 4) {
      let central = centralCPELayer.createQuery();
      central.where = `alarmstate in (2) AND status = 'Active'`;

      await centralCPELayer.queryFeatures(central).then((res) => {
        res.features.forEach(async (element) => {
          if (data.alias === element.attributes.id) {
            
            await centralAddGraphic(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete,
              _this.context.view
            );

            let CPEStatus = UpdateCPEStatus(
              loginRole,
              southCPELayer,
              northCPELayer,
              centralCPELayer
            );
            CPEStatus.then((data) => {
              _this.props.centralCPEstatus(data);
              CentralRecent(complete_date, _this.context.view);
            });
          }
        });
      });
    }
  }

  updateData(alias, alarmstate) {
    // Find the ONT device in the data array using the unique ID
    const device = this.state.southCPE.find((device) => device.id === alias);
    if (device) {
      // Update the device object with the new alert information
      device.alarmstate = parseInt(alarmstate);
      // Do something with the updated device object
      const countByAlarmState = this.state.southCPE.reduce((counts, device) => {
        if (device.alarmstate in counts) {
          counts[device.alarmstate]++;
        } else {
          counts[device.alarmstate] = 1;
        }
        return counts;
      }, {});

      this.setState({
        southOnline: countByAlarmState[0],
        southDyingGasp: countByAlarmState[1],
        southLOSWeek: countByAlarmState[2] - this.state.southLOSOld,
        southGEMPack: countByAlarmState[3],
        southLOP: countByAlarmState[4],
      });
    }
  }

  async socketFun(complete_date) {
    let { loginRole, southCPELayer } = this.context.view;

    await socket.on("endpoint", async (data) => {
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
      } else {
        lastDowntime_complete = "Empty";
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
      } else {
        lastUptime_complete = "Empty";
      }

      switch (loginRole.role) {
        case "SouthDEVuser":
          if (data.olt.indexOf("KHI") === 0)
            this.updateData(data.alias, data.alarmstate);
          await this.southFun(
            data,
            complete_date,
            lastDowntime_complete,
            lastUptime_complete
          );

          break;
        case "NorthDEVuser":
          if (data.olt.indexOf("ISB") === 0)
            await this.northFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );

          break;
        case "CentralDEVuser":
          if (data.olt.indexOf("LHR") === 0)
            await this.centralFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );

          break;
        case "Admin":
        case "CSD":
          if (data.olt.indexOf("KHI") === 0) {
            await this.southFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
          }
          if (data.olt.indexOf("ISB") === 0) {
            await this.northFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
          }
          if (data.olt.indexOf("LHR") === 0) {
            await this.centralFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
          }
          break;
        default:
      }
    });
  }

  refreshLayer(complete_date) {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    let CPEStatus = UpdateCPEStatus(
      loginRole,
      southCPELayer,
      northCPELayer,
      centralCPELayer
    );

    switch (loginRole.role) {
      case "SouthDEVuser":
        southCPELayer.refresh();

        CPEStatus.then((data) => {
          this.props.southCPEstatus(data);
          SouthRecent(complete_date, this.context.view);
        });
  
        break;
      case "NorthDEVuser":
        northCPELayer.refresh();

        CPEStatus.then((data) => {
          this.props.northCPEstatus(data);
          NorthRecent(complete_date, this.context.view);
        });
      
        break;
      case "CentralDEVuser":
        centralCPELayer.refresh();

        CPEStatus.then((data) => {
          this.props.centralCPEstatus(data);
          CentralRecent(complete_date, this.context.view);
        });
    
        break;
      case "Admin":
      case "CSD":
        southCPELayer.refresh();
        northCPELayer.refresh();
        centralCPELayer.refresh();

        CPEStatus.then((data) => {
          this.props.southCPEstatus(data);
          this.props.northCPEstatus(data);
          this.props.centralCPEstatus(data);

          SouthRecent(complete_date, this.context.view);
          NorthRecent(complete_date, this.context.view);
          CentralRecent(complete_date, this.context.view);

        });
  
        break;
      default:
    }
  }

  componentDidMount() {
    let _this = this;
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

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

    _this.setState({
      complete_date: complete_date,
    });

  /*   this.interval = setInterval(() => {
      this.refreshLayer(complete_date)
    }, 7 * 60 * 1000); */

    switch (loginRole.role) {
      case "SouthDEVuser":

        SouthRecent(complete_date, this.context.view);
        
        let old_loss = [];
        let south_ticket = [];

        let real = southCPELayer.createQuery();
        real.where = "1=1";
        southCPELayer.queryFeatures(real).then(async function (response) {
          response.features.map((e) => {
            if (
              e.attributes.alarmstate === 2 &&
              e.attributes.lastdowntime <= _this.state.complete_date
            ) {
              old_loss.push(e);
            }

            if (e.attributes.ticketstatus === "In-process") {
              south_ticket.push(e);
            }

            _this.state.southCPE.push(e.attributes);
          });

          _this.setState({
            southCPE: _this.state.southCPE,
            southLOSOld: old_loss.length,
            ticketSouth: south_ticket.length,
          });
        });

        break;
      case "NorthDEVuser":

        NorthRecent(complete_date, this.context.view);

        break;
      case "CentralDEVuser":

        CentralRecent(complete_date, this.context.view);

        break;
      case "Admin":
      case "CSD":

        SouthRecent(complete_date, this.context.view);
        NorthRecent(complete_date, this.context.view);
        CentralRecent(complete_date, this.context.view);

        break;
      default:
    }

    this.socketFun(complete_date);
  }

  componentWillUnmount() {
    socket.disconnect();
    socket.off("endpoint");
   // clearInterval(this.interval);
  }

  /*  componentDidUpdate(prevProps, prevState) {
    if (prevState.southOnline !== this.state.southOnline) {
      if (this.context.view.loginRole.role === "SouthDEVuser") {
        this.props.southCPEstatus({
          southOnline: this.state.southOnline,
          southDyingGasp: this.state.southDyingGasp,
          southLOSWeek: this.state.southLOSWeek,
          southLOSOld: this.state.southLOSOld,
          southGEMPack: this.state.southGEMPack,
          southLOP: this.state.southLOP,
          ticketSouth: this.state.ticketSouth,
        });
      }
    }
  } */

  render() {
    return null;
  }
}

export default Realtime;
