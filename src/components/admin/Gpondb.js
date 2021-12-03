import React, {useState, useEffect} from 'react'
import { loadModules } from 'esri-loader';
import { request } from '@esri/arcgis-rest-request';

function Gpondb (props){
    
        return (
            <div>
            { props.summaryTableFun ? null : 
              
                    <table id="example" className="table table-bordered table-striped table-hover js-basic-example dataTable" style ={styels.table}>
                            
                            <thead style={{backgroundColor:'#7d5701', height:'20px'}}>
                            <tr>
                                <th>Alarm Info</th>
                                <th>South</th>
                                <th>North</th>
                                <th>Central</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="col-md-2" >Link Down</td>
                                <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {props.southStatus.southLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {props.southStatus.southLOSOld}</td>
                                <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {props.northStatus.northLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {props.northStatus.northLOSOld}</td>
                                <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {props.centralStatus.centralLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {props.centralStatus.centralLOSOld}</td>
                            </tr>
    
                            <tr>
                                <td className="col-md-2">Online</td>
                                <td className="col-md-2">{props.southStatus.Online}</td>
                                <td className="col-md-2">{props.northStatus.Online}</td>
                                <td className="col-md-2">{props.centralStatus.Online}</td>
                            </tr>
    
                            <tr>
                                <td className="col-md-2">Powered Off</td>
                                <td className="col-md-2">{props.southStatus.DyingGasp}</td>
                                <td className="col-md-2">{props.northStatus.DyingGasp}</td>
                                <td className="col-md-2">{props.centralStatus.DyingGasp}</td>
                            </tr>
    
                            <tr>
                                <td className="col-md-2">GEM Packet Loss</td>
                                <td className="col-md-2">{props.southStatus.GEMPack}</td>
                                <td className="col-md-2">{props.northStatus.GEMPack}</td>
                                <td className="col-md-2">{props.centralStatus.GEMPack}</td>
                            </tr>
    
                            <tr>
                                <td className="col-md-2">Low Optical Power</td>
                                <td className="col-md-2">{props.southStatus.LOP}</td>
                                <td className="col-md-2">{props.northStatus.LOP}</td>
                                <td className="col-md-2">{props.centralStatus.LOP}</td>
                            </tr>
                            </tbody>
                        </table>
    
                
                   
            
                    
            }
            
            </div>
           
        )
    }

const styels = {
    table:{
        backgroundColor: '#242424',
        color: 'white',
        fontSize:'13px'
    },
    LOSRed:{
        fontSize:'8px',
        color:'red'
    },
    LOSOrange:{
        fontSize:'8px',
        color:'orange'
    }
}

export default Gpondb