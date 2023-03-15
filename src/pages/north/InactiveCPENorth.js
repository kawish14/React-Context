import React, {useContext, useEffect,useState} from 'react'
import mapContext from '../../context/mapContext'

export default function InactiveCPENorth(props) {
    let context = useContext(mapContext)

    useEffect(() =>{

        let northInactiveCPE = context.view.northInactiveCPE

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
        
        northInactiveCPE.renderer = render
    })
    return null
}