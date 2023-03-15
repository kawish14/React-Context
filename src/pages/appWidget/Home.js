import React, { useContext, useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";
import MapContext from "../../context/mapContext";

import {version} from '../../url'
setDefaultOptions({ version: version })

export default function HomeWidget(props) {
  let { loginRole } = useContext(MapContext);

  useEffect(() => {
    let view = props.view;
    var homeWidget;
    loadModules(["esri/widgets/Home"], { css: false }).then(([Home]) => {
      homeWidget = new Home({
        view: view,
      });
      view.ui.add(homeWidget, "top-left");
    });

    return () => {
      view.ui.remove(homeWidget);
    };
  }, []);
  return null;
}
