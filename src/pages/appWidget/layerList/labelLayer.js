const labelLayer = (
  id,
  layers,
  view,
  south_Layer,
  KHI_Layers,
  north_Layer,
  ISB_Layers,
  central_Layer,
  LHR_Layers
) => {

  if (id === "full-extent KHI") {
    view
      .goTo({
        target: [67.050987, 24.842437],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    south_Layer.visible = true;
    KHI_Layers.visible = true;

    layers.recentDownSouth.visible = true

    if(layers.loginRole.role === 'Admin'){
      north_Layer.visible = false;
      ISB_Layers.visible = false;
  
      central_Layer.visible = false;
      LHR_Layers.visible = false;

      layers.recentDownNorth.visible = false
      layers.recentDownCentral.visible = false
    }
   
  }

  if (id === "full-extent ISB") {
    view
      .goTo({
        target: [73.088438, 33.605487],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    north_Layer.visible = true;
    ISB_Layers.visible = true;

    layers.recentDownNorth.visible = true

    if(layers.loginRole.role === 'Admin'){
      south_Layer.visible = false;
      KHI_Layers.visible = false;
  
      central_Layer.visible = false;
      LHR_Layers.visible = false;

      layers.recentDownSouth.visible = false
      layers.recentDownCentral.visible = false
      
    }

  }

  if (id === "full-extent LHR") {
    view
      .goTo({
        target: [74.385495, 31.479528],
        zoom: 11,
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    central_Layer.visible = true;
    LHR_Layers.visible = true;

    layers.recentDownCentral.visible = true
    
    if(layers.loginRole.role === 'Admin'){
      south_Layer.visible = false;
      KHI_Layers.visible = false;
  
      north_Layer.visible = false;
      ISB_Layers.visible = false;

      layers.recentDownSouth.visible = false
      layers.recentDownNorth.visible = false
    }
  
  }

  if (id === "label-Zone") {
    if (layers.southZone.labelsVisible === false) {
      layers.southZone.labelsVisible = true;
    } else {
      layers.southZone.labelsVisible = false;
    }
  }

  if (id === "label-north-Zone") {
    if (layers.northZone.labelsVisible === false) {
      layers.northZone.labelsVisible = true;
    } else {
      layers.northZone.labelsVisible = false;
    }
  }

  if (id === "label-central-Zone") {
    if (layers.centralZone.labelsVisible === false) {
      layers.centralZone.labelsVisible = true;
    } else {
      layers.centralZone.labelsVisible = false;
    }
  }

  if (id === "label-south-pop") {
    if (layers.southPOP.labelsVisible === false) {
      layers.southPOP.labelsVisible = true;
    } else {
      layers.southPOP.labelsVisible = false;
    }
  }

  if (id === "label-north-pop") {
    if (layers.northPOP.labelsVisible === false) {
      layers.northPOP.labelsVisible = true;
    } else {
      layers.northPOP.labelsVisible = false;
    }
  }

  if (id === "label-central-pop") {
    if (layers.centralPOP.labelsVisible === false) {
      layers.centralPOP.labelsVisible = true;
    } else {
      layers.centralPOP.labelsVisible = false;
    }
  }

  if (id === "label-south-DC") {
    if (layers.southDC.labelsVisible === false) {
      layers.southDC.labelsVisible = true;
    } else {
      layers.southDC.labelsVisible = false;
    }
  }

  if (id === "label-north-DC") {
    if (layers.northDC.labelsVisible === false) {
      layers.northDC.labelsVisible = true;
    } else {
      layers.northDC.labelsVisible = false;
    }
  }

  if (id === "label-central-DC") {
    if (layers.centralDC.labelsVisible === false) {
      layers.centralDC.labelsVisible = true;
    } else {
      layers.centralDC.labelsVisible = false;
    }
  }
};

export { labelLayer };
