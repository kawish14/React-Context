import { loadModules, setDefaultOptions } from "esri-loader";
import {complete_date} from '../../complete_date'

let recentDown = async (layer) => {
    let array = []

    let { customer, recentDown } = layer;
    let south = customer.createQuery();
    south.where = `alarmstate = 2 AND lastdowntime >= '${complete_date}'`;
    await customer.queryFeatures(south).then( async function (response) {
        const queriedFeatureIds = response.features.map(
          (feature) => feature.attributes.id
        );

        // Remove graphics that are not returned by the query
        recentDown.graphics.items = recentDown.graphics.items.filter(
          (graphic) => {
            return queriedFeatureIds.includes(graphic.attributes.id);
          }
        );

      await response.features.map( async (e) => {
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
                      attributes:{id:e.attributes.id}
                    });
                    
                    array.push(pointGraphic)
                  //  console.log(recentDown.graphics)
                   await recentDown.graphics.add(pointGraphic);
                  }
                );
              }
            }
          }
        }
      });
    });
  return array
}

export {recentDown}