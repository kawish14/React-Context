import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';

setDefaultOptions({ version: '4.16' })

export default class NorthFAT extends React.Component {

    componentDidMount() {
        let fatLayer = this.props.item.northFAT.data
        
        let view = this.props.view
        let map = this.props.map

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