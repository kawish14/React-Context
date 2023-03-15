import React from 'react';
import MapContext from '../../context/mapContext';

export default class CentralFAT extends React.Component {
    static contextType = MapContext
    componentDidMount() {
        let context = this.context.view
        
        let fatLayer = context.centralFAT

        const wf_status = "$feature.wf_status"

        const valueExpression = `When (${wf_status} == 0 , 'Status-AsBuilt' ,${wf_status} == 1 , 'Status-Design','none')`

        var rendererCheck = {
            type: "unique-value",  // autocasts as new UniqueValueRenderer()
            valueExpression:valueExpression,
            uniqueValueInfos: [
                /************************  As Built Network ***********************/
                {

                    value: "Status-AsBuilt", //02F AsBuilt
                    symbol: {
                        type: "picture-marker",  
                        url: "images/pink_fat.png", 
                        width: "16px",
                        height: "16px"
                    }
                },
                 /************************  Design Network ***********************/
                {

                    value: "Status-Design", //02F Design
                    symbol:{
                        type: "picture-marker",  
                        url: "images/black_fat.png", 
                        width: "16px",
                        height: "16px"
                    }
                }
            ]
        };
        
        let labelClassFAT = {
 
            symbol: {
                type: "text",
                color: "black",
                haloColor: "white",
                haloSize: 1,
                font: {
                    family: "Arial",
                    size: 8,
                    weight: "bold"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: `$feature.name + " - " + $feature.id`
            }
        }

        fatLayer.renderer = rendererCheck;
        fatLayer.labelingInfo = labelClassFAT
 
    }
    render() {
        return null
    }
}