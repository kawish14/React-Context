import React, { useContext, useEffect, useRef, useState } from "react";
import mapContext from "../context/mapContext";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";


import Layerlist from "../pages/appWidget/layerList/Layerlist";
/* import NorthLayerlist from "../pages/north/widget/NorthLayerlist";
import CentralLayerlist from "../pages/central/widget/CentralLayerlist";
import AdminLayerlist from "./admin/widget/layerList/Layerlist"; */
import TWALayerlist from './twa/widgets/TWALayerlist'
import CSDLayerlist from '../pages/csd/widget/CSDLayerlist'

import { loadModules, setDefaultOptions } from "esri-loader";

import "./css/sidebar.css";

export default function Sidebar(props) {
  const { view } = useContext(mapContext);
  const loginRole = view.loginRole
  
  const [width, setWidth] = useState("220px");
  const [maxWidth, setMaxWidth] = useState("230px");
  const [minWidth, setMinWidth] = useState("220px");

  const [sideBarHeight, setSideBarHeight] = useState('100%')

  const [sideToggle, setSideToggle] = useState(true);

  return (
    
    <>
       {!sideToggle ? (
        
        <div prefix={<i className="fa fa-bars fa-large"></i>}
          className="open"
          style={{
            writingMode: "tb-rl",
            color: "#1f8be8",
            textAlign: "center",
            cursor:'pointer',
            fontWeight: 'bold',
            border:' 1px solid rgb(34, 36, 38)',
            textShadow: '1px 1px #020207'
          }}

          onClick={() => {
            setSideToggle(!sideToggle)
            
            setWidth('220px')
            setMaxWidth('230px')
            setMinWidth('220px')

            
          }}
        >
         <i class="fas fa-arrow-right"></i>  Table of Content
        </div>
      ) : 
        null
      }

      <div
          className="sideBar-main"
          style={{
            display: "flex",
            height: sideBarHeight,
            overflow: "scroll initial",
          }}
        >
          <CDBSidebar 
            textColor="rgb(31, 145, 243)"
            backgroundColor="#2a2e32"
            style={{
              border: "1px solid #222426",
              width: width,
              maxWidth: maxWidth,
              minWidth: minWidth,
            }}
          >
             <div>
              <h6 
                style={{
                  textAlign: "center",
                  marginTop: "16px",
                  marginBottom: "-8px",
                  color: "rgb(31, 145, 243)",
                  cursor:'pointer'
                }}

                onClick={() => {
                
                setSideToggle(!sideToggle)

                setWidth('0px')
                setMaxWidth('0px')
                setMinWidth('0px')
      
             

              }}
              >
                <i class="fas fa-arrow-left"></i> Table of Content
              </h6>
            </div> 

            <CDBSidebarContent className="sidebar-content">
              <CDBSidebarMenu >
                <>
                <Layerlist view={props.view} />
                </>
                {/* <>
                  {loginRole.role === "SouthDEVuser" ? (
                    <Layerlist view={props.view} />
                  ) : null}
                </>

                <>
                  {loginRole.role === "NorthDEVuser" ? (
                    <NorthLayerlist view={props.view} />
                  ) : null}
                </>

                <>
                  {loginRole.role === "CentralDEVuser" ? (
                    <CentralLayerlist view={props.view} />
                  ) : null}
                </>

                <>
                  {loginRole.role === "Admin" ? (
                    <AdminLayerlist view={props.view} />
                  ) : null}
                </> */}
                <>
                  {loginRole.role === "TWA" ? (
                    <TWALayerlist view={props.view} />
                  ) : null}
                </> 
                <>
                  {loginRole.role === "CSD" ? (
                    <CSDLayerlist view={props.view} />
                  ) : null}
                </>
              </CDBSidebarMenu>
            </CDBSidebarContent>

            <span className="version" style={{ color: "#1f91f3" }}>
              {" "}
              V.2.3{" "}
            </span>
          </CDBSidebar>
      </div>
    </>
  );
}
