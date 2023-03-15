import React, {useContext, useRef, useEffect} from 'react'
import MapContext from '../../../../../context/mapContext'

export default function GulshanTrench (props){
    const context = useContext(MapContext)

    useEffect(() => {

        let gulshanConduit = context.view.southGulshanConduit

        let symbol = {
            type: "simple-line",  // autocasts as new SimpleLineSymbol()
            color: "#1f91d6",
            width: "5px",
            style: "solid"
          }

        const ConduitRender = {
            type: "simple", 
            symbol: symbol,
        };
        
          gulshanConduit.renderer = ConduitRender
          gulshanConduit.definitionExpression = "work_status = 'Complete'"
        
    })
    return null
}