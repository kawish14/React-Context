import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';

setDefaultOptions({ version: '4.16' })

export default class Trench extends React.Component{

    componentDidMount(){
        console.log("Trench")
        console.log(this.props.item.dktccTrench.data)
    }
    
    render(){
        return null
    }
}