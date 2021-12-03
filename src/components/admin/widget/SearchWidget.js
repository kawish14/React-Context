import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';

export default class SearchWidget extends React.Component{

    componentDidMount() {
        let customerLayer 
        let northCustomerLayer

        let customerLoading = this.props.customerLoading
        if(customerLoading){
            console.log("Loading...")
        }
        else{
            customerLayer = this.props.customerSearch.customer.data
        }

        let centralCustomerLayer = this.props.centralCustomerSearch.centerCustomer.data

 
        let northCustomerLoading = this.props.northCustomerLoading
        if(northCustomerLoading){
            console.log("Loading..")
        }
        else{
            northCustomerLayer = this.props.northCustomerSearch.northCustomer.data
        }

        //let dcLayer = this.props.dcSearch.dc.data

        let view = this.props.view
        let map = this.props.map

        loadModules(['esri/widgets/Expand','esri/widgets/LayerList', "esri/layers/GeoJSONLayer",
            "esri/widgets/Search"], { css: false })
            .then(([ Expand, LayerList,GeoJSONLayer,Search]) => {
                let source = [
                    {
                        layer: customerLayer,
                        searchFields: ["id", "name"],
                        displayField: "id",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "South Customers",
                        placeholder: "210305138",
                        scale: 10,
                        maxResults: 6,
                        maxSuggestions: 6,
                        minSuggestCharacters: 0,
                        resultSymbol: {
                            type: "simple-marker",
                            color: [239, 25, 25],
                            size: 10,
                            width: 30,
                            height: 30,
                            xoffset: 0,
                            yoffset: 0
                        }
                    },
                    {
                        layer: centralCustomerLayer,
                        searchFields: ["id"],
                        displayField: "id",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "Central Customers",
                        placeholder: "420106139",
                        scale: 10,
                        maxResults: 6,
                        maxSuggestions: 6,
                        minSuggestCharacters: 0,
                        resultSymbol: {
                            type: "simple-marker",
                            color: [239, 25, 25],
                            size: 10,
                            width: 30,
                            height: 30,
                            xoffset: 0,
                            yoffset: 0
                        }
                    },
                    {
                        layer: northCustomerLayer,
                        searchFields: ["id"],
                        displayField: "id",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "North Customers",
                        placeholder: "510105526",
                        scale: 10,
                        maxResults: 6,
                        maxSuggestions: 6,
                        minSuggestCharacters: 0,
                        resultSymbol: {
                            type: "simple-marker",
                            color: [239, 25, 25],
                            size: 10,
                            width: 30,
                            height: 30,
                            xoffset: 0,
                            yoffset: 0
                        }
                    }
                ]
                var searchWidget = new Expand({
                    content: new Search({
                        view: view,
                        popupEnabled: true,
                        includeDefaultSources: true,
                        searchAllEnabled: false,
                        sources: [],
                    }),
                    view: view,
                    group: "bottom-right",
                    expanded: false
                });

                view.ui.add(searchWidget, "top-right");
                searchWidget.content.sources = source
            })
    }
    render(){

        return null
    }
}