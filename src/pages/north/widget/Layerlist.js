import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';
import './css/layerlist.css'

export default class Layerlist extends React.Component{

    componentDidMount() {

        let northCustomerLabel = this.props.northCustomerLabel.northCustomer.data
        let northPOP = this.props.northPOP.northPOP.data
        let northFeeder = this.props.northFeeder.northFeeder.data
        let northDistribution = this.props.northDistribution.northDistribution.data
        let northJoint = this.props.northJoint.northJoint.data
        let northDC = this.props.northDC.northDC.data
        let northFAT = this.props.northFAT.northFAT.data

        const northZone = this.props.northZone.northZone.data


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

                            if (item.title === "North POP") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label POP",
                                            className: "esri-icon-labels",
                                            id: "label-south-pop"
                                        }
                                    ]
                                ]
                            }
                            if (item.title === "North Zone") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label Zone",
                                            className: "esri-icon-labels",
                                            id: "label-north-Zone"
                                        }
                                    ]
                                ]
                            }
                            if (item.title === "North ODB/DC") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label DC",
                                            className: "esri-icon-labels",
                                            id: "label-north-DC"
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
                    
                    if (id === "label-south-pop") {

                        if (northPOP.labelsVisible === false) {

                            northPOP.labelsVisible = true

                        }
                        else {

                            northPOP.labelsVisible = false
                        }
                      
                    }
                    if (id === "label-north-DC") {

                        if (northDC.labelsVisible === false) {

                            northDC.labelsVisible = true

                        }
                        else {

                            northDC.labelsVisible = false
                        }
                      
                    }
                    if (id === "label-north-Zone") {

                        if (northZone.labelsVisible === false) {

                            northZone.labelsVisible = true

                        }
                        else {

                            northZone.labelsVisible = false
                        }
                      
                    }
                    
                }) 

                var FiberLayer = new GroupLayer({
                    title:"North OFC",
                    layers:[northFeeder,northDistribution]
                })
                var ISB_Layers = new GroupLayer({
                    title: "ISB Layers",
                    layers: [northZone,FiberLayer,northDC,northFAT,northJoint,northPOP,northCustomerLabel],
                  });

                  var north_Layer =  new GroupLayer({
                    title: "North Layer",
                    layers: [ISB_Layers],
                  });
                map.add(north_Layer)
            })

            
    }
    render(){

        return null
    }
}