import React from 'react'
import MapContext from "./mapContext";
import { authenticationService } from "../_services/authentication";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const MapState = (props) => {

    const view = {
        name:'south',
        loginRole:{},
        southLayer:{}
    }

    const southLayer = new GeoJSONLayer({
        url: "http://45.249.11.5:28881/geoserver/web_app/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_app%3ASouth_CPE_Web_APP&maxFeatures=1000000&outputFormat=application%2Fjson",
        copyright: "USGS Earthquakes",
     });

     view.southLayer = southLayer

    authenticationService.currentUser.subscribe((x) => {
        return view.loginRole = x
        });
    
    return (
            <MapContext.Provider value = {view}>
                {props.children}
            </MapContext.Provider>
        )
}

export default MapState