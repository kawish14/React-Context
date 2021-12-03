import React, { useContext, useEffect, useRef } from "react";
import mapContext from "../context/mapContext";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

export default function NorthMap() {
  const mapRef = useRef();
  const { southLayer } = useContext(mapContext);

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
        map.add(southLayer)
    })

    return () => view.destroy();
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
}
