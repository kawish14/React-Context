import React, {useContext, useState, useEffect } from 'react';
import mapContext from '../../context/mapContext';

export default function NorthBackhaul() {

    let context = useContext(mapContext);

    useEffect(() => {

        let northBackhaul = context.view.northBackhaul
        
        //const wf_status = "$feature.own"
        let symbol =  {
            type: "simple",
            symbol: {
                type: "simple-line",  
                color: "blue",
                width: "3px",
                style: "solid"
              }
        }

          northBackhaul.renderer = symbol

    },[])
 


  
        return null
    
}