import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';
import { Row, Col,Container,Button, Card, CardHeader, CardBody, Badge } from 'reactstrap';
setDefaultOptions({ version: '4.16' })

export default class DC extends React.Component{

    componentDidMount(){

        let dcLayer = this.props.item.dc.data
        
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

                    value: "Status-AsBuilt", 
                    symbol: {
                        type: "picture-marker",  
                        url: "images/DC.png", 
                        width: "30px",
                        height: "15px"
                    }
                },
                 /************************  Design Network ***********************/
                {

                    value: "Status-Design", 
                    symbol:{
                        type: "picture-marker",  
                        url: "images/dc1.png", 
                        width: "24px",
                        height: "17px"
                    }
                }
            ]
        };
        
        let labelClassDC = {
            symbol: {
                type: "text",  // autocasts as new TextSymbol()
                color: "white",
                haloColor: "black",
                haloSize: 2,
                font: {  // autocast as new Font()
                    family: "Playfair Display",
                    size: 10,
                    weight: "bold"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: `$feature.id`
            }
        }

        dcLayer.renderer = rendererCheck
        dcLayer.labelingInfo = labelClassDC
     
        
    }


    render(){
        return null
    }
      
}