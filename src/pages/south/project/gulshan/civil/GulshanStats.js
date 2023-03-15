import React, { useContext, useState, useEffect } from "react";
import MapContext from "../../../../../context/mapContext";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Progress,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import { loadModules, setDefaultOptions } from 'esri-loader';

import {version} from '../../../../url'
setDefaultOptions({ version: version })

export default function GulshanStats(props) {

    const context = useContext(MapContext)

    const [conduitLength, setConduitLength] = useState(null)
    const[spur, setSpur] = useState(null)

    const [hhCount, setHHCount] = useState(null)
    const[statement, setStatement] = useState('')
 

    useEffect(()=>{

        let conduit = context.view.southGulshanConduit
        let hh = context.view.southGulshanHH

        loadModules([ "esri/smartMapping/statistics/summaryStatistics"], { css: false })
        .then(([summaryStatistics]) => {

            summaryStatistics({
                layer: hh,
                field: "attachment_length",
                }).then(function(stats){

                    setSpur(stats.sum)
            });

            summaryStatistics({
                layer: conduit,
                field: "distance",
                }).then(function(stats){
                    
                    let total = ((spur + stats.sum)*100) / 82000
                    setConduitLength(total.toFixed(2))
            });

        })


        let hhQuery = hh.createQuery()

        hhQuery.where = "1=1"

        hh.queryFeatureCount(hhQuery).then(function(response){

            let total = (response*100)/900
            setHHCount(total.toFixed(2))
        })


        let dates = new Date()

        let conduitQuery = conduit.createQuery()
        conduitQuery.where = "1=1"

        conduit.queryFeatures(conduitQuery).then(function(res){
            console.log(res)
            res.features.map(e => {

                let newDate = new Date(e.attributes.date)

               var Difference_In_Time = dates.getTime() - newDate.getTime();

                const diffDays = Difference_In_Time / (1000 * 3600 * 24);

    
                setStatement(`Last update before ${diffDays.toFixed(0)} days`)
            })
            
        })

        /* 
        var dateArray = ['11/01/2020', '10/01/2020', '09/01/2020', '07/01/2020', '06/01/2020']

        let date = '08/01/2020'
        
        function findClosestPrevDate(arr,target){
            let targetDate = new Date(target);
            let previousDates = arr.filter(e => ( targetDate  - new Date(e)) > 0)
            let sortedPreviousDates =  previousDates.filter((a,b) => new Date(a) - new Date(b))
            return sortedPreviousDates[0] || null
        }
        
        let r1 = findClosestPrevDate(dateArray,"08/01/2020")
        console.log(r1) */

  

    })

  return (
    <ModalBody>
      <Label>Conduit</Label>
      <div>
        <Progress value={conduitLength}>{conduitLength} % </Progress>
      </div>

      <Label>Hand Hole</Label>
      <div>
        <Progress value={hhCount}>{hhCount} % </Progress>
      </div>

      <Label>Hand Hole</Label>
      <div>
        <span style={{color:'gray',
        fontStyle: 'italic',
        fontSize: '12px'}
        }>
        {statement}
        </span>
      </div>
    </ModalBody>
  );
}
