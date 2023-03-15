import React from 'react';
import mapContext from '../../context/mapContext';

export default class NorthPOP extends React.Component {

    static contextType = mapContext

    componentDidMount() {

        let context = this.context

        let northOPLayer = context.view.northPOP
        
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