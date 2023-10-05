import React, { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import {parcelOID,parcel} from '../../url'
import axios from "axios";

export default function GISEditor(props){
    let context = useContext(MapContext);

    useEffect(() => {
      props.view.on("click", ["Ctrl"], function (evt) {
       
       var lat = Math.round(evt.mapPoint.latitude * 1000000) / 1000000;
        var lon = Math.round(evt.mapPoint.longitude * 1000000) / 1000000;

          let cord = lat + "," + lon

          let geom = `'Point(${lon} ${lat})'`

          axios.post(parcelOID,{geom:geom})
          .then(res =>{

            fetchFromExternal(cord,res.data[0].objectid)
          })
          .catch((error) => {
            console.error("Error fetching parcelOID:", error);
            alert("Error in fetching parcelOID")
            // Handle errors here
          });
   
      });
    }, []);

    const fetchFromExternal = (cord, objectid) =>{
        axios.get(`https://www.zameen.com/api/plotFinder/parcel/?coordinates=${cord}`)
          .then(res =>{
           // console.log({area:res.data.area, plot:res.data.plot_number, street:res.data.street, type:res.data.type})

            let obj = {objectid:objectid,area:res.data.area, plot:res.data.plot_number, street:res.data.street}
            submit(obj)

          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            alert("Error in fetching plot's data")
            // Handle errors here
          });
    }

    const submit = (obj) =>{
      axios.post(parcel,obj)
      .then(res =>{
        return
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Error in submitting plot's data")
        // Handle errors here
      });

    }
    return null
}