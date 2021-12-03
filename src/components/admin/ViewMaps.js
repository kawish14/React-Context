import React from 'react'

export default class ViewMaps extends React.Component{

componentDidMount(){

    let view = this.props.view
    let customerLayer = this.props.south.customer.data
    let customerLayerNorth = this.props.north.northCustomer.data
    let customerLayerCentral = this.props.center.centerCustomer.data
    
        view.on('click', function(event){
                
            view.hitTest(event)
            .then(function(response){
                    response.results.filter(function(result){

                    //console.log(result.graphic)

                    if(result.graphic.sourceLayer.title === "vehicle") {
                        return true
                    }
                    
                    else if (result.graphic.layer.title === "South Customer"){
                    const olt = result.graphic.attributes.olt
                    const slot = result.graphic.attributes.slot
                    const port = result.graphic.attributes.port
                    const ontid = result.graphic.attributes.ontid
                 
                        fetch(`http://gponassistant.tes.com.pk:8000/ontrx/${olt}/${slot}/${port}/${ontid}/`)
                        .then(response => {
                            if(response.ok){
                                return response
                            }
                            else{
                                var error = new Error('Error' + response.status + ':' + response.statusText)
                                error.response = response
                                throw error
                            }
                        },error => {
                            var errmess = new Error(error.message)
                            throw errmess
                        })
                        .then(response => response.json())
                        .then(power => {
                                                   
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
                                    },{
                                        fieldName: "alarminfo",
                                        visible: true,
                                        label: "Alarm Info",
                                    },{
                                        fieldName: "bandwidth",
                                        visible: true,
                                        label: "Bandwidth",
                                    }, {
                                        fieldName: "lastuptime",
                                        visible: true,
                                        label: "Last-UP-Time",
                        
                                    },{
                                        fieldName: "lastdowntime",
                                        visible: true,
                                        label: "Last-Down-Time",
                        
                                    }]
                                },{
                                    type: "text",
                                    text:` ONT Rx Power: ${power.ontrx.bold()} dBm`
                                  }]
                              };
    
                                customerLayer.popupTemplate = popupTemplate;
                            
    
                        })
                        .catch(err => {
                            console.log(err)
                        })

                    }
                    
                    else if(result.graphic.layer.title === "North Customer") {
    
                    const olt = result.graphic.attributes.olt
                    const slot = result.graphic.attributes.slot
                    const port = result.graphic.attributes.port
                    const ontid = result.graphic.attributes.ontid
                 
                        fetch(`http://gponassistant.tes.com.pk:8000/ontrx/${olt}/${slot}/${port}/${ontid}/`)
                        .then(response => {
                            if(response.ok){
                                return response
                            }
                            else{
                                var error = new Error('Error' + response.status + ':' + response.statusText)
                                error.response = response
                                throw error
                            }
                        },error => {
                            var errmess = new Error(error.message)
                            throw errmess
                        })
                        .then(response => response.json())
                        .then(power => {
    
                                                   
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
                                    },{
                                        fieldName: "alarminfo",
                                        visible: true,
                                        label: "Alarm Info",
                                    },{
                                        fieldName: "bandwidth",
                                        visible: true,
                                        label: "Bandwidth",
                                    }, {
                                        fieldName: "lastuptime",
                                        visible: true,
                                        label: "Last-UP-Time",
                        
                                    },{
                                        fieldName: "lastdowntime",
                                        visible: true,
                                        label: "Last-Down-Time",
                        
                                    }]
                                },{
                                    type: "text",
                                    text:` ONT Rx Power: ${power.ontrx.bold()} dBm`
                                  }]
                              };
    
                                customerLayerNorth.popupTemplate = popupTemplate;
                            
                        })
                        .catch(err => {
                            console.log(err)
                        }) 
                        
                    }
                    else if(result.graphic.layer.title === "Central Customer") {
                    const olt = result.graphic.attributes.olt
                    const slot = result.graphic.attributes.slot
                    const port = result.graphic.attributes.port
                    const ontid = result.graphic.attributes.ontid
                 
                        fetch(`http://gponassistant.tes.com.pk:8000/ontrx/${olt}/${slot}/${port}/${ontid}/`)
                        .then(response => {
                            if(response.ok){
                                return response
                            }
                            else{
                                var error = new Error('Error' + response.status + ':' + response.statusText)
                                error.response = response
                                throw error
                            }
                        },error => {
                            var errmess = new Error(error.message)
                            throw errmess
                        })
                        .then(response => response.json())
                        .then(power => {
    
                                                   
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
                                    },{
                                        fieldName: "alarminfo",
                                        visible: true,
                                        label: "Alarm Info",
                                    },{
                                        fieldName: "bandwidth",
                                        visible: true,
                                        label: "Bandwidth",
                                    }, {
                                        fieldName: "lastuptime",
                                        visible: true,
                                        label: "Last-UP-Time",
                        
                                    },{
                                        fieldName: "lastdowntime",
                                        visible: true,
                                        label: "Last-Down-Time",
                        
                                    }]
                                },{
                                    type: "text",
                                    text:` ONT Rx Power: ${power.ontrx.bold()} dBm`
                                  }]
                              };
                                
                            customerLayerCentral.popupTemplate = popupTemplate;
                            
    
                        })
                        .catch(err => {
                            console.log(err)
                        }) 

                    }
                    
                return null

                })
                
            })
        }) 
    


}
    render(){
        return null
    }
}