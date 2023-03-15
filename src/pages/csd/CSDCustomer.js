import React from 'react';
//import socketIOClient from "socket.io-client";
import { loadModules, setDefaultOptions } from 'esri-loader';
import { authenticationService } from '../../_services/authentication';

import {version} from '../../url'
setDefaultOptions({ version: version })

export default class CSDCustomer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: [],
            Online:null,
            DyingGasp:null,
            LOS:null,
            GEMPack:null,
            LOP:null,
            intervalId:null,

        }
       
    }
    
componentDidMount(){

        let _this = this
        
        let customerLayer = this.props.item.customer.data;
        let northCustomer = this.props.northCustomer.northCustomer.data
        let centerCustomer = this.props.centerCustomer.centerCustomer.data
    
        customerLayer.visible = true;
        northCustomer.visible = true;
        centerCustomer.visible = true

        const status = "$feature.status"
        const valueExpression = `When( ${status} == 'Active', 'Active', ${status} != 'Active', 'In Active', 5)`

        var rendererCheck = {
            type: "unique-value", 
            //field: "alarminfo",
            valueExpression:valueExpression,
            uniqueValueInfos: [
                {
                    value: "Active",
                    symbol : {
                        type: "simple-marker",
                        size: 4,
                        color:"#8eff69", // "#69dcff", 
                        outline: {
                            color: "rgba(19, 174, 0, 0.5)",
                            width: 5
                        }
                    }
                },  {
                    value: "In Active",
                    symbol : {
                        type: "simple-marker",
                        size: 3,
                        color: "#ff0000",  //"#69dcff",
                        outline: {
                            color: "rgba(174, 16, 0, 0.5)",  //"rgba(0, 139, 174, 0.5)",
                            width: 5
                        }
                    }
                }
            ]
        };

        
        var popupTemplate = {
        
            title: "Customer",
            content: [
                {
                type: "fields",
                fieldInfos: [
                {
                    fieldName: "name",
                    visible: true,
                    label: "Name",
                }, {
                    fieldName: "id",
                    visible: true,
                    label: "ID",
                },{
                    fieldName: "address",
                    visible: true,
                    label: "Address",
                },{
                    fieldName: "type",
                    visible: true,
                    label: "Type",
                },{
                    fieldName: "status",
                    visible: true,
                    label: "Status",
                },{
                    fieldName: "block_phase_sector",
                    visible: true,
                    label: "Block/Phase",
                },{
                    fieldName: "area",
                    visible: true,
                    label: "Town/Area",
                },{
                    fieldName: "city",
                    visible: true,
                    label: "City",
                }, {
                    fieldName: "olt",
                    visible: true,
                    label: "OLT",
                },{
                    fieldName: "frame",
                    visible: true,
                    label: "Frame",
                },{
                    fieldName: "slot",
                    visible: true,
                    label: "Slot",
                },{
                    fieldName: "port",
                    visible: true,
                    label: "Port",
                },{
                    fieldName: "ontid",
                    visible: true,
                    label: "ONT ID",
                }, {
                    fieldName: "ontmodel",
                    visible: true,
                    label: "ONT Model",
                }]
            }]
        
        };

        //customerLayer.labelsVisible = true
        customerLayer.renderer  = rendererCheck
        customerLayer.popupTemplate = popupTemplate;

        northCustomer.renderer  = rendererCheck
        northCustomer.popupTemplate = popupTemplate;

        centerCustomer.renderer  = rendererCheck
        centerCustomer.popupTemplate = popupTemplate;
                
        
        
 
}

    render(){
        return null
    }
}