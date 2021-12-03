import React, {useState, useEffect} from 'react'

function Gpondb (props){
    
        return (
            <div style={{marginTop:'-6px'}}>
            { props.summaryTableFun ? null : 
                <table id="example" className="table table-bordered table-striped table-hover js-basic-example dataTable" style ={styels.table}>
                    
                    <thead style={{backgroundColor:'#7d5701', height:'20px'}}>
                    <tr>
                        <th>Region</th>
                        <th>LOS</th>
                        <th>Online</th>
                        <th>Powered Off</th>
                        <th>GEM Packet Loss</th>
                        <th>Low Optical Power</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="col-md-2">South</td>
                        <td className="col-md-2"><i class="fas fa-circle" style={styels.LOSRed}></i> {props.southStatus.southLOSWeek} &nbsp;&nbsp; | &nbsp;&nbsp; <i class="fas fa-circle" style={styels.LOSOrange}></i> {props.southStatus.southLOSOld}</td>
                        <td className="col-md-2"> {props.southStatus.Online}</td>
                        <td className="col-md-2">{props.southStatus.DyingGasp}</td>
                        <td className="col-md-2">{props.southStatus.GEMPack}</td>
                        <td className="col-md-2">{props.southStatus.LOP}</td>
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