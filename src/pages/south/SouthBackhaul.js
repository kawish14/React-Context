import React, {useContext, useState, useEffect } from 'react';
import mapContext from '../../context/mapContext';

export default function SouthBackhaul() {

    let context = useContext(mapContext);

    useEffect(() => {

        let southBackhaul = context.view.southBackhaul
        const wf_status = "$feature.own"

        const valueExpression = `When( ${wf_status} == 'TES', 'TES', ${wf_status} == 'IRU', 'IRU', 'other' )`
        
        var rendererCheck = {
            type: "unique-value",  // autocasts as new UniqueValueRenderer()
            valueExpression:valueExpression,
            uniqueValueInfos: [
                {
                    value: "TES", //02F AsBuilt
                    symbol: {
                        type: "simple-line",  
                        color: "blue",
                        width: "3px",
                        style: "solid"
                      }
                }, {
                    value: "IRU", // 04F AsBuilt
                    symbol: {
                        type: "simple-line",  
                        color: "yellow",
                        width: "3px",
                        style: "solid"
                      }
                },
                {
                    value: "other", // 04F AsBuilt
                    symbol: {
                        type: "simple-line",  
                        color: "white",
                        width: "3px",
                        style: "solid"
                      }
                }
            ]
        }
    
          southBackhaul.renderer = rendererCheck

    },[])
 
        return null
    
}