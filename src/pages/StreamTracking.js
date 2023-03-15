import React, {useContext, useState, useEffect } from "react";
import { loadModules, setDefaultOptions } from 'esri-loader';
import socketIOClient from "socket.io-client";
import {ENDPOINT} from '../url'

import {version} from '../url'
setDefaultOptions({ version: version })

export default function StreamTracking (props) {

    useEffect(()=>{

        loadModules(
            ["esri/layers/StreamLayer"],
            { css: false }
          ).then(([StreamLayer]) => {
            const layer = new StreamLayer({
                webSocketUrl: ENDPOINT,
                geometryType: "point",
                maxReconnectionAttempts: 100,
                maxReconnectionInterval: 10,
               // renderer: renderer
              });

              props.view.map.add(layer);
          })

    },[])

    return null
}
