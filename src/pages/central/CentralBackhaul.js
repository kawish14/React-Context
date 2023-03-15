import React, {useContext, useState, useEffect } from 'react';
import mapContext from '../../context/mapContext';

export default function CentralBackhaul() {

    let context = useContext(mapContext);

    useEffect(() => {

        let centralBackhaul = context.view.centralBackhaul
        
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

        centralBackhaul.renderer = symbol

    },[])
 


  
        return null
    
}