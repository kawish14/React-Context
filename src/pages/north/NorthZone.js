import React, {useContext,useEffect,useState} from 'react'
import mapContext from '../../context/mapContext'

export default function NorthZone(props){

    let context = useContext(mapContext)

    useEffect(() => {

        const zoneLayer = context.view.northZone

        let labelClassZone = {
            symbol: {
                type: "text",  
                color: "white",
                haloColor: "black",
                haloSize: 1,
                font: {  
                    family: "Playfair Display",
                    size: 8,
                    weight: "bold"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: `$feature.cluster`
            }
        }

        var rendererCheck = {
            type: "unique-value", 
            field: "zone",
            uniqueValueInfos: [
                {
                    value: "Zone 1",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 200,133, 68, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.5
                          }
                    }
                },  {
                    value: "Zone 2",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 255,170, 0, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                },  {
                    value: "Zone 3",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 197,135, 243, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                },  {
                    value: "Zone 4",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 0,168, 132, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                }, {
                    value: "Zone 5",
                    symbol: {
                        type: "simple-fill", 
                        color: [ 16,51, 222, 0.7 ],
                        style: "solid",
                        outline: {  
                            color: "white",
                            width: 0.1
                          }
                    }
                }]
        };


        zoneLayer.renderer =rendererCheck
        zoneLayer.labelingInfo = labelClassZone
        
       // zoneLayer.visible = true;
        
        zoneLayer.legendEnabled = true
        
        
    })
    
    return null
}