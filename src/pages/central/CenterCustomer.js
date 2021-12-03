import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://172.29.100.28:5000"; 

export default class CenterCustomer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: [],
            Online:null,
            DyingGasp:null,
            centralLOSWeek:null,
            centralLOSOld:null,
            GEMPack:null,
            LOP:null
        }

    }
    componentDidMount(){
        let _this = this

        let customerLayer = this.props.item.centerCustomer.data
        let loginRole = this.props.loginRole.data.role

        
        let view = this.props.view
        let map = this.props.map

        let dates = new Date()

        let lastSevenDays = new Date(dates)
        lastSevenDays.toDateString()
        lastSevenDays.setDate(lastSevenDays.getDate() -7)


        let year = lastSevenDays.getFullYear()
    
        let month = (date) => {
            const m = date.getMonth() + 1;
            if (m.toString().length === 1) {
                return `0${m}`;
            } else {
                return m;
            }
        }
        let date =  ('0' + lastSevenDays.getDate()).slice(-2)
        
        let complete_date = year + '-' + month(lastSevenDays) + '-' + date
        
        const name = "$feature.alarmstate"
        const cat = "$feature.category"
        const week = "$feature.lastdowntime"

        const valueExpression = `When( ${name} == 0 && ${cat} == 'VIP', 'zero', ${name} == 1 && ${cat} == 'VIP', 'one',
            ${name} == 2 && ${cat} == 'VIP' && ${week} >= '${complete_date}', 'two',
            ${name} == 2 && ${cat} == 'VIP' && ${week} <= '${complete_date}', 'two_1',
            ${name} == 2 && ${cat} != 'VIP' && ${week} <= '${complete_date}', 'two_1_not_vip',
            ${name} == 3 && ${cat} == 'VIP', 'three', 
            ${name} == 4 && ${cat} == 'VIP', 'four', 
            ${name} == 0 && ${cat} != 'VIP', 0,
            ${name} == 1 && ${cat} != 'VIP', 1,
            ${name} == 2 && ${cat} != 'VIP' && ${week} >= '${complete_date}', 2,
            ${name} == 3 && ${cat} != 'VIP', 3,
            ${name} == 4 && ${cat} != 'VIP', 4, 5)`

        var rendererCheck = {
            type: "unique-value", 
            valueExpression:valueExpression,
            uniqueValueInfos: [
                {
                    value: "zero",
                    symbol: {
                        type: "picture-marker", 
                        url: "images/zero.png",
                        color: "red",
                        width: "29px",
                        height: "29px"
                    }
                },  {
                    value: "one",
                    symbol: {
                        type: "picture-marker", 
                        url: "images/one.png",
                        color: "red",
                        width: "34px",
                        height: "34px"
                    }
                },  {
                    value: "two",
                    symbol: {
                        type: "picture-marker", 
                        url: "images/two.png",
                        color: "red",
                        width: "34px",
                        height: "34px"
                    }
                },{
                    value: "two_1",
                    symbol: {
                        type: "picture-marker", 
                        url: "images/two_1.png",
                        color: "red",
                        width: "34px",
                        height: "34px"
                    }
                },  {
                    value: "three",
                    symbol: {
                        type: "picture-marker", 
                        url: "images/three.png",
                        color: "red",
                        width: "30px",
                        height: "30px"
                    }
                },  {
                    value: "four",
                    symbol: {
                        type: "picture-marker", 
                        url: "images/four.png",
                        color: "red",
                        width: "30px",
                        height: "30px"
                    }
                }, {

                    value: "0",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: "green",
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                }, {

                    value: "1",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: "blue",
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                }, {

                    value: "2",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: "red",
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                }, {

                    value: "3",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: "black",
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                },{
                    value: "two_1_not_vip",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: [ 255, 170, 0,],
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                },  {

                    value: "4",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: "yellow",
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                }, {

                    value: "5",
                    symbol: {
                        type: "simple-marker", 
                        style: "circle",
                        color: "white",
                        size: "8px",
                        outline: { 
                            color: [ 255, 255, 255, 1 ],
                            width: 0.4
                          }
                    }
                }
            ]
        };


            view.when(async function(){
                
                let centralLOSWeek = customerLayer.createQuery();
                let centralLOSOld = customerLayer.createQuery();
                let centralOnline = customerLayer.createQuery();
                let centralDyingGasp = customerLayer.createQuery();
                let centralGEMPack = customerLayer.createQuery();
                let centralLOP = customerLayer.createQuery();

            // LOS Week
            centralLOSWeek.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime >= '${complete_date}'`
            await customerLayer.queryFeatures(centralLOSWeek)
                .then(function(response){
                    _this.setState({
                        centralLOSWeek:response.features.length
                    })
                        _this.props.centralCPEstatus(_this.state)
                });
            
            // LOS OLD
            centralLOSOld.where = `alarmstate = 2 AND status = 'Active' AND lastdowntime <= '${complete_date}'`
            await customerLayer.queryFeatures(centralLOSOld)
                .then(function(response){
                    _this.setState({
                        centralLOSOld:response.features.length
                    })
                        _this.props.centralCPEstatus(_this.state)
                });

                // Online
                centralOnline.where = "alarmstate = 0 AND status = 'Active'"
              await  customerLayer.queryFeatures(centralOnline)
                .then(function(response){
                    _this.setState({
                        Online:response.features.length
                    })
                    _this.props.centralCPEstatus(_this.state)
                });

                 // Gying Gasp
                 centralDyingGasp.where = "alarmstate = 1 AND status = 'Active'"
               await  customerLayer.queryFeatures(centralDyingGasp)
                 .then(function(response){
                     _this.setState({
                        DyingGasp:response.features.length
                     })
                     _this.props.centralCPEstatus(_this.state)
                 });

                // GEMPack
                centralGEMPack.where = "alarmstate = 3 AND status = 'Active'"
               await customerLayer.queryFeatures(centralGEMPack)
                .then(function(response){
                    _this.setState({
                        GEMPack:response.features.length
                    })
                    _this.props.centralCPEstatus(_this.state)
                });

                 // LOP
                 centralLOP.where = "alarmstate = 4 AND status = 'Active'"
                await customerLayer.queryFeatures(centralLOP)
                 .then(function(response){
                     _this.setState({

                        LOP:response.features.length
                     })

                    _this.props.centralCPEstatus(_this.state)
                     
                 });

            })
        

        var queryExpression = "alarmstate = 2 AND status = 'Active'"
        customerLayer.definitionExpression = queryExpression

        customerLayer.visible = true;
    
        customerLayer.legendEnabled = false
        customerLayer.renderer =rendererCheck
        
        
}
    render(){
        return null
    }
}