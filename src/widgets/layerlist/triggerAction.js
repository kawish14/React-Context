const triggerAction = (id,view,layers) =>{

  let { DC_ODB, POP} = layers

    if(id === "full-extent South"){
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
    }

    if (id === "full-extent North"){
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
    }

    if (id === "full-extent Central"){
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