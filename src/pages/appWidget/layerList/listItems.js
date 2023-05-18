
const listItems = (event) => {
    let item = event.item;
    if (item.title === "KHI Layers") {
      item.actionsSections = [
        [
          {
            title: "Go to full extent",
            className: "esri-icon-zoom-out-fixed",
            id: "full-extent KHI",
          },
        ],
       /*  [
          {
            title: "OFC Stats",
            className: "esri-icon-description",
            id: "ofc south",
          },
        ], */ 
      ];
    }

    if (item.title === "ISB Layers") {
      item.actionsSections = [
        [
          {
            title: "Go to full extent",
            className: "esri-icon-zoom-out-fixed",
            id: "full-extent ISB",
          },
        ],
     /*    [
            {
              title: "OFC Stats",
              className: "esri-icon-description",
              id: "ofc north",
            },
          ],  */
      ];
    }

    if (item.title === "LHR Layers") {
      item.actionsSections = [
        [
          {
            title: "Go to full extent",
            className: "esri-icon-zoom-out-fixed",
            id: "full-extent LHR",
          },
        ],
      /*   [
            {
              title: "OFC Stats",
              className: "esri-icon-description",
              id: "ofc central",
            },
          ], */
      ];
    }

    if (item.title === "South Zone") {
      item.actionsSections = [
        [
          {
            title: "Label Zone",
            className: "esri-icon-labels",
            id: "label-Zone",
          },
        ],
      ];
    }

    if (item.title === "North Zone") {
      item.actionsSections = [
        [
          {
            title: "Label North Zone",
            className: "esri-icon-labels",
            id: "label-north-Zone",
          },
        ],
      ];
    }
    if (item.title === "Central Zone") {
      item.actionsSections = [
        [
          {
            title: "Label Central Zone",
            className: "esri-icon-labels",
            id: "label-central-Zone",
          },
        ],
      ];
    }

    if (item.title === "FAT") {
      item.actionsSections = [
        [
          {
            title: "Label FAT",
            className: "esri-icon-labels",
            id: "label-FAT",
          },
        ],
      ];
    }

    if (item.title === "POP") {
      item.actionsSections = [
        [
          {
            title: "Label POP",
            className: "esri-icon-labels",
            id: "label-south-pop",
          },
        ],
      ];
    }

    if (item.title === "North POP") {
      item.actionsSections = [
        [
          {
            title: "Label North POP",
            className: "esri-icon-labels",
            id: "label-north-pop",
          },
        ],
      ];
    }
    if (item.title === "Central POP") {
      item.actionsSections = [
        [
          {
            title: "Label Central POP",
            className: "esri-icon-labels",
            id: "label-central-pop",
          },
        ],
      ];
    }

    if (item.title === "South ODB/DC") {
      item.actionsSections = [
        [
          {
            title: "Label DC",
            className: "esri-icon-labels",
            id: "label-south-DC",
          },
        ],
      ];
    }

    if (item.title === "North ODB/DC") {
      item.actionsSections = [
        [
          {
            title: "Label DC",
            className: "esri-icon-labels",
            id: "label-north-DC",
          },
        ],
      ];
    }

    if (item.title === "Central ODB/DC") {
      item.actionsSections = [
        [
          {
            title: "Label DC",
            className: "esri-icon-labels",
            id: "label-central-DC",
          },
        ],
      ];
    }

  /*   if (item.title === "CSV Layer") {
      item.actionsSections = [
        [
          {
            title: "Symbology",
            className: "esri-icon-configure-popup",
            id: "symbology",
          },
        ],
      ];
    } */
}

export {listItems}