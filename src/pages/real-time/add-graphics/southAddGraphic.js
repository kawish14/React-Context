import { loadModules, setDefaultOptions } from "esri-loader";
import {SouthRecent} from '../recent-down/recentDown'
let southAddGraphic = async (
    data,
    complete_date,
    lastDowntime_complete,
    lastUptime_complete,
    layer,
  ) => {
    let { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      layer

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
            const addFeature = new Graphic({
              geometry: e.geometry,
              attributes: attribute,
            });

            const deleteFeature = new Graphic({
              geometry: e.geometry,
              attributes: e.attributes,
            });

            await southCPELayer.applyEdits({
              deleteFeatures: [deleteFeature],
              addFeatures: [addFeature],
            });
          }
        );
      });
    });

    //  southCPELayer.refresh();

    SouthRecent(complete_date,layer);

  }

  export {southAddGraphic}