import React from 'react'
import { loadModules, setDefaultOptions } from 'esri-loader';
import './css/layerlist.css'

setDefaultOptions({ version: '4.16' })

export default class AppWidgets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draw: [],
            length: []
        }
        this.polyline = React.createRef()
        this.deletes = React.createRef()
    }


    componentDidMount() {
        let view = this.props.view;
        let map = this.props.map
    
        let southPOP = this.props.southPOP.southPOP.data
        const southZone = this.props.southZone.southZone.data;

        let northZone = this.props.northZone.northZone.data
        let northFeeder = this.props.northFeeder.northFeeder.data
        let northDC = this.props.northDC.northDC.data
        let northFAT = this.props.northFAT.northFAT.data
        let northJoint = this.props.northJoint.northJoint.data
        
        loadModules(["esri/layers/FeatureLayer","esri/widgets/Print", "esri/views/draw/Draw", "esri/widgets/Search", "esri/layers/GeoJSONLayer",
         'esri/widgets/Expand',"esri/widgets/BasemapToggle", "esri/Graphic", "esri/widgets/Legend", "esri/geometry/geometryEngine",
         "esri/widgets/Home"

        ], { css: false })
            .then(([FeatureLayer,Print, Draw, Search, GeoJSONLayer, Expand, BasemapToggle, Graphic, Legend, geometryEngine, Home]) => {


                var basemapToggle = new BasemapToggle({
                    view: view,  // The view that provides access to the map's "streets" basemap
                    nextBasemap: "osm"  // Allows for toggling to the "hybrid" basemap
                });
                view.ui.add(basemapToggle, 'bottom-left')

                var homeWidget = new Home({
                    view: view
                });

                // adds the home widget to the top left corner of the MapView
                view.ui.add(homeWidget, "top-left");
                
                // adds Legend to the Map
                let legend = new Expand({
                    content: new Legend({
                        view: view,
                        layerInfos:[{
                            layer:southPOP,
                        },{
                            layer:northFeeder,
                            title: "Fiber Optical Cable"
                        },{
                            layer:northDC,
                            title:"Distribution Cabinet (DC/ODB)"
                        },{
                            layer:northFAT,
                            title:"FAT"
                        },{
                            layer:northJoint,
                            title:"Joint"
                        },{
                            layer:northZone,
                            title:"Zones"
                        }]
                    }),
                    view: view,
                    group: "bottom-right",
                    expanded: false,
                })
                view.ui.add(legend, 'top-left')

                //*** Add div element to show coordates ***//
                var coordsWidget = document.createElement("div");
                coordsWidget.id = "coordsWidget";
                coordsWidget.className = "esri-widget esri-component";
                coordsWidget.style.padding = "7px 15px 5px";
                view.ui.add(coordsWidget, "bottom-right");

                //*** Update lat, lon, zoom and scale ***//
                function showCoordinates(xy) {
                    var coords = "Lat/Lon " + xy.latitude.toFixed(6) + " " + xy.longitude.toFixed(6) +
                        " | Scale 1:" + Math.round(view.scale * 1) / 1 +
                        " | Zoom " + view.zoom;
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

                view.on('click', ["Shift"], function (evt) {

                    var lat = Math.round(evt.mapPoint.latitude * 1000000) / 1000000;
                    var lon = Math.round(evt.mapPoint.longitude * 1000000) / 1000000;

                    alert(lat + ',' + lon)

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

            });

    }

    render() {
        return null 

    }

}

