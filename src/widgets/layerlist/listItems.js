import { timers } from "jquery";

const listItems = (event) =>{
    let item = event.item
    if(item.title === "Layers"){
      //  item.open = true;
  /*       item.actionsSections = [
            [
                {
                    title:"South",
                    className:"esri-icon-zoom-out-fixed",
                    id: "full-extent South",
                }
            ],
             [
                {
                    title:"North",
                    className:"esri-icon-zoom-out-fixed",
                    id: "full-extent North",
                }
            ],
            [
                {
                    title:"Central",
                    className:"esri-icon-zoom-out-fixed",
                    id: "full-extent Central",
                }
            ] 
        ] */
    }

    if(item.title === "ODB/DC"){
        item.actionsSections = [
            [
              {
                title: "Label DC",
                className: "esri-icon-labels",
                id: "label-DC",
              },
            ],
          ];
    }
    if(item.title === "POP"){
        item.actionsSections = [
            [
              {
                title: "Label POP",
                className: "esri-icon-labels",
                id: "label-POP",
              },
            ],
          ];
    }

    if(item.title === "Outage"){
      item.actionsSections = [
        [
          {
            title: "Filter Outages",
            className: "esri-icon-filter",
            id: "filter-outages",
          },
        ],
      ];
    }
}

export {listItems}