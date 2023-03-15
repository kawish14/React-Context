import React, {useContext, useEffect, useRef,useState } from "react";
import MapContext from "../../../context/mapContext";


export default function Coverage(props){

    let {southZone,northZone,centralZone} = useContext(MapContext)

    useEffect(() => {

        const renderer = {
            type: "simple",
            symbol:{
                type: "simple-fill", 
                color: [ 0,168, 132, 0.7 ],
                style: "solid",
                outline: {  
                    color: "white",
                    width: 0.1
                  }
    
              }
          };

          southZone.renderer = renderer  
          northZone.renderer = renderer
          centralZone.renderer = renderer
    },[])
    return null
}