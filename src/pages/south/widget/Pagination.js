import React, { useContext, useEffect, useState } from "react";
import mapContext from "../../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";

import {version} from '../../../url'
setDefaultOptions({ version: version })

export default function Pagination(props) {
  let context = useContext(mapContext);

  let southCPELayer = context.view.southCPELayer,graphicsLayer,bufferLayer
  let sketchViewModel, featureLayerView, chartExpand;

  let count = 0,
    centerGraphic,
    edgeGraphic,
    polylineGraphic,
    bufferGraphic,
    centerGeometryAtStart,
    labelGraphic;

    const unit = "kilometers";
    let paused = false;

  useEffect(() => {
    loadModules(["esri/widgets/Sketch/SketchViewModel","esri/layers/GraphicsLayer","esri/core/reactiveUtils",
    "esri/core/promiseUtils"],{css: false,})
    .then(([SketchViewModel,GraphicsLayer,reactiveUtils,promiseUtils,]) => {

         graphicsLayer = new GraphicsLayer();
         bufferLayer = new GraphicsLayer({
          blendMode: "color-burn",
        });

        props.view.whenLayerView(southCPELayer).then((layerView) => {
          featureLayerView = layerView;

          let paused = false;
          reactiveUtils.when(
            () => !layerView.updating,
            async () => {
              if (!paused) {
                 await drawBufferPolygon();
                // Display a popup with instructions only on initial app load.
                if (count == 0) {
                  props.view.popup.open({
                    title: "Center point",
                    content:
                      "Drag this point to move the buffer.<br/> " +
                      "Or drag the <b>Edge</b> point to resize the buffer.",
                    location: centerGraphic.geometry,
                  });
                  props.view.popup.alignment = "top-left";
                  count = 1;
                }
              }
            }
          );
        });

        const onMove = promiseUtils.debounce((event) => {
          // If the edge graphic is moving, keep the center graphic
          // at its initial location. Only move edge graphic
          if (
            event.toolEventInfo &&
            event.toolEventInfo.mover.attributes.edge
          ) {
            const toolType = event.toolEventInfo.type;
            if (toolType === "move-start") {
              centerGeometryAtStart = centerGraphic.geometry;
            }
            // keep the center graphic at its initial location when edge point is moving
            else if (toolType === "move" || toolType === "move-stop") {
              centerGraphic.geometry = centerGeometryAtStart;
            }
          }

          // the center or edge graphic is being moved, recalculate the buffer
          const vertices = [
            [centerGraphic.geometry.x, centerGraphic.geometry.y],
            [edgeGraphic.geometry.x, edgeGraphic.geometry.y],
          ];

          // client-side stats query of features that intersect the buffer
          calculateBuffer(vertices);

          // user is clicking on the view... call update method with the center and edge graphics
          if (event.state === "complete") {
            sketchViewModel.update([edgeGraphic, centerGraphic], {
              tool: "move",
            });
          }
        });

        sketchViewModel = new SketchViewModel({
          view: props.view,
          layer: graphicsLayer,
        });
        sketchViewModel.on("update", onMove);

        props.view.map.add(bufferLayer)
        props.view.map.add(graphicsLayer)
        
      }
    );
  });

  const calculateBuffer = (vertices) => {
    loadModules(
      ["esri/geometry/Polyline","esri/geometry/geometryEngine"],{css: false,})
      .then(([Polyline,geometryEngine]) => {
        // Update the geometry of the polyline based on location of edge and center points
        polylineGraphic.geometry = new Polyline({
          paths: vertices,
          spatialReference: props.view.spatialReference,
        });

        // Recalculate the polyline length and buffer polygon
        const length = geometryEngine.geodesicLength(
          polylineGraphic.geometry,
          unit
        );
        const buffer = geometryEngine.geodesicBuffer(
          centerGraphic.geometry,
          length,
          unit
        );

        // Update the buffer polygon
        bufferGraphic.geometry = buffer;

        // Query female and male age groups of the census tracts that intersect
        // the buffer polygon on the client
    /*     queryLayerViewAgeStats(buffer).then((newData) => {
          // Create a population pyramid chart from the returned result
          updateChart(newData);
        }); */

        // Update label graphic to show the length of the polyline
        labelGraphic.geometry = edgeGraphic.geometry;
        labelGraphic.symbol = {
          type: "text",
          color: "#FFEB00",
          text: length.toFixed(2) + " kilometers",
          xoffset: 50,
          yoffset: 10,
          font: {
            // autocast as Font
            size: 14,
            family: "sans-serif",
          },
        };
      }
    );
  };

  const drawBufferPolygon = () => {

    loadModules(
        ["esri/geometry/Polyline","esri/Graphic","esri/geometry/geometryEngine",],{css: false})
        .then(([ Polyline,Graphic,geometryEngine]) => {
                 // When pause() is called on the watch handle, the callback represented by the
    // watch is no longer invoked, but is still available for later use
    // this watch handle will be resumed when user searches for a new location
    // pausableWatchHandle.pause();
    //paused = false;
    
    paused = false
    // Initial location for the center, edge and polylines on the view
    const viewCenter = props.view.center.clone();
    const centerScreenPoint = props.view.toScreen(viewCenter);
    const centerPoint = props.view.toMap({
      x: centerScreenPoint.x + 120,
      y: centerScreenPoint.y - 120
    });
    const edgePoint = props.view.toMap({
      x: centerScreenPoint.x + 240,
      y: centerScreenPoint.y - 120
    });

    // Store updated vertices
    const vertices = [
      [centerPoint.x, centerPoint.y],
      [edgePoint.x, edgePoint.y]
    ];

    // Create center, edge, polyline and buffer graphics for the first time
    if (!centerGraphic) {
      const polyline = new Polyline({
        paths: vertices,
        spatialReference: props.view.spatialReference
      });

      // get the length of the initial polyline and create buffer
      const length = geometryEngine.geodesicLength(polyline, unit);
      const buffer = geometryEngine.geodesicBuffer(
        centerPoint,
        length,
        unit
      );

      // Create the graphics representing the line and buffer
      const pointSymbol = {
        type: "simple-marker",
        style: "circle",
        size: 10,
        color: [0, 255, 255, 0.5]
      };
      centerGraphic = new Graphic({
        geometry: centerPoint,
        symbol: pointSymbol,
        attributes: {
          center: "center"
        }
      });

      edgeGraphic = new Graphic({
        geometry: edgePoint,
        symbol: pointSymbol,
        attributes: {
          edge: "edge"
        }
      });

      polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: {
          type: "simple-line",
          color: [254, 254, 254, 1],
          width: 2.5
        }
      });

      bufferGraphic = new Graphic({
        geometry: buffer,
        symbol: {
          type: "simple-fill",
          color: [150, 150, 150],
          outline: {
            color: "#FFEB00",
            width: 2
          }
        }
      });
      labelGraphic = labelLength(edgePoint, length);

      // Add graphics to layer used with sketchVM
      graphicsLayer.addMany([
        centerGraphic,
        edgeGraphic,
        polylineGraphic
      ]);
      // Add label to view graphics
      props.view.graphics.add(labelGraphic);
      // once center and edge point graphics are added to the layer,
      // call sketch's update method pass in the graphics so that users
      // can just drag these graphics to adjust the buffer
      sketchViewModel.update([edgeGraphic, centerGraphic], {
        tool: "move"
      });

      bufferLayer.addMany([bufferGraphic]);
    }
    // Move the center and edge graphics to the new location returned from search
    else {
      centerGraphic.geometry = centerPoint;
      edgeGraphic.geometry = edgePoint;
    }

    // Query features that intersect the buffer
    calculateBuffer(vertices);
        })
   
  }

  const  labelLength = (geom, length) =>  {

    loadModules(
        ["esri/Graphic"],{css: false,}).
        then(
        ([Graphic]) => {

            return new Graphic({
                geometry: geom,
                symbol: {
                  type: "text",
                  color: "#FFEB00",
                  text: length.toFixed(2) + " kilometers",
                  xoffset: 50,
                  yoffset: 10,
                  font: {
                    // autocast as Font
                    size: 14,
                    family: "sans-serif"
                  }
                }
              });
        })
  
  }
  return null;
}
