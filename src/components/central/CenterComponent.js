import React, { useState } from 'react';
import { Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import { Loading } from '../LoadingComponent';
import { Map } from 'react-arcgis';
import CenterCustomer from '../../pages/central/CenterCustomer'
import CentralPOP from '../../pages/central/CentralPOP'
import CentralZone from '../../pages/central/CentralZone'
import CentralDistribution from '../../pages/central/CentralDistribution';
import CentralDC from '../../pages/central/CentralDC';
import CentralFAT from '../../pages/central/CentralFAT';
import CentralJoint from '../../pages/central/CentralJoint';
import CentralFeeder from '../../pages/central/CentralFeeder'
import Trench from '../../pages/south/project/dktcc/Trench'
import Header from '../HeaderComponent';
import Layerlist from '../../pages/central/widget/Layerlist';
import SearchWidget from '../../pages/central/widget/SearchWidget'
import AppWidgets from '../../pages/central/widget/AppWidgets';
import CentralViewMaps  from './CentralViewMaps';
import Gpondb from '../../pages/central/Gpondb'
import CentralSelectGraphic from '../../pages/central/widget/CentralSelectGraphic'
import Tracking from '../../pages/Tracking';

function Central(props) {

    const [viewProperties] = useState({
        center: [74.355626,31.545676],
        scale: 577791,
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

    const[centralStatus, updateCentralStatus] = useState({})
    const centralCPEstatus = (e) => {updateCentralStatus(e)} 

    const [mapView, updateView] = useState({})

    const viewCheck = (e) => { updateView(e) }
    
    if (props.centerCustomerLoading || props.centralFeederLoading || props.centralDistributionLoading
        || props.centralDCLoading || props.centralFatLoading || props.centralJointLoading) {
        return(
           
            <Loading />
        );
    }
    else if (props.centerCustomerErrMess || props.centralFeederErrMess || props.centralDistributionErrMess
        || props.centralDCErrMess || props.centralFatErrMess || props.centralJointErrMess) {
        return(
                <h4>{props.centerCustomerErrMess}</h4>
        );
    }
    else 
        {
        return(
            <div>
                <Header 
                    centerItem = {props.centerCustomer}
                    loginRole ={props.login}
                    view = {mapView}
                 />
                 
                <Map
                    className="container-fluid"
                    style={{ paddingLeft:'0px', paddingRight:'15px', width:'100vw', height:mapHeight }}
                    mapProperties={{ basemap: 'satellite' }}
                    viewProperties={viewProperties}
                    > 
                        <CenterCustomer item = {props.centerCustomer} loginRole ={props.login}
                            centralCPEstatus={centralCPEstatus} />

                        <CentralPOP item = {props.centralPOP}  viewInstance = {viewCheck} />
                        <CentralZone 
                        loginRole ={props.login}
                            zone={props.centralZone}
                        />
                        <CentralFeeder item={props.centralFeeder} />
                        <CentralDistribution item = {props.centralDistribution} />
                        <CentralDC item={props.centralDC} />
                        <CentralFAT item={props.centralFat} />
                        <CentralJoint item={props.centralJoint} />
                        
                        <Layerlist
                            centralCustomerLabel = {props.centerCustomer}
                            centralPOP = {props.centralPOP}
                            centralZone={props.centralZone}
                            centralFeeder={props.centralFeeder}
                            centralDistribution={props.centralDistribution}
                            centralDC ={props.centralDC}
                            centralFat={props.centralFat}
                            centralJoint={props.centralJoint}

                            loginRole ={props.login} 
                            
                        />
                        <SearchWidget
                            centralCustomerSearch = {props.centerCustomer}
                            //dcSearch = {props.dc}
                         />
                         <AppWidgets
                            centralPOP = {props.centralPOP}
                            centralZone={props.centralZone}
                            centralFeeder={props.centralFeeder}
                            centralDC ={props.centralDC}
                            centralFat={props.centralFat}
                            centralJoint={props.centralJoint}
                          />
                         <CentralViewMaps view = {mapView}
                            loginRole ={props.login} 
                            center = {props.centerCustomer}    
                         />
                         <CentralSelectGraphic 
                            center = {props.centerCustomer}
                             
                             changeMapHeight={changeMapHeight}
                             summaryTableFun={summaryTableFun}
                         />
                         <Tracking 
                             view={mapView}
                         />
                  
                </Map>
                <Gpondb
                    item = {props.customer}
                    centralStatus={centralStatus}
                    summaryTableFun={summary}
                    
                    loginRole ={props.login}
                        
                /> 
            </div>
          
        )
    }
}

export default Central;