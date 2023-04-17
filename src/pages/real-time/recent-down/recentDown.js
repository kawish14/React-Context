import { loadModules, setDefaultOptions } from "esri-loader";

let SouthRecent = async (complete_date,layer) => {

    let { southCPELayer, recentDownSouth } = layer;
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
              if (Math.abs(diff) <= 70) {
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

let NorthRecent = async (complete_date,layer) => {
    let { northCPELayer, recentDownNorth } = layer;
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

              if (Math.abs(diff) <= 70) {
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

let CentralRecent = async (complete_date,layer) => {

    let { centralCPELayer, recentDownCentral } = layer;
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
              if (Math.abs(diff) <= 70) {
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

export {SouthRecent,NorthRecent,CentralRecent}