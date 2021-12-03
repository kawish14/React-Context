import React from 'react';

export default class LayerViews extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            southLayerViewCPE:null,
            northLayerViewCPE:null,
            centralLayerViewCPE:null

        }
    }

    componentDidMount(){

        let _this = this
        let view = this.props.view

    
        let customerLoading = this.props.customerLoading
        if(customerLoading){
            console.log("Loading...")
        }
        else{
            
            let southCustomerLayerView = this.props.southCustomerLayerView.customer.data

                    
            southCustomerLayerView.when(function(){
                view.whenLayerView(southCustomerLayerView).then(function (layerView) {
                    
                    _this.props.southLayerViewCPE(layerView)

                })
            })
        }

        
        let northCustomerLoading = this.props.northCustomerLoading
        if(northCustomerLoading){
            console.log("Loading..")
        }
        else{
            let northCustomerLayerView  = this.props.northCustomerLayerView.northCustomer.data

            northCustomerLayerView.when(function(){
                view.whenLayerView(northCustomerLayerView).then(function (layerView) {
    
                    _this.props.northLayerViewCPE(layerView)
    
                })
            })
        }

        let centralCustomerLayerView = this.props.centralCustomerLayerView.centerCustomer.data


     

        centralCustomerLayerView.when(function(){
            view.whenLayerView(centralCustomerLayerView).then(function (layerView) {

                _this.props.centralLayerViewCPE(layerView)

            })
        })
    }
    render(){
        return null
    }
}