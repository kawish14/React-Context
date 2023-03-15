import React, { useState, useEffect } from 'react';

function CSDCoverage (props) {

    useEffect(() => {

        let centralCoverage = props.centralCoverage.centralCoverage.data
        let northCoverage = props.northCoverage.northCoverage.data
        let southZone = props.southZone.southZone.data

        centralCoverage.visible = true
        northCoverage.visible = true
        southZone.visible = true

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

          centralCoverage.renderer = renderer
          centralCoverage.legendEnabled = true

          southZone.renderer = renderer
          southZone.legendEnabled = true


          var northRenderer = {

            type: "unique-value", 
            field: "wf_status",
            uniqueValueInfos: [
                {
                    value: "Built",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 0,168, 132, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                },  {
                    value: "Not Built",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 255,0, 0, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                },  {
                    value: "Partially Built",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 255,255, 0, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                }]
            };

          northCoverage.renderer = northRenderer
          northCoverage.legendEnabled = true

    })

    return null
}

export default CSDCoverage