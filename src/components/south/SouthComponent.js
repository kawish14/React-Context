import React, { useEffect, useRef,useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Customer from "../../pages/south/Customer";
import  Header  from "../HeaderComponent"

export default function NorthMap() {
    const mapRef = useRef();
  

    const[view,updateView] =  useState(null)

    const[southStatus, updateSouthStatus] = useState({})
    const southCPEstatus = (e) => {updateSouthStatus(e)}

  useEffect(() => {
    let map = new Map({
      basemap: "satellite",
    });

    let view = new MapView({
      map: map,
      center: [67.050987, 24.894766],
      scale: 577791,
      container: mapRef.current,
    });

    view.when(function(){

        updateView(view)
    })

    return () => view.destroy();
  }, []);

  return (
    <div>
    {view && (
        <Header view={view} />
    )}
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }}>
          {view && (
              <Customer view={view} southCPEstatus={southCPEstatus}/>
          )}
      </div>
    </div>
  );
}
