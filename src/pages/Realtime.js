import React, { useState, useEffect } from "react";
import mapContext from "../context/mapContext";
import io from "socket.io-client";
import { loadModules, setDefaultOptions } from "esri-loader";
import { UpdateCPEStatus } from "../components/UpdateCPEStatus";
import { ENDPOINT } from "../url";

import { version } from "../url";
setDefaultOptions({ version: version });

const socket = io(ENDPOINT);

class Realtime extends React.Component {
  static contextType = mapContext;

  constructor(props) {
    super(props);
    this.state = {
      downTimeDiff: 10,
      southIteration: 0,
      northIteration: 0,
      centralIteration: 0,
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
    };
  }

  empty = (arr) => (arr.length = 0);

  async southAddGraphic(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    let real = southCPELayer.createQuery();
    real.where = `alias = '${data.alias}'`;

    await southCPELayer.queryFeatures(real).then(async function (response) {
      if (lastDowntime_complete === "Empty") {
        if (response.features.length !== 0) {
          lastDowntime_complete = response.features[0].attributes.downtime;
        }
      }
      if (lastUptime_complete === "Empty") {
        if (response.features.length !== 0) {
          lastUptime_complete = response.features[0].attributes.uptime;
        }
      }

      await response.features.map((e) => {
        const attribute = {
          OBJECTID: e.attributes.OBJECTID,
          address: e.attributes.address,
          alarminfo: data.alarminfo,
          alarmstate: data.alarmstate,
          alias: data.alias,
          bandwidth: e.attributes.bandwidth,
          area_town: e.attributes.area_town,
          sub_area: e.attributes.sub_area,
          category: e.attributes.category,
          city: e.attributes.city,
          comments: e.attributes.comments,
          id: e.attributes.id,
          dc_id: e.attributes.dc_id,
          fat_id: e.attributes.fat_id,
          frame: data.frame,
          lastdowntime: data.lastdowntime,
          lastuptime: data.lastuptime,
          downtime: lastDowntime_complete,
          uptime: lastUptime_complete,
          name: e.attributes.name,
          olt: e.attributes.olt,
          ontid: e.attributes.ontid,
          ontmodel: e.attributes.ontmodel,
          plot: e.attributes.plot,
          pop_id: e.attributes.pop_id,
          port: data.port,
          slot: data.slot,
          status: e.attributes.status,
          type: e.attributes.type,
          ticketid: data.ticketid,
          ticketstatus: data.ticketstatus,
          activationdate: data.activationdate,
          statuschangedate: data.statuschangedate,
          mobilenum: data.mobilenum,
          tickettype: e.attributes.tickettype,
          ticketopentime: e.attributes.ticketopentime,
          ticketresolvetime: e.attributes.ticketresolvetime,
        };

        loadModules(["esri/Graphic"], { css: false }).then(
          async ([Graphic]) => {
            const updateFeature = new Graphic({
              geometry: e.geometry,
              attributes: attribute,
            });

            const deleteFeature = new Graphic({
              geometry: e.geometry,
              attributes: e.attributes,
            });

            await southCPELayer.applyEdits({
              deleteFeatures: [deleteFeature],
              addFeatures: [updateFeature],
            });
          }
        );
      });
    });

    //  southCPELayer.refresh();

    this.SouthRecent(complete_date);

    let CPEStatus = UpdateCPEStatus(
      loginRole,
      southCPELayer,
      northCPELayer,
      centralCPELayer
    );
    CPEStatus.then((res) => {
      this.props.southCPEstatus(res);
    });
  }

  async northAddGraphic(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    let real = northCPELayer.createQuery();
    real.where = `alias = '${data.alias}'`;

    await northCPELayer.queryFeatures(real).then(async function (response) {
      if (lastDowntime_complete === "Empty") {
        if (response.features.length !== 0) {
          lastDowntime_complete = response.features[0].attributes.downtime;
        }
      }
      if (lastUptime_complete === "Empty") {
        if (response.features.length !== 0) {
          lastUptime_complete = response.features[0].attributes.uptime;
        }
      }

      await response.features.map((e) => {
        const attribute = {
          OBJECTID: e.attributes.OBJECTID,
          address: e.attributes.address,
          alarminfo: data.alarminfo,
          alarmstate: data.alarmstate,
          alias: data.alias,
          bandwidth: e.attributes.bandwidth,
          area_town: e.attributes.area_town,
          sub_area: e.attributes.sub_area,
          category: e.attributes.category,
          city: e.attributes.city,
          comments: e.attributes.comments,
          id: e.attributes.id,
          dc_id: e.attributes.dc_id,
          fat_id: e.attributes.fat_id,
          frame: data.frame,
          lastdowntime: data.lastdowntime,
          lastuptime: data.lastuptime,
          downtime: lastDowntime_complete,
          uptime: lastUptime_complete,
          name: e.attributes.name,
          olt: e.attributes.olt,
          ontid: e.attributes.ontid,
          ontmodel: e.attributes.ontmodel,
          plot: e.attributes.plot,
          pop_id: e.attributes.pop_id,
          port: data.port,
          slot: data.slot,
          status: e.attributes.status,
          type: e.attributes.type,
          ticketid: data.ticketid,
          ticketstatus: data.ticketstatus,
          activationdate: data.activationdate,
          statuschangedate: data.statuschangedate,
          mobilenum: data.mobilenum,
          tickettype: e.attributes.tickettype,
          ticketopentime: e.attributes.ticketopentime,
          ticketresolvetime: e.attributes.ticketresolvetime,
        };

        loadModules(["esri/Graphic"], { css: false }).then(
          async ([Graphic]) => {
            const updateFeature = new Graphic({
              geometry: e.geometry,
              attributes: attribute,
            });

            const deleteFeature = new Graphic({
              geometry: e.geometry,
              attributes: e.attributes,
            });

            await northCPELayer.applyEdits({
              deleteFeatures: [deleteFeature],
              addFeatures: [updateFeature],
            });
          }
        );
      });
    });

    //  southCPELayer.refresh();

    this.NorthRecent(complete_date);

    let CPEStatus = UpdateCPEStatus(
      loginRole,
      southCPELayer,
      northCPELayer,
      centralCPELayer
    );
    CPEStatus.then((res) => {
      this.props.northCPEstatus(res);
    });
  }

  async centralAddGraphic(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    let real = centralCPELayer.createQuery();
    real.where = `alias = '${data.alias}'`;

    await centralCPELayer.queryFeatures(real).then(async function (response) {
      if (lastDowntime_complete === "Empty") {
        if (response.features.length !== 0) {
          lastDowntime_complete = response.features[0].attributes.downtime;
        }
      }
      if (lastUptime_complete === "Empty") {
        if (response.features.length !== 0) {
          lastUptime_complete = response.features[0].attributes.uptime;
        }
      }

      await response.features.map((e) => {
        const attribute = {
          OBJECTID: e.attributes.OBJECTID,
          address: e.attributes.address,
          alarminfo: data.alarminfo,
          alarmstate: data.alarmstate,
          alias: data.alias,
          bandwidth: e.attributes.bandwidth,
          area_town: e.attributes.area_town,
          sub_area: e.attributes.sub_area,
          category: e.attributes.category,
          city: e.attributes.city,
          comments: e.attributes.comments,
          id: e.attributes.id,
          dc_id: e.attributes.dc_id,
          fat_id: e.attributes.fat_id,
          frame: data.frame,
          lastdowntime: data.lastdowntime,
          lastuptime: data.lastuptime,
          downtime: lastDowntime_complete,
          uptime: lastUptime_complete,
          name: e.attributes.name,
          olt: e.attributes.olt,
          ontid: e.attributes.ontid,
          ontmodel: e.attributes.ontmodel,
          plot: e.attributes.plot,
          pop_id: e.attributes.pop_id,
          port: data.port,
          slot: data.slot,
          status: e.attributes.status,
          type: e.attributes.type,
          ticketid: data.ticketid,
          ticketstatus: data.ticketstatus,
          activationdate: data.activationdate,
          statuschangedate: data.statuschangedate,
          mobilenum: data.mobilenum,
          tickettype: e.attributes.tickettype,
          ticketopentime: e.attributes.ticketopentime,
          ticketresolvetime: e.attributes.ticketresolvetime,
        };

        loadModules(["esri/Graphic"], { css: false }).then(
          async ([Graphic]) => {
            const updateFeature = new Graphic({
              geometry: e.geometry,
              attributes: attribute,
            });

            const deleteFeature = new Graphic({
              geometry: e.geometry,
              attributes: e.attributes,
            });

            await centralCPELayer.applyEdits({
              deleteFeatures: [deleteFeature],
              addFeatures: [updateFeature],
            });
          }
        );
      });
    });

    //  southCPELayer.refresh();

    this.CentralRecent(complete_date);

    let CPEStatus = UpdateCPEStatus(
      loginRole,
      southCPELayer,
      northCPELayer,
      centralCPELayer
    );
    CPEStatus.then((res) => {
      this.props.centralCPEstatus(res);
    });
  }

  async SouthRecent(complete_date) {
    let _this = this;
    let { southCPELayer, recentDownSouth } = this.context.view;
    let south = southCPELayer.createQuery();
    south.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
    await southCPELayer.queryFeatures(south).then(function (response) {
      recentDownSouth.graphics.removeAll();

      response.features.map((e) => {
        let c_date = new Date();
        const c_date_year = c_date.getFullYear();
        const c_date_month = c_date.getMonth();
        const c_date_date = c_date.getDate();

        const c_date_complete =
          c_date_year + "-" + c_date_month + "-" + c_date_date;

        let d = new Date(e.attributes.lastdowntime);
        const d_year = d.getFullYear();
        const d_month = d.getMonth();
        const d_date = d.getDate();

        const d_complete = d_year + "-" + d_month + "-" + d_date;

        if (c_date_complete === d_complete) {
          if (c_date_month === d_month && c_date_date === d_date) {
            if (c_date.getHours() === d.getHours()) {
              let diff = c_date.getMinutes() - d.getMinutes();
              if (Math.abs(diff) <= _this.state.downTimeDiff) {
                loadModules(["esri/Graphic"], { css: false }).then(
                  async ([Graphic]) => {
                    let point = {
                      type: "point",
                      longitude: e.geometry.longitude,
                      latitude: e.geometry.latitude,
                    };

                    let markerSymbol = {
                      type: "picture-marker",
                      url: "images/moving-icon.gif", // PinPoint.gif  // moving-icon.gif
                      width: "25px",
                      height: "25px",
                      xoffset: 0,
                      yoffset: 12,
                    };

                    let pointGraphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol,
                    });
                    //console.log(pointGraphic)
                    recentDownSouth.graphics.add(pointGraphic);
                  }
                );
              }
            }
          }
        }
      });
    });
  }

  async NorthRecent(complete_date) {
    let _this = this;
    let { northCPELayer, recentDownNorth } = this.context.view;
    let north = northCPELayer.createQuery();
    north.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
    await northCPELayer.queryFeatures(north).then(function (response) {
      recentDownNorth.graphics.removeAll();

      response.features.map((e) => {
        let c_date = new Date();
        const c_date_year = c_date.getFullYear();
        const c_date_month = c_date.getMonth();
        const c_date_date = c_date.getDate();

        const c_date_complete =
          c_date_year + "-" + c_date_month + "-" + c_date_date;

        let d = new Date(e.attributes.lastdowntime);
        const d_year = d.getFullYear();
        const d_month = d.getMonth();
        const d_date = d.getDate();

        const d_complete = d_year + "-" + d_month + "-" + d_date;

        if (c_date_complete === d_complete) {
          if (c_date_month === d_month && c_date_date === d_date) {
            if (c_date.getHours() === d.getHours()) {
              let diff = c_date.getMinutes() - d.getMinutes();

              if (Math.abs(diff) <= _this.state.downTimeDiff) {
                loadModules(["esri/Graphic"], { css: false }).then(
                  async ([Graphic]) => {
                    let point = {
                      type: "point",
                      longitude: e.geometry.longitude,
                      latitude: e.geometry.latitude,
                    };

                    let markerSymbol = {
                      type: "picture-marker",
                      url: "images/moving-icon.gif", // PinPoint.gif  // moving-icon.gif
                      width: "25px",
                      height: "25px",
                      xoffset: 0,
                      yoffset: 12,
                    };

                    let pointGraphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol,
                    });

                    //console.log(pointGraphic)
                    recentDownNorth.graphics.add(pointGraphic);
                  }
                );
              }
            }
          }
        }
      });
    });
  }

  async CentralRecent(complete_date) {
    let _this = this;
    let { centralCPELayer, recentDownCentral } = this.context.view;
    let central = centralCPELayer.createQuery();
    central.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
    await centralCPELayer.queryFeatures(central).then(function (response) {
      recentDownCentral.graphics.removeAll();

      response.features.map((e) => {
        let c_date = new Date();
        const c_date_year = c_date.getFullYear();
        const c_date_month = c_date.getMonth();
        const c_date_date = c_date.getDate();

        const c_date_complete =
          c_date_year + "-" + c_date_month + "-" + c_date_date;

        let d = new Date(e.attributes.lastdowntime);
        const d_year = d.getFullYear();
        const d_month = d.getMonth();
        const d_date = d.getDate();

        const d_complete = d_year + "-" + d_month + "-" + d_date;

        if (c_date_complete === d_complete) {
          if (c_date_month === d_month && c_date_date === d_date) {
            if (c_date.getHours() === d.getHours()) {
              let diff = c_date.getMinutes() - d.getMinutes();
              if (Math.abs(diff) <= _this.state.downTimeDiff) {
                loadModules(["esri/Graphic"], { css: false }).then(
                  async ([Graphic]) => {
                    let point = {
                      type: "point",
                      longitude: e.geometry.longitude,
                      latitude: e.geometry.latitude,
                    };

                    let markerSymbol = {
                      type: "picture-marker",
                      url: "images/moving-icon.gif", // PinPoint.gif  // moving-icon.gif
                      width: "25px",
                      height: "25px",
                      xoffset: 0,
                      yoffset: 12,
                    };

                    let pointGraphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol,
                    });
                    //console.log(pointGraphic)
                    recentDownCentral.graphics.add(pointGraphic);
                  }
                );
              }
            }
          }
        }
      });
    });
  }

  async southFun(
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete
  ) {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    if (data.alarmstate == 2) {
      await this.southAddGraphic(
        data,
        complete_date,
        lastDowntime_complete,
        lastUptime_complete
      );

      await this.SouthRecent(complete_date);
    }

    if (data.alarmstate == 0 || data.alarmstate == 1 || data.alarmstate == 4) {
      let south = southCPELayer.createQuery();
      south.where = `alarmstate in (2,4) AND status = 'Active'`;

      await southCPELayer.queryFeatures(south).then(async (res) => {
        await res.features.forEach(async (e) => {
          if (data.alias === e.attributes.id) {
            await this.southAddGraphic(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
            let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
            CPEStatus.then((res) =>{
              this.props.southCPEstatus(res);
            })
            await this.SouthRecent(complete_date);
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
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    if (data.alarmstate == 2 ) {
      await this.northAddGraphic(
        data,
        complete_date,
        lastDowntime_complete,
        lastUptime_complete
      );

      await this.NorthRecent(complete_date);
    }

    if (data.alarmstate == 0 || data.alarmstate == 1 || data.alarmstate == 4) {
      let north = northCPELayer.createQuery();
      north.where = `alarmstate in(2,4) AND status = 'Active'`;

      await northCPELayer.queryFeatures(north).then((res) => {
        res.features.forEach(async (element) => {
          if (data.alias === element.attributes.id) {
            await this.northAddGraphic(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
            let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
            CPEStatus.then((res) =>{
              this.props.northCPEstatus(res);
            })
            await this.NorthRecent(complete_date);
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
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    if (data.alarmstate == 2 ) {
      await this.centralAddGraphic(
        data,
        complete_date,
        lastDowntime_complete,
        lastUptime_complete
      );

      await this.CentralRecent(complete_date);
    }

    if (data.alarmstate == 0 || data.alarmstate == 1 || data.alarmstate == 4) {
      let central = centralCPELayer.createQuery();
      central.where = `alarmstate in (2,4) AND status = 'Active'`;

      await centralCPELayer.queryFeatures(central).then((res) => {
        res.features.forEach(async (element) => {
          if (data.alias === element.attributes.id) {
            await this.centralAddGraphic(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
            let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
            CPEStatus.then((res) =>{
              this.props.centralCPEstatus(res);
            })
            await this.CentralRecent(complete_date);
          }
        });
      });
    }
  }

  async socketFun(complete_date) {
    let { loginRole } = this.context.view;

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
          if (data.olt.indexOf("ISB") === 0)
            await this.northFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );
          if (data.olt.indexOf("LHR") === 0)
            await this.centralFun(
              data,
              complete_date,
              lastDowntime_complete,
              lastUptime_complete
            );

          break;
        default:
      }
    });
  }

  componentDidMount() {
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

    this.socketFun(complete_date);

    switch (loginRole.role) {
      case "SouthDEVuser":
        this.SouthRecent(complete_date);

        break;
      case "NorthDEVuser":
        this.NorthRecent(complete_date);

        break;
      case "CentralDEVuser":
        this.CentralRecent(complete_date);

        break;
      case "Admin":
      case "CSD":
        this.SouthRecent(complete_date);
        this.NorthRecent(complete_date);
        this.CentralRecent(complete_date);

        break;
      default:
    }

    /* this.interval = setInterval(() => {
      alert("Updating Layer...");
      let CPEStatus = UpdateCPEStatus(
        loginRole,
        southCPELayer,
        northCPELayer,
        centralCPELayer
      );
      switch (loginRole.role) {
        case "SouthDEVuser":
          southCPELayer.refresh();
          CPEStatus.then((res) => {
            this.props.southCPEstatus(res);
          });
          break;
        case "NorthDEVuser":
          northCPELayer.refresh();
          CPEStatus.then((res) => {
            this.props.northCPEstatus(res);
          });
          break;
        case "CentralDEVuser":
          centralCPELayer.refresh();
          CPEStatus.then((res) => {
            this.props.centralCPEstatus(res);
          });
          break;
        case "Admin":
        case "CSD":
          southCPELayer.refresh();
          northCPELayer.refresh();
          centralCPELayer.refresh();
          CPEStatus.then((res) => {
            this.props.southCPEstatus(res);
            this.props.northCPEstatus(res);
            this.props.centralCPEstatus(res);
          });
          break;
        default:
      }

    }, 10 * 60 * 1000); */
  }

  componentWillUnmount() {
    socket.disconnect();
   // clearInterval(this.interval);
  }

  render() {
    return null;
  }
}

export default Realtime;
