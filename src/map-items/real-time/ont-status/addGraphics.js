import { loadModules, setDefaultOptions } from "esri-loader";

let addGraphics = async (
  data,
  lastDowntime_complete,
  lastUptime_complete,
  layer,
  operation
) => {
  let { customer,allCPE } = layer;

  let region;

  let real = customer.createQuery();
  real.where = `alias = '${data.alias}'`;

  const updateCPE = await getUpdateCPE(customer,allCPE, data, lastDowntime_complete,lastUptime_complete);
  if (!updateCPE) return;

  const attribute = {
    objectid: updateCPE.attributes.objectid,
    address: updateCPE.attributes.address,
    alarminfo: data.alarminfo,
    alarmstate: data.alarmstate,
    alias: data.alias,
    bandwidth: updateCPE.attributes.bandwidth,
    area_town: updateCPE.attributes.area_town,
    sub_area: updateCPE.attributes.sub_area,
    category: updateCPE.attributes.category,
    city: updateCPE.attributes.city,
    id: updateCPE.attributes.id,
    dc_id: updateCPE.attributes.dc_id,
    fat_id: updateCPE.attributes.fat_id,
    frame: data.frame,
    lastdowntime: data.lastdowntime,
    lastuptime: data.lastuptime,
    downtime: updateCPE.attributes.downtime,
    uptime: updateCPE.attributes.uptime,
    name: updateCPE.attributes.name,
    olt: updateCPE.attributes.olt,
    ontid: updateCPE.attributes.ontid,
    ontmodel: updateCPE.attributes.ontmodel,
    plot: updateCPE.attributes.plot,
    pop_id: updateCPE.attributes.pop_id,
    port: data.port,
    slot: data.slot,
    type: updateCPE.attributes.type,
    ticketid: data.ticketid,
    ticketstatus: data.ticketstatus,
    activationdate: data.activationdate,
    statuschangedate: data.statuschangedate,
    mobilenum: updateCPE.attributes.mobilenum,
    tickettype: updateCPE.attributes.tickettype,
    ticketopentime: updateCPE.attributes.ticketopentime,
    ticketresolvetime: updateCPE.attributes.ticketresolvetime,
    region: updateCPE.attributes.region,
  };

  if (data.lastdowntime){
    attribute.downtime = lastDowntime_complete
  }
  else if (data.lastuptime){
    attribute.uptime = lastUptime_complete
  }

  region = updateCPE.attributes.region;

  loadModules(["esri/Graphic"], { css: false }).then(async ([Graphic]) => {
    if(customer.customParameters.CQL_FILTER.includes('alarmstate in (0,1,2,3,4)')){
    //  console.log("Update", {alias:data.alias, alarmstate:data.alarmstate})
      const updateFeatures = new Graphic({
        geometry: updateCPE.geometry,
        attributes: attribute,
      });
  
      await customer.applyEdits({
        updateFeatures: [updateFeatures],
         // deleteFeatures: [deleteFeature],
      });
  
    }
    else{
      if(operation === 'add'){
        /* console.log(operation, {alias:data.alias, alarmstate:data.alarmstate, lastdowntime:data.lastdowntime,
          lastuptime:data.lastuptime}); */

        const addFeatures = new Graphic({
          geometry: updateCPE.geometry,
          attributes: attribute,
        });
  
        await customer.applyEdits({
          addFeatures: [addFeatures],
           // deleteFeatures: [deleteFeature],
        });
  
      }
  
      if(operation === 'delete'){
        /* console.log(operation, {alias:data.alias, alarmstate:data.alarmstate, lastdowntime:data.lastdowntime,
          lastuptime:data.lastuptime}); */
        await customer.queryFeatures(real).then(async function (response) {
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
      
          await response.features.map(async (e) => {
            const deleteFeature = new Graphic({
              geometry: e.geometry,
              attributes: e.attributes,
            });
            
            await customer.applyEdits({
              deleteFeatures: [deleteFeature],
            });
          });
        });
      }
    }
  })

  return region
};

async function getUpdateCPE(customer, allCPE,data,lastDowntime_complete,lastUptime_complete){
  let real = customer.createQuery();
  real.where = `alias = '${data.alias}'`;

  if (!customer.customParameters.CQL_FILTER.includes("alarmstate in (0,1,2,3,4)")) {
    const objectWithId = allCPE.find((item) => item.attributes.alias === data.alias);
    return objectWithId;
  }

  const response = await customer.queryFeatures(real);
  
  return response.features.find((item) => item.attributes.alias === data.alias);
}
export { addGraphics };
