import React, {useContext, useEffect,useState} from 'react'
import mapContext from '../../context/mapContext'

export default function InactiveCPESouth(props) {
    let context = useContext(mapContext)

    useEffect(() =>{

        let southInactiveCPE = context.view.southInactiveCPE

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
        
        southInactiveCPE.renderer = render
    })
    return null
}