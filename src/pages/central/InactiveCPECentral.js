import React, {useContext, useEffect,useState} from 'react'
import mapContext from '../../context/mapContext'

export default function InactiveCPECentral(props) {
    let context = useContext(mapContext)

    useEffect(() =>{

        let centralInactiveCPE = context.view.centralInactiveCPE

        let symbol = {
            type: "simple-marker", 
            style: "triangle",
            color: "blue",
            size: "5px",  
          };

  /*         let symbol =  {
            type: "picture-marker",
            url: "images/info.png",
            width: "30px",
            height: "15px",
          } */

          const render = {
            type: "simple", 
            symbol: symbol,
        };
        
        centralInactiveCPE.renderer = render
    })
    return null
}