import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';
import './css/layerlist.css'

export default class Layerlist extends React.Component{

    componentDidMount() {

        let centralCustomerLabel = this.props.centralCustomerLabel.centerCustomer.data
        let centralPOP = this.props.centralPOP.centralPOP.data
        let centralZone = this.props.centralZone.centralZone.data
        let centralFeeder = this.props.centralFeeder.centralFeeder.data
        let centralDistribution = this.props.centralDistribution.centralDistribution.data
        let centralDC = this.props.centralDC.centralDC.data
        let centralFat = this.props.centralFat.centralFat.data
        let centralJoint = this.props.centralJoint.centralJoint.data

        let view = this.props.view
        let map = this.props.map

        loadModules(['esri/widgets/Expand','esri/widgets/LayerList',"esri/layers/GroupLayer"], { css: false })
            .then(([ Expand, LayerList,GroupLayer]) => {

                let layerlist = new Expand({
                    content: new LayerList({
                        view: view,
                        style: "classic",
                        statusIndicatorsVisible: false,
                        listItemCreatedFunction: function (event) {
                            let item = event.item

                            if (item.title === "Central POP") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label POP",
                                            className: "esri-icon-labels",
                                            id: "label-central-pop"
                                        }
                                    ]
                                ]
                            }
                            if (item.title === "Central Zone") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label Zone",
                                            className: "esri-icon-labels",
                                            id: "label-central-Zone"
                                        }
                                    ]
                                ]
                            }
                            if (item.title === "Central ODB/DC") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label DC",
                                            className: "esri-icon-labels",
                                            id: "label-central-DC"
                                        }
                                    ]
                                ]
                            }
                           

                        }
                    }),
                    view: view,
                    group: "bottom-right",
                    expanded: false,
                })

                view.ui.add(layerlist, 'top-right')

                layerlist.content.on("trigger-action", function (event) {
                 
                    var id = event.action.id;
                    
                    if (id === "label-central-pop") {

                        if (centralPOP.labelsVisible === false) {

                            centralPOP.labelsVisible = true

                        }
                        else {

                            centralPOP.labelsVisible = false
                        }
                      
                    }
                    if (id === "label-central-Zone") {

                        if (centralZone.labelsVisible === false) {

                            centralZone.labelsVisible = true

                        }
                        else {

                            centralZone.labelsVisible = false
                        }
                      
                    }
                    if (id === "label-central-DC") {

                        if (centralDC.labelsVisible === false) {

                            centralDC.labelsVisible = true

                        }
                        else {

                            centralDC.labelsVisible = false
                        }
                      
                    }
                })

                var FiberLayer = new GroupLayer({
                    title:"Central OFC",
                    layers:[centralFeeder,centralDistribution]
                })

                var LHR_Layers = new GroupLayer({
                    title: "LHR Layers",
                    layers: [centralZone,FiberLayer,centralDC,centralFat,centralJoint,centralPOP,centralCustomerLabel],
                  });

                  var central_Layer =  new GroupLayer({
                    title: "Central Layer",
                    layers: [LHR_Layers],
                  });
                  
                map.add(central_Layer)
            })

            
    }
    render(){

        return null
    }
}