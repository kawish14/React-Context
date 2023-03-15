import React from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';

import {version} from '../../../../url'
setDefaultOptions({ version: version })

export default class Trench extends React.Component{

    componentDidMount(){
        console.log("Trench")
        console.log(this.props.item.dktccTrench.data)
    }
    
    render(){
        return null
    }
}