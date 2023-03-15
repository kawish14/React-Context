import React, {useContext, useRef, useEffect} from 'react'
import MapContext from '../../../../../context/mapContext'

export default function GulshanHH (props){
    const context = useContext(MapContext)

    useEffect(() => {

        let handHole = context.view.southGulshanHH
        
        let symbol = {
            type: "simple-marker",
            style: "square",
            color: "blue",
            size: "8px",  
            outline: {  // autocasts as new SimpleLineSymbol()
              color: [ 255, 255, 0 ],
              width: 1.5  // points
            }
          }



        const HHrender = {
            type: "simple", 
            symbol: symbol,
        };

        handHole.renderer  = HHrender
    })
    return null
}