const southTable = async (southCPELayer,complete_date) =>{
    let table = {
        southOnline: null,
        southDyingGasp: null,
        southLOSWeek: null,
        southLOSOld: null,
        southGEMPack: null,
        southLOP: null,
        ticketSouth: null,
    }
    
    let southOnline = southCPELayer.createQuery();
    let southDyingGasp = southCPELayer.createQuery();
    let southGEMPack = southCPELayer.createQuery();
    let southLOP = southCPELayer.createQuery();
    let southLOSweek = southCPELayer.createQuery();
    let southLOSold = southCPELayer.createQuery();

    let southTicket = southCPELayer.createQuery();

    // Tickets
    southTicket.where = `status = 'Active' AND ticketstatus = 'In-process' `;
    await southCPELayer.queryFeatures(southTicket).then(function (response) {
  
        table.ticketSouth =  response.features.length
    });

    // LOS Week
    southLOSweek.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
    await southCPELayer.queryFeatures(southLOSweek).then(function (response) {
     
        table.southLOSWeek =  response.features.length
    });

    // LOS Old
    southLOSold.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
    await southCPELayer.queryFeatures(southLOSold).then(function (response) {
      
        table.southLOSOld =  response.features.length
    });

    // Online
    southOnline.where = "alarmstate = 0 AND status = 'Active'";
    await southCPELayer.queryFeatures(southOnline).then(function (response) {
   
        table.southOnline = response.features.length
    });

    // Gying Gasp
    southDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
    await southCPELayer.queryFeatures(southDyingGasp).then(function (response) {
      
        table.southDyingGasp = response.features.length
    });

    // GEMPack
    southGEMPack.where = "alarmstate = 3 AND status = 'Active'";
    await southCPELayer.queryFeatures(southGEMPack).then(function (response) {
      
        table.southGEMPack = response.features.length
    });

    // LOP
    southLOP.where = "alarmstate = 4 AND status = 'Active'";
    await southCPELayer.queryFeatures(southLOP).then(function (response) {
      
        table.southLOP = response.features.length
    });

    return table
}

const northTable = async (northCPELayer,complete_date) =>{

    let table = {
    northOnline: null,
      northDyingGasp: null,
      northLOSWeek: null,
      northLOSOld: null,
      northGEMPack: null,
      northLOP: null,
      ticketNorth: null,
    }

    let northLOSWeek = northCPELayer.createQuery();
    let northLOSOld = northCPELayer.createQuery();
    let northOnline = northCPELayer.createQuery();
    let northDyingGasp = northCPELayer.createQuery();
    let northGEMPack = northCPELayer.createQuery();
    let northLOP = northCPELayer.createQuery();

    let northTicket = northCPELayer.createQuery();

    // Tickets
    northTicket.where = `status = 'Active' AND ticketstatus = 'In-process' `;
    await northCPELayer.queryFeatures(northTicket).then(function (response) {

        table.ticketNorth = response.features.length
    });

    // LOS Week
    northLOSWeek.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
    await northCPELayer.queryFeatures(northLOSWeek).then(function (response) {
     
        table.northLOSWeek = response.features.length
    });

    // LOS OLD
    northLOSOld.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
    await northCPELayer.queryFeatures(northLOSOld).then(function (response) {
  
        table.northLOSOld = response.features.length
    });

    // Online
    northOnline.where = "alarmstate = 0 AND status = 'Active'";
    await northCPELayer.queryFeatures(northOnline).then(function (response) {
    
        table.northOnline = response.features.length
    });

    // Gying Gasp
    northDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
    await northCPELayer.queryFeatures(northDyingGasp).then(function (response) {
 
        table.northDyingGasp = response.features.length
    });

    // GEMPack
    northGEMPack.where = "alarmstate = 3 AND status = 'Active'";
    await northCPELayer.queryFeatures(northGEMPack).then(function (response) {
     
        table.northGEMPack = response.features.length
    });

    // LOP
    northLOP.where = "alarmstate = 4 AND status = 'Active'";
    await northCPELayer.queryFeatures(northLOP).then(function (response) {
   
        table.northLOP = response.features.length
    });

    return table
}

const centralTable = async (centralCPELayer,complete_date) =>{

    let table = {
        centralOnline: null,
        centralDyingGasp: null,
        centralLOSWeek: null,
        centralLOSOld: null,
        centralGEMPack: null,
        centralLOP: null,
        ticketCentral: null,
        }

    let centralLOSWeek = centralCPELayer.createQuery();
    let centralLOSOld = centralCPELayer.createQuery();
    let centralOnline = centralCPELayer.createQuery();
    let centralDyingGasp = centralCPELayer.createQuery();
    let centralGEMPack = centralCPELayer.createQuery();
    let centralLOP = centralCPELayer.createQuery();

    let centralTicket = centralCPELayer.createQuery();

    // Tickets
    centralTicket.where = `status = 'Active' AND ticketstatus = 'In-process' `;
    await centralCPELayer.queryFeatures(centralTicket).then(function (response) {
   
        table.ticketCentral = response.features.length
    });

    // LOS Week
    centralLOSWeek.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`;
    await centralCPELayer.queryFeatures(centralLOSWeek).then(function (response) {

        table.centralLOSWeek = response.features.length
    });

    // LOS OLD
    centralLOSOld.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`;
    await centralCPELayer.queryFeatures(centralLOSOld).then(function (response) {
     
        table.centralLOSOld = response.features.length
    });

    // Online
    centralOnline.where = "alarmstate = 0 AND status = 'Active'";
    await centralCPELayer.queryFeatures(centralOnline).then(function (response) {
    
        table.centralOnline = response.features.length
    });

    // Gying Gasp
    centralDyingGasp.where = "alarmstate = 1 AND status = 'Active'";
    await centralCPELayer.queryFeatures(centralDyingGasp).then(function (response) {
    
        table.centralDyingGasp = response.features.length
    });

    // GEMPack
    centralGEMPack.where = "alarmstate = 3 AND status = 'Active'";
    await centralCPELayer.queryFeatures(centralGEMPack).then(function (response) {
      
        table.centralGEMPack = response.features.length
    });

    // LOP
    centralLOP.where = "alarmstate = 4 AND status = 'Active'";
    await centralCPELayer.queryFeatures(centralLOP).then(function (response) {
    
        table.centralLOP = response.features.length
    });

    return table
}

const UpdateCPEStatus = async (loginRole,southCPELayer, northCPELayer, centralCPELayer) =>{

    let table = {
      southOnline: null,
      southDyingGasp: null,
      southLOSWeek: null,
      southLOSOld: null,
      southGEMPack: null,
      southLOP: null,
      ticketSouth: null,

      northOnline: null,
      northDyingGasp: null,
      northLOSWeek: null,
      northLOSOld: null,
      northGEMPack: null,
      northLOP: null,
      ticketNorth: null,

      centralOnline: null,
      centralDyingGasp: null,
      centralLOSWeek: null,
      centralLOSOld: null,
      centralGEMPack: null,
      centralLOP: null,
      ticketCentral: null,
    };

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

    if (loginRole.role === "SouthDEVuser") {

        let south =  southTable(southCPELayer,complete_date)
        await south.then( res =>{
            table.southOnline = res.southOnline
            table.southDyingGasp = res.southDyingGasp
            table.southLOSWeek = res.southLOSWeek
            table.southLOSOld = res.southLOSOld
            table.southGEMPack = res.southGEMPack
            table.southLOP = res.southLOP
            table.ticketSouth = res.ticketSouth
        })

    }

    if (loginRole.role === "NorthDEVuser") {
        let north =  northTable(northCPELayer,complete_date)
        await north.then(res =>{

            table.northOnline = res.northOnline
            table.northDyingGasp = res.northDyingGasp
            table.northLOSWeek = res.northLOSWeek
            table.northLOSOld = res.northLOSOld
            table.northGEMPack = res.northGEMPack
            table.northLOP = res.northLOP
            table.ticketNorth = res.ticketNorth
        })
    }

    if (loginRole.role === "CentralDEVuser") {
        let central =  centralTable(centralCPELayer,complete_date)
        await central.then(res =>{
            table.centralOnline = res.centralOnline
            table.centralDyingGasp = res.centralDyingGasp
            table.centralLOSWeek = res.centralLOSWeek
            table.centralLOSOld = res.centralLOSOld
            table.centralGEMPack = res.centralGEMPack
            table.centralLOP = res.centralLOP
            table.ticketCentral = res.ticketCentral
        })
    }

    if (loginRole.role === "Admin" || loginRole.role === "CSD") {

        let south =  southTable(southCPELayer,complete_date)
        await south.then( res =>{
            table.southOnline = res.southOnline
            table.southDyingGasp = res.southDyingGasp
            table.southLOSWeek = res.southLOSWeek
            table.southLOSOld = res.southLOSOld
            table.southGEMPack = res.southGEMPack
            table.southLOP = res.southLOP
            table.ticketSouth = res.ticketSouth
        })

        
        let north =  northTable(northCPELayer,complete_date)
        await north.then(res =>{

            table.northOnline = res.northOnline
            table.northDyingGasp = res.northDyingGasp
            table.northLOSWeek = res.northLOSWeek
            table.northLOSOld = res.northLOSOld
            table.northGEMPack = res.northGEMPack
            table.northLOP = res.northLOP
            table.ticketNorth = res.ticketNorth
        })

        let central =  centralTable(centralCPELayer,complete_date)
        await central.then(res =>{
            table.centralOnline = res.centralOnline
            table.centralDyingGasp = res.centralDyingGasp
            table.centralLOSWeek = res.centralLOSWeek
            table.centralLOSOld = res.centralLOSOld
            table.centralGEMPack = res.centralGEMPack
            table.centralLOP = res.centralLOP
            table.ticketCentral = res.ticketCentral
        })
    }

    return table

}
export {UpdateCPEStatus}