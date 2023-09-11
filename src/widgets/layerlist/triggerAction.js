import React from 'react'
import ReactDOM from 'react-dom';
import OutageFilter from "./outage/OutageFilter";

let filterContainer = null;

const triggerAction = (id,view,layers) =>{

  let { DC_ODB, POP} = layers

  if(id === "filter-outages"){
    
    if (!filterContainer) {
      filterContainer = document.createElement("div");
      view.ui.add(filterContainer, "top-right");
    }
   
    ReactDOM.render(<OutageFilter layers={layers} view={view} />, filterContainer);
  }

    if (id === "label-DC") {
      if (DC_ODB.labelsVisible === false) {
        DC_ODB.labelsVisible = true;
      } else {
        DC_ODB.labelsVisible = false;
      }
    }
    if (id === "label-POP") {
      if (POP.labelsVisible === false) {
        POP.labelsVisible = true;
      } else {
        POP.labelsVisible = false;
      }
    }
}

export {triggerAction}