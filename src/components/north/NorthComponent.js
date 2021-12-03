import React, { useState } from 'react';
import { Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import { Loading } from '../LoadingComponent';
import { Map } from 'react-arcgis';
import NorthCustomer from '../../pages/north/NorthCustomer'
import NorthPOP from '../../pages/north/NorthPOP'
import NorthZone from '../../pages/north/NorthZone'
import NorthFeeder from '../../pages/north/NorthFeeder'
import NorthDC from '../../pages/north/NorthDC'
import NorthFAT from '../../pages/north/NorthFAT'
import NorthJoint from '../../pages/north/NorthJoint';

import Header from '../HeaderComponent';
import Layerlist from '../../pages/north/widget/Layerlist';
import SearchWidget from '../../pages/north/widget/SearchWidget'
import AppWidgets from '../../pages/north/widget/AppWidgets';
import NorthViewMaps from './NorthViewMaps';
import Gpondb from '../../pages/north/Gpondb';
import NorthSelectGraphic from '../../pages/north/widget/NorthSelectGraphic';
import NorthDistribution from '../../pages/north/NorthDistribution';
import Tracking from '../../pages/Tracking';
import Realtime from '../../pages/Realtime';

function North(props) {

    const [viewProperties] = useState({
        center: [73.127233,33.529393],
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

    const [mapView, updateView] = useState({})

    const viewCheck = (e) => { updateView(e) }

    const[northStatus, updateNorthStatus] = useState({})
    const northCPEstatus = (e) => {updateNorthStatus(e)}

    if (props.northCustomerLoading || props.northDistributionLoading || props.northFeederLoading 
        || props.northFATLoading || props.northDCLoading || props.northJointLoading  ) {
        return(
           
            <Loading />
        );
    }
    else if (props.northCustomerErrMess || props.northFeederErrMess || props.northDistributionErrMess
        || props.northJointErrMess || props.northFATErrMess || props.northDCErrMess) {
        return(
                <h4>{props.northCustomerErrMess}</h4>
        );
    }
    else 
        {
        return(
            <div>
                <Header 
                    item = {props.customer}
                    northItem = {props.northCustomer}
                    loginRole ={props.login}
                    view = {mapView}
                 />
                 
                <Map
                    className="container-fluid"
                    style={{ paddingLeft:'0px', marginRight:'0px', width:'100vw', height:mapHeight }}
                    mapProperties={{ basemap: 'satellite' }}
                    viewProperties={viewProperties}
                    > 
                        <NorthCustomer item = {props.northCustomer} loginRole ={props.login}
                        northCPEstatus={northCPEstatus}  />

                        <NorthFeeder item = {props.northFeeder}  />
                        <NorthDistribution item = {props.northDistribution} />

                        <NorthDC item = {props.northDC} />

                        <NorthFAT item={props.northFAT}  />

                        <NorthJoint item ={props.northJoint} />
                      

                        <NorthPOP item = {props.northPOP}  viewInstance = {viewCheck} />
                        <NorthZone
                            zone = {props.northZone}
                            loginRole ={props.login}
                         />
                        <Layerlist
                            //fatLabel={props.fat} 
                            //dcLabel={props.dc}
                            northCustomerLabel = {props.northCustomer}
                            northPOP = {props.northPOP}
                            northFeeder = {props.northFeeder}
                            northDistribution = {props.northDistribution}
                            northJoint={props.northJoint}
                            northDC = {props.northDC}
                            northFAT={props.northFAT} 
                            
                            northZone = {props.northZone}
                            
                            //fiberLabel = {props.fiber}
                            //jointLabel ={props.joint}
                           // popLabel={props.pop} 

                            loginRole ={props.login} 
                            
                        />
                        <SearchWidget
                            northCustomerSearch = {props.northCustomer}
                           // dcSearch = {props.dc}
                         />
                         <AppWidgets
                            northPOP = {props.northPOP}
                            northFeeder = {props.northFeeder}
                            northDistribution = {props.northDistribution}
                            northJoint={props.northJoint}
                            northDC = {props.northDC}
                            northFAT={props.northFAT} 
                            
                            northZone = {props.northZone}
                          />
                          <NorthViewMaps 
                              north = {props.northCustomer}
                          />
                           <NorthSelectGraphic 
                             north = {props.northCustomer} 
                             
                             changeMapHeight={changeMapHeight}
                             summaryTableFun={summaryTableFun}
                         />
                         <Tracking 
                             view={mapView}
            
                         />
 
                       {/*  <Realtime 
                            view = {mapView}
                            northCPEstatus={northCPEstatus}
                            item = {props.northCustomer}
                            loginRole ={props.login}

                         /> */} 
                </Map>
                <Gpondb 

                    item = {props.northCustomer}
                    northStatus = {northStatus}
                    summaryTableFun={summary}
                />
            </div>
          
        )
    }
}

export default North;