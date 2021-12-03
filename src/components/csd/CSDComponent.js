import React, { useState } from 'react';
import { Row,Col,Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import { Loading } from '../LoadingComponent';
import { Map } from 'react-arcgis';

import CSDCustomer from '../../pages/csd/CSDCustomer'
import CSDCoverage from '../../pages/csd/CSDCoverage'

import Header from './Header';
import Layerlist from '../../pages/csd/widget/Layerlist';
import SearchWidget from '../../pages/csd/widget/SearchWidget'
import AppWidgets from '../../pages/csd/widget/AppWidgets'

import socketIOClient from "socket.io-client";

function CSD(props) {

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

    const [mapHeight, mapHeightUpdate] = useState('92vh');

    
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
   
                    loginRole ={props.login}
                  
                 /> 
                <Map
                    className="container-fluid"
                    style={{ paddingLeft:'0px', width:'100vw', height:mapHeight }}
                    mapProperties={{ basemap: 'satellite' }}
                    viewProperties={viewProperties}
                    >  
                        <CSDCustomer 
                            item = {props.customer}
                            northCustomer={props.northCustomer}
                            centerCustomer = {props.centerCustomer}
    
                        />
                        <CSDCoverage
                            southZone = {props.southZone}
                            centralCoverage = {props.centralCoverage}
                            northCoverage= {props.northCoverage}
                         />
                        <Layerlist

                            customerLabel = {props.customer}
                            centralCustomerLabel = {props.centerCustomer}
                            northCustomerLabel = {props.northCustomer}
                            
                            southZone = {props.southZone}
                            northCoverage = {props.northCoverage}
                            centralCoverage = {props.centralCoverage}
                            
                            loginRole ={props.login} 
                            
                        />
                        <SearchWidget
                            customerSearch = {props.customer}
                            centralCustomerSearch = {props.centerCustomer}
                            northCustomerSearch = {props.northCustomer}
         
                        />
                        <AppWidgets

                            item = {props.customer}
                            northCustomer={props.northCustomer}
                            centerCustomer = {props.centerCustomer}

                        />
                     
                        
                </Map>

            </div>
          
        )
    }
}

export default CSD;