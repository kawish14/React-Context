import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';

setDefaultOptions({ version: '4.16' })

export default class NorthPOP extends React.Component {

    componentDidMount() {

        let northOPLayer = this.props.item.northPOP.data
        
        let view = this.props.view
        let map = this.props.map

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

       northOPLayer.renderer = POPrender
       northOPLayer.labelingInfo = labelClassZone
        
    }
    render() {
        return null
    }
}