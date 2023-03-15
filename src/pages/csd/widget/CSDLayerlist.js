import React from 'react';
import mapContext from '../../../context/mapContext';
import { loadModules, setDefaultOptions } from 'esri-loader';
import './css/layerlist.css'

let south_Layer = {}

export default class CSDLayerlist extends React.Component{
    static contextType = mapContext
    constructor(props) {
        super(props);
        this.layerLists = React.createRef();
      }

    componentDidMount() {

        let {southCPELayer,southDC,southFAT,southJoint,southPOP,southDistribution,southFeeder,southZone,
            northCPELayer,northDC,northFAT,northJoint,northPOP,northDistribution,northFeeder,northZone,
            centralCPELayer,centralDC,centralFAT,centralJoint,centralPOP,centralDistribution,centralFeeder,
            centralZone, province, cities
        } = this.context.view
    
        let view = this.props.view

        loadModules(['esri/widgets/Expand','esri/widgets/LayerList',"esri/layers/GroupLayer"], { css: false })
            .then(([ Expand, LayerList,GroupLayer]) => {

                let layerlist = new Expand({
                    content: new LayerList({
                        view: view,
                        container: this.layerLists.current,
                        style: "classic",
                        statusIndicatorsVisible: false,
                        listItemCreatedFunction: function (event) {
                            let item = event.item
                            if (item.title === "KHI Layers") {
                                item.actionsSections = [
                                    [
                                        {
                                          title: "Go to full extent",
                                          className: "esri-icon-zoom-out-fixed",
                                          id: "full-extent KHI"
                                        }
                                      ]
                                ]
                            }

                            if (item.title === "ISB Layers") {
                                item.actionsSections = [
                                    [
                                        {
                                          title: "Go to full extent",
                                          className: "esri-icon-zoom-out-fixed",
                                          id: "full-extent ISB"
                                        }
                                      ]
                                ]
                            }

                            if (item.title === "LHR Layers") {
                                item.actionsSections = [
                                    [
                                        {
                                          title: "Go to full extent",
                                          className: "esri-icon-zoom-out-fixed",
                                          id: "full-extent LHR"
                                        }
                                      ]
                                ]
                            }

                            if (item.title === "South Zone") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label Zone",
                                            className: "esri-icon-labels",
                                            id: "label-Zone"
                                        }
                                    ]
                                ]
                            }

                            if (item.title === "North Zone") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label North Zone",
                                            className: "esri-icon-labels",
                                            id: "label-north-Zone"
                                        }
                                    ]
                                ]
                            }
                            if (item.title === "Central Zone") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label Central Zone",
                                            className: "esri-icon-labels",
                                            id: "label-central-Zone"
                                        }
                                    ]
                                ]
                            }

                            if (item.title === "FAT") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label FAT",
                                            className: "esri-icon-labels",
                                            id: "label-FAT"
                                        }
                                    ]
                                ]
                            }

                            if (item.title === "POP") {
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

                            if (item.title === "North POP") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label North POP",
                                            className: "esri-icon-labels",
                                            id: "label-north-pop"
                                        }
                                    ]
                                ]
                            }
                            if (item.title === "Central POP") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label Central POP",
                                            className: "esri-icon-labels",
                                            id: "label-central-pop"
                                        }
                                    ]
                                ]
                            }

                            if (item.title === "South ODB/DC") {
                                item.actionsSections = [
                                    [
                                        {
                                            title: "Label DC",
                                            className: "esri-icon-labels",
                                            id: "label-south-DC"
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

                layerlist.content.on("trigger-action", function (event) {
                 
                    var id = event.action.id;

                    if (id === "full-extent KHI") {
     
                        view.goTo({
                            target:[67.233635,24.905977],
                            zoom:11
                        })
                        .catch(function(error){
                          if (error.name != "AbortError"){
                            console.error(error);
                          }
                        });
                    }
                    
                    if (id === "full-extent ISB") {
     
                        view.goTo({
                            target:[73.127233,33.529393],
                            zoom:11
                        })
                        .catch(function(error){
                          if (error.name != "AbortError"){
                            console.error(error);
                          }
                        });
                    } 

                    if (id === "full-extent LHR") {
     
                        view.goTo({
                            target:[74.355626,31.545676],
                            zoom:11
                        })
                        .catch(function(error){
                          if (error.name != "AbortError"){
                            console.error(error);
                          }
                        });
                    }

                    if (id === "label-Zone") {

                        if (southZone.labelsVisible === false) {

                            southZone.labelsVisible = true

                        }
                        else {

                            southZone.labelsVisible = false
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

                    if (id === "label-central-Zone") {

                        if (centralZone.labelsVisible === false) {

                            centralZone.labelsVisible = true

                        }
                        else {

                            centralZone.labelsVisible = false
                        }
                      
                    }

                    if (id === "label-south-pop") {

                        if (southPOP.labelsVisible === false) {

                            southPOP.labelsVisible = true

                        }
                        else {

                            southPOP.labelsVisible = false
                        }
                    }

                    if (id === "label-north-pop") {

                        if (northPOP.labelsVisible === false) {

                            northPOP.labelsVisible = true

                        }
                        else {

                            northPOP.labelsVisible = false
                        }
                      
                    }

                    if (id === "label-central-pop") {

                        if (centralPOP.labelsVisible === false) {

                            centralPOP.labelsVisible = true

                        }
                        else {

                            centralPOP.labelsVisible = false
                        }
                      
                    }

                    if (id === "label-south-DC") {

                        if (southDC.labelsVisible === false) {

                            southDC.labelsVisible = true

                        }
                        else {

                            southDC.labelsVisible = false
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

                    if (id === "label-central-DC") {

                        if (centralDC.labelsVisible === false) {

                            centralDC.labelsVisible = true

                        }
                        else {

                            centralDC.labelsVisible = false
                        }
                      
                    }
                }) 


                var KHI_Layers = new GroupLayer({
                    title: "KHI Layers",
                    layers: [southZone,southCPELayer,southPOP],
                  });


                var ISB_Layers = new GroupLayer({
                title: "ISB Layers",
                layers: [northZone,northCPELayer,northPOP],
                });

                var LHR_Layers = new GroupLayer({
                title: "LHR Layers",
                layers: [centralZone,centralCPELayer,centralPOP],
                });

              south_Layer =  new GroupLayer({
                title: "South Layer",
                layers: [KHI_Layers],
                });

            var north_Layer =  new GroupLayer({
                title: "North Layer",
                layers: [ISB_Layers],
                });

            
            var central_Layer =  new GroupLayer({
                title: "Central Layer",
                layers: [LHR_Layers],
                });

               // view.map.add(cities)
                view.map.add(province)

                view.map.add(south_Layer)
                view.map.add(north_Layer)
                view.map.add(central_Layer)

            })

    }
    /* componentWillUnmount(){

        this.props.map.remove(south_Layer)
    } */
    render(){

        return <div ref={this.layerLists}></div>
    }
}