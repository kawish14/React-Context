import React, { useContext, useEffect, useRef, useState } from "react";
import "./widget.css";

export default function CoordinateWidget(props) {
  var coordsWidget;

  useEffect(() => {
    let view = props.view;
    //*** Add div element to show coordates ***//
    coordsWidget = document.getElementById("coordsWidget");
    //  coordsWidget.className = "esri-widget esri-component";
    //coordsWidget.style = styles.coordinate

    view.ui.add(coordsWidget, "bottom-right");

    //*** Update lat, lon, zoom and scale ***//
    function showCoordinates(xy) {
      var coords =
        "Lat/Lon " +
        xy.latitude.toFixed(6) +
        " " +
        xy.longitude.toFixed(6) +
        " | Scale 1:" +
        Math.round(view.scale * 1) / 1 +
        " | Zoom " +
        view.zoom;
      coordsWidget.innerHTML = coords;
    }

    //*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
    view.watch(["stationary"], function () {
      showCoordinates(view.center);
    });

    //*** Add event to show mouse coordinates on click and move ***//
    view.on(["pointer-down", "pointer-move"], function (evt) {
      showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
    });

    view.popup.autoOpenEnabled = true;

    view.on("click", ["Shift"], function (evt) {
      var lat = Math.round(evt.mapPoint.latitude * 1000000) / 1000000;
      var lon = Math.round(evt.mapPoint.longitude * 1000000) / 1000000;

      alert(lat + "," + lon);

      /*  let graphic = new Graphic({
                    geometry: evt.mapPoint,
                    symbol: {
                        type: "simple-marker",
                        color: "blue",
                        size: 5,
                        outline: { // autocasts as new SimpleLineSymbol()
                            width: 0.5,
                            color: [0, 0, 0, 0.2]
                        }
                    }, popupTemplate: {
                        content: "Lat/Lon " + lat + ", " + lon,
                        location: evt.mapPoint
                    },

                })
                view.graphics.removeAll()
                view.graphics.add(graphic);

                setTimeout(function () {
                    view.graphics.remove(graphic);
                }, 7000); */

      /*  view.popup.open({
                     // Set the popup's title to the coordinates of the location
                     title: "Reverse geocode: [" + lon + ", " + lat + "]",
                     location: evt.mapPoint // Set the location of the popup to the clicked location
                 }); */
    });

    return () => {
      view.ui.remove(coordsWidget);
    };
  }, []);

  return <div id="coordsWidget" className="d-none d-sm-block"></div>;
}
