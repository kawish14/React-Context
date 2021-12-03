import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';
import './css/layerlist.css'

export default class Layerlist extends React.Component{

    componentDidMount() {


        let customerLabel = this.props.customerLabel.customer.data
        let centralCustomerLabel = this.props.centralCustomerLabel.centerCustomer.data
        let northCustomerLabel = this.props.northCustomerLabel.northCustomer.data

        let southZone = this.props.southZone.southZone.data;
        let centralCoverage = this.props.centralCoverage.centralCoverage.data
        let northCoverage = this.props.northCoverage.northCoverage.data
        

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

                           if (item.title === "South Layer") {
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

                            if (item.title === "North Layer") {
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

                            if (item.title === "Central Layer") {
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
       
                        }
                    }),
                    view: view,
                    group: "bottom-right",
                    expanded: false,
                })

                view.ui.add(layerlist, 'top-right')

                layerlist.content.on("trigger-action", function (event) {
                 
                    var id = event.action.id;
                    
                     if (id === "full-extent KHI") {
     
                        view.goTo({
                            target:[67.154842,24.803798],
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
                            target:[74.40249,31.475721],
                            zoom:11
                        })
                        .catch(function(error){
                          if (error.name != "AbortError"){
                            console.error(error);
                          }
                        });
                      }

                }) 


                var south_Layer =  new GroupLayer({
                title: "South Layer",
                layers: [southZone, customerLabel],
                });

                var north_Layer =  new GroupLayer({
                title: "North Layer",
                layers: [northCoverage,northCustomerLabel],
                });

                var central_Layer =  new GroupLayer({
                title: "Central Layer",
                layers: [centralCoverage,centralCustomerLabel],
                });

                map.addMany([south_Layer,north_Layer,central_Layer])
            })

            
    }
    render(){

        return null
    }
}