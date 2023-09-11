import { loadModules, setDefaultOptions } from "esri-loader";
import {complete_date} from '../../complete_date'

let recentDown = async (layer) => {
    let array = []
    let { customer, recentDown } = layer;

    recentDown.graphics.removeAll()

    let south = customer.createQuery();
    south.where = `alarmstate = 2 AND lastdowntime >= '${complete_date}'`;
    await customer.queryFeatures(south).then( async function (response) {

      await response.features.map(async (e) => {

        let c_date = new Date();
        let db_date = new Date(e.attributes.lastdowntime); 

        const timeDifferenceMs = c_date - db_date;
        const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);

        if (timeDifferenceMinutes.toFixed(0) <= 30) {

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
                attributes: { id: e.attributes.id },
              });

              array.push(pointGraphic);
              //  console.log(recentDown.graphics)
              await recentDown.graphics.add(pointGraphic);
            }
          );
        }
      });
    });

  return array
}

export {recentDown}