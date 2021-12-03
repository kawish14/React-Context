import React, { useState } from 'react';
import { Row,Col,Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import { Loading } from '../LoadingComponent';
import { Map } from 'react-arcgis';

import LayerViews from '../LayerViews';

import Customer from '../../pages/south/Customer'
import CenterCustomer from '../../pages/central/CenterCustomer'
import NorthCustomer from '../../pages/north/NorthCustomer'
import NorthPOP from '../../pages/north/NorthPOP'
import CentralPOP from '../../pages/central/CentralPOP'

import SouthZone from '../../pages/south/SouthZone'
import NorthZone from '../../pages/north/NorthZone'
import CentralZone from '../../pages/central/CentralZone'

import DateWidget from './widget/DateWidget';

import NorthFeeder from '../../pages/north/NorthFeeder'
import NorthDistribution from '../../pages/north/NorthDistribution'
import SouthFeeder from '../../pages/south/SouthFeeder'
import SouthDistribution from '../../pages/south/SouthDistribution'
import CentralFeeder from '../../pages/central/CentralFeeder'

import DC from '../../pages/south/DC'
import NorthDC from '../../pages/north/NorthDC'

import FAT from '../../pages/south/FAT'
import NorthFAT from '../../pages/north/NorthFAT'

import Joint from '../../pages/south/Joint';
import NorthJoint from '../../pages/north/NorthJoint'

import POP from '../../pages/south/POP'
import Trench from '../../pages/south/project/dktcc/Trench'
import Header from '../HeaderComponent';
import Layerlist from './widget/Layerlist';
import SearchWidget from './widget/SearchWidget'
import AppWidgets from './widget/AppWidgets'
import ViewMaps from './ViewMaps';
import Gpondb from './Gpondb'
import SelectGraphic from './widget/SelectGraphic';
import CentralDistribution from '../../pages/central/CentralDistribution';
import CentralDC from '../../pages/central/CentralDC';
import CentralFAT from '../../pages/central/CentralFAT';
import CentralJoint from '../../pages/central/CentralJoint';

import Tracking from '../../pages/Tracking';
import socketIOClient from "socket.io-client";

function Admin(props) {

    const [viewProperties] = useState({
        center: [70.177627, 28.844898], 
        scale: 18489298,
         popup: {
            dockEnabled: true,
            dockOptions: {
               
                buttonEnabled: true,
            
                breakpoint: false,
                position: "bottom-left"
            }
        }, 
         ui: {
             components: ["zoom", "compass", "attribution"]
         }

    });
    const [mapHeight, mapHeightUpdate] = useState('77vh');
    const changeMapHeight = (e) => {mapHeightUpdate(e)}

    const [summary, summaryTable] = useState(false);
    const summaryTableFun = (e) => {summaryTable(e)} 

    const [mapview, updateView] = useState({})
    const viewCheck = (e) => { updateView(e) }

    const [map, updateMap] = useState({})
    const mapCheck = (e) => { updateMap(e) }

    const[southStatus, updateSouthStatus] = useState({})
    const southCPEstatus = (e) => {updateSouthStatus(e)}

    const[northStatus, updateNorthStatus] = useState({})
    const northCPEstatus = (e) => {updateNorthStatus(e)}

    const[centralStatus, updateCentralStatus] = useState({})
    const centralCPEstatus = (e) => {updateCentralStatus(e)} 

    const [selectLOSbyDate, updateselectLOSbyDate] = useState(null)
    const selectLOSbyDateFun = (e) => {updateselectLOSbyDate(e)}

    const [southLayerViewCPE, southLayerViewCPEupdate] = useState(null)
    const southLayerViewCPEfun = (e) => {southLayerViewCPEupdate(e)}

    const [northLayerViewCPE, northLayerViewCPEupdate] = useState(null)
    const northLayerViewCPEfun = (e) => {northLayerViewCPEupdate(e)}

    const [centralLayerViewCPE, centralLayerViewCPEupdate] = useState(null)
    const centralLayerViewCPEfun = (e) => {centralLayerViewCPEupdate(e)}

    if ( props.customerLoading || props.centerCustomerLoading || props.northCustomerLoading || props.southFeederLoading
        || props.southDistributionLoading || props.northFeederLoading || props.northDistributionLoading  
        || props.dcLoading || props.fatLoading || props.southJointLoading || props.northFATLoading 
        || props.centralFeederLoading || props.centralDistributionLoading || props.centralDCLoading
        || props.centralFatLoading ||props.northDCLoading || props.northFATLoading ||
        props.northJointLoading || props.centralJointLoading) {
        return(
           
            <Loading />
        );
    }
    else if (props.customerErrMess || props.centerCustomerErrMess || props.northCustomerErrMess || props.fatErrMess ||
         props.southFeederErrMess || props.southDistributionErrMess || props.northFeederErrMess || props.northDistributionErrMess
         || props.northFATErrMess || props.dcErrMess  || props.southJointErrMess 
         || props.centralFeederErrMess || props.centralDistributionErrMess || props.centralDCErrMess 
         || props.centralFatErrMess) {
             
        return(
                <h4>{props.customerErrMess}</h4>
        );
    }
    else 
        { 
            
        return(
            
            <div style={{backgroundColor:'#1d1d1d'}}>
                <Header 
                    item = {props.customer}
                    centerItem = {props.centerCustomer}
                    northItem = {props.northCustomer}
                    loginRole ={props.login}
                    view = {mapview}
                    map={map}
                    selectLOSbyDate = {selectLOSbyDateFun}

                    southLayerViewCPE={southLayerViewCPE}
                    northLayerViewCPE={northLayerViewCPE}
                    centralLayerViewCPE={centralLayerViewCPE}
                  
                 />
                <Map
                    className="container-fluid"
                    style={{ paddingLeft:'0px', width:'100vw', height:mapHeight }}
                    mapProperties={{ basemap: 'satellite' }}
                    viewProperties={viewProperties}
                    >  
                        <Customer item = {props.customer} loginRole ={props.login} viewInstance = {viewCheck} 
                        southCPEstatus={southCPEstatus} updateMap={mapCheck} socketIOClient={socketIOClient}
                      
                        />

                        <CenterCustomer item = {props.centerCustomer} loginRole ={props.login} 
                        centralCPEstatus={centralCPEstatus} />

                        <NorthCustomer item = {props.northCustomer} loginRole ={props.login} 
                        northCPEstatus={northCPEstatus} />

                        <SouthFeeder item = {props.southFeeder} />
                        <NorthFeeder item = {props.northFeeder}  />
                        <CentralFeeder item={props.centralFeeder} />

                        <NorthDistribution item = {props.northDistribution} />
                        <SouthDistribution item = {props.southDistribution}/>
                        <CentralDistribution item = {props.centralDistribution} />

                        <NorthDC item = {props.northDC} />
                        <DC item ={props.dc}/>
                        <CentralDC item={props.centralDC} />

                        <NorthFAT item={props.northFAT}  />
                        <FAT item ={props.fat}/>
                        <CentralFAT item={props.centralFat} />

                        <NorthJoint item ={props.northJoint} />
                        <Joint item ={props.southJoint}/>
                        <CentralJoint item={props.centralJoint} />

                        <POP item = {props.southPOP}  viewInstance = {viewCheck} />
                        <NorthPOP item = {props.northPOP}  viewInstance = {viewCheck} />
                        <CentralPOP item = {props.centralPOP} />

                        <SouthZone zone = {props.southZone} loginRole ={props.login} />
                        <NorthZone zone = {props.northZone} loginRole ={props.login} />
                        <CentralZone zone = {props.centralZone} loginRole ={props.login} />

                        <Layerlist
                            //fatLabel={props.fat} 
                            //dcLabel={props.dc}
                            customerLabel = {props.customer}
                            centralCustomerLabel = {props.centerCustomer}
                            northCustomerLabel = {props.northCustomer}
                            
                            southZone = {props.southZone}
                            northZone = {props.northZone}
                            centralZone = {props.centralZone}
                            //fiberLabel = {props.fiber}
                            //jointLabel ={props.joint}
                            southPOP={props.southPOP}
                            northPOP={props.northPOP}
                            centralPOP = {props.centralPOP}

                            northFeeder= {props.northFeeder}
                            southFeeder = {props.southFeeder}
                            centralFeeder={props.centralFeeder}

                            northDistribution = {props.northDistribution}
                            southDistribution = {props.southDistribution}
                            centralDistribution={props.centralDistribution}
                            

                            southDC ={props.dc}
                            northDC = {props.northDC}
                            centralDC ={props.centralDC}

                            northFAT = {props.northFAT}
                            southFAT ={props.fat}
                            centralFat={props.centralFat}

                            northJoint = {props.northJoint}
                            southJoint ={props.southJoint}
                            centralJoint={props.centralJoint}

                            loginRole ={props.login} 
                            
                        />
                        <SearchWidget
                            customerSearch = {props.customer}
                            centralCustomerSearch = {props.centerCustomer}
                            northCustomerSearch = {props.northCustomer}
              

                            //dcSearch = {props.dc}
                        />
                        <AppWidgets
                            southPOP={props.southPOP}
                            centralPOP = {props.centralPOP} 

                            southZone = {props.southZone}
                            northZone = {props.northZone}
                            centralZone = {props.centralZone}

                            northFeeder= {props.northFeeder}
                            northDistribution={props.northDistribution}

                            northDC = {props.northDC}

                            northFAT = {props.northFAT}

                            northJoint={props.northJoint}

                        />
                         <ViewMaps south = {props.customer} view = {mapview}
                            north = {props.northCustomer} 
                            center = {props.centerCustomer}
                            loginRole ={props.login} 
                         />
                        <SelectGraphic 
                             south = {props.customer}
                             north = {props.northCustomer} 
                             center = {props.centerCustomer}
                             
                             changeMapHeight={changeMapHeight}
                             summaryTableFun={summaryTableFun}

                             selectLOSbyDate={selectLOSbyDate}

                             southLayerViewCPE={southLayerViewCPE}
                             northLayerViewCPE={northLayerViewCPE}
                             centralLayerViewCPE={centralLayerViewCPE}
                         />
                         <LayerViews
                            view = {mapview}
                            map={map}

                            southCustomerLayerView = {props.customer}
                            northCustomerLayerView = {props.northCustomer}
                            centralCustomerLayerView = {props.centerCustomer}

                            southLayerViewCPE={southLayerViewCPEfun}
                            northLayerViewCPE={northLayerViewCPEfun}
                            centralLayerViewCPE={centralLayerViewCPEfun}
                        />
                        
                       <Tracking 
                            view = {mapview}
                            map={map}
                            item = {props.customer}
                            loginRole ={props.login}
                        /> 
                        
                </Map>
                <Gpondb  
                    item = {props.customer}
                    southStatus = {southStatus}
                    northStatus = {northStatus}
                    centralStatus={centralStatus}
                    summaryTableFun={summary}
                    
                    loginRole ={props.login}
                        
                />

            </div>
          
        )
    }
}

export default Admin;