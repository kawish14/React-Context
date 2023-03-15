import React, {useContext, useState, useEffect } from 'react';
import mapContext from '../../context/mapContext';

export default function SouthBackhaul() {

    let context = useContext(mapContext);

    useEffect(() => {

        let southBackhaul = context.view.southBackhaul
        
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

          southBackhaul.renderer = symbol

    },[])
 
        return null
    
}