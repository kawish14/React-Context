import React from 'react';
import MapContext from '../../context/mapContext';

export default class CentralPOP extends React.Component {
    static contextType = MapContext
    componentDidMount() {
        let context = this.context.view
        let centralPOPLayer = context.centralPOP

        let labelClassZone = {
            symbol: {
                type: "text",  
                color: "white",
                haloColor: "black",
                haloSize: 1,
                font: {  
                    family: "Playfair Display",
                    size: 10,
                    weight: "bold"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: `$feature.name + " - " + $feature.id`
            }
        }

        var symbol = {
            type: "picture-marker", 
            url: "images/pins/default.png", 
            width: "20px",
            height: "20px"
        };

        const POPrender = {
            type: "simple", 
            symbol: symbol,
        };

       centralPOPLayer.renderer = POPrender
       centralPOPLayer.labelingInfo = labelClassZone
        
    }
    render() {
        return null
    }
}