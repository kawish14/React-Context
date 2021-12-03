import React , {useEffect,useRef,useCallback, useState, createRef} from 'react'
import { loadModules, setDefaultOptions } from 'esri-loader';
import { Navbar, NavbarBrand, Nav, NavbarToggler,NavLink, Collapse, NavItem,Dropdown,DropdownToggle,
    DropdownMenu,DropdownItem,UncontrolledDropdown} from 'reactstrap';
import {CSVLink} from 'react-csv'

import './css/widget.css'

export default class CentralSelectGraphic extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            pointerEvent:'auto',
           
            polygonGraphicsLayer:null,
            polylineGraphicsLayer:null,

            selectionTable:false,

            centerCPEHighlight:null,
            centerLayerView:null,
            centerCPEAttributes:null,
            centerCPETable:false,
            centerCPEnav:false,
            centerCPEtoggle:false,

        }
        this.clearSelection = React.createRef()
        this.selectByPolygon = React.createRef()
        this.polyline = React.createRef()
        this.csvLink_centralCPE = React.createRef()

        this.headers = [
            {label:'Name', key:'name'},
            {label:'ID', key:'id'},
            {label:'Address', key:'address'},
            {label:'Type', key:'type'},
            {label:'OLT', key:'olt'},
            {label:'Frame', key:'frame'},
            {label:'Slot', key:'slot'},
            {label:'Port', key:'port'},
            {label:'ONT ID', key:'ontid'},
            {label:'Ont Model', key:'ontmodel'},
            {label:'Alarm', key:'alarminfo'},
            {label:'Bandwidth', key:'bandwidth'},
            {label:'Last Up Time', key:'lastuptime'},
            {label:'Last Down Time', key:'lastdowntime'}
        
        ]
    }


componentDidMount(){
    let _this = this
    const view = this.props.view
    const map = this.props.map

    const center = this.props.center.centerCustomer.data

    center.when(function(){
        view.whenLayerView(center).then(function (layerView) {
            _this.setState({
                centerLayerView : layerView
            })

        })
    })

    view.watch(["stationary"], function () {

        let scale = Math.round(view.scale * 1) / 1

        if (scale <= 288895) {

            _this.setState({
                visibility:'visible'
            })

            view.ui.add(_this.selectByPolygon.current, 'top-right')
            view.ui.add(_this.polyline.current, 'top-right')
            view.ui.add(_this.clearSelection.current,'top-right')
        }

        if (scale > 288895)  {

            _this.setState({
                visibility:'hidden'
            })

            view.ui.remove(_this.selectByPolygon.current, 'top-right')
            view.ui.remove(_this.polyline.current, 'top-right')
            view.ui.remove(_this.clearSelection.current,'top-right')
        }
    })
    loadModules(["esri/layers/GraphicsLayer"], { css: false })
        .then(([GraphicsLayer]) => {

            _this.setState({
                polygonGraphicsLayer:new GraphicsLayer({
                    listMode:"hide"
                }),
                polylineGraphicsLayer:new GraphicsLayer({
                    listMode:"hide"
                }),
            })
    
            map.addMany([_this.state.polygonGraphicsLayer,_this.state.polylineGraphicsLayer]);

            
        })

    }

selectByGraphic = () => {

    let _this = this
    let view = this.props.view

    this.state.polygonGraphicsLayer.removeAll()

    this.setState({
        pointerEvent:'none'
    })

    loadModules(["esri/widgets/Sketch/SketchViewModel","esri/geometry/geometryEngineAsync"], { css: false })
        .then(([SketchViewModel,geometryEngineAsync]) => {

            view.popup.close();

            const sketchViewModel = new SketchViewModel({
                view: view,
                layer: _this.state.polygonGraphicsLayer
              });

          sketchViewModel.create("polygon");
        
          sketchViewModel.on("create", async (event) => {

            if (event.state === "complete") {
            
                this.setState({
                    pointerEvent:'auto'
                })

              this.selectFeatures(event.graphic.geometry);
            }
          });

        })

    }

selectFeatures = (geometry) =>{
    let _this = this
    const center = this.props.center.centerCustomer.data

    if (_this.state.centerLayerView && center.visible === true) {

        const query = {
            geometry: geometry,
            outFields: ["*"]
        };

        // query graphics from the csv layer view. Geometry set for the query
        // can be polygon for point features and only intersecting geometries are returned
        _this.state.centerLayerView
            .queryFeatures(query)
            .then((results) => {

            if (results.features.length === 0) {

               return null

            } else {
                
                _this.props.changeMapHeight('66vh')
                _this.props.summaryTableFun(true)

                if(this.state.centerCPEHighlight){
            
                    this.state.centerCPEHighlight.remove()
                }

                _this.setState({
                    centerCPEAttributes:results.features,
                    centerCPETable:true,
                    centerCPEnav:true,
                    selectionTable:true,
                    centerCPEHighlight:_this.state.centerLayerView.highlight(results.features),

                })


            }
           
            })
        
    }
        
}

drawPolyline = () => {

    let _this = this
    let view = this.props.view

    this.setState({
        pointerEvent:'none'
    })

    loadModules(["esri/widgets/Sketch/SketchViewModel","esri/geometry/geometryEngine", "esri/Graphic"], { css: false })
        .then(([SketchViewModel,geometryEngine,Graphic]) => {

            view.popup.close();

            const sketchViewModel = new SketchViewModel({
                view: view,
                layer: _this.state.polylineGraphicsLayer
              });

          sketchViewModel.create("polyline");
        
          sketchViewModel.on("create", async (event) => {

            
            if (event.state === "complete") {

                this.setState({
                    pointerEvent:'auto'
                })

                const graphic = new Graphic({
                    geometry: event.graphic.geometry,
                    symbol: {
                        type: "simple-line", // autocasts as new SimpleFillSymbol
                        color: "#EBEB00",
                        width: 2,
                        cap: "round",
                        join: "round"
                    }

                });

                _this.state.polylineGraphicsLayer.graphics.add(graphic)

                var polylineLength = geometryEngine.geodesicLength(graphic.geometry, "meters");

                let textSymbol = {
                    type: "text",  // autocasts as new TextSymbol()
                    color: "white",
                    haloColor: "black",
                    haloSize: 2,
                    text: polylineLength.toFixed(3) + " meter",
                    xoffset: 3,
                    yoffset: 3,
                    angle: -48,
                    horizontalAlignment: "right",
                    font: {  // autocasts as new Font()
                        size: 12,
                        family: "sans-serif",
                        weight: "bold"
                    }
                }

                let graphicLabel = new Graphic({
                    geometry: graphic.geometry.extent.center,
                    //southCPEAttributes: item.southCPEAttributes,
                    symbol: textSymbol,
                    labelPlacement: "above-along",
                })
                view.graphics.add(graphicLabel)
                
            }
         

          });

        })
}

clearSelections = () => {

    this.props.summaryTableFun(false)

    this.state.polylineGraphicsLayer.removeAll()
    this.props.view.graphics.removeAll()

    this.setState({
        selectionTable:false,
        centerCPEAttributes:false,
        centerCPETable:false,
    })

   if(this.state.polygonGraphicsLayer !== null){

        this.state.polygonGraphicsLayer.removeAll()
        this.props.changeMapHeight('77vh')
        
    }

    if(this.state.centerCPEHighlight){

        this.state.centerCPEHighlight.remove()
    }
    
}
            /*********************** Toggle to view download Link ************************/

centerCPEtoggle = () => {
    this.setState({
        centerCPEtoggle:true
    })
}

            /***************  Download Table to CSV file ******************************/

centerCPEdownload = (filename) => {

    setTimeout(()=>{
        this.csvLink_centralCPE.current.link.click()
    })
}
            

render(){
    return (
        <div>
            <div
                ref={this.selectByPolygon}
                class="esri-widget esri-widget--button esri-widget esri-interactive"
                title="Select features by polygon"
                onClick={this.selectByGraphic}
                style={{pointerEvents:this.state.pointerEvent,visibility:this.state.visibility}}
            >
            <span class="esri-icon-polygon"></span>
            </div>

            <div
                ref={this.polyline}
                onClick={(e) => this.drawPolyline(e)}
                className="esri-widget esri-widget--button esri-interactive"
                title="Draw polyline"
                style={{pointerEvents:this.state.pointerEvent,visibility:this.state.visibility}}
                >
                <span className="esri-icon-polyline"></span>

            </div>

            <div
                ref={this.clearSelection}
                class="esri-widget esri-widget--button esri-widget esri-interactive"
                title="Clear selection"
                onClick={this.clearSelections}
                style={{pointerEvents:this.state.pointerEvent,visibility:this.state.visibility}}
                >
                <span class="esri-icon-erase"></span>
            </div>

            <div style={{backgroundColor: 'rgb(52, 58, 64)'}}>   

            {this.state.selectionTable ?
                <ul class="nav nav-tabs" navbar>

                {/************************ Selection Tab of Table **********************/}

                {this.state.centerCPEnav ?
                    <li className="centerCPE-tab" onClick={this.centerCPEtoggle}><a data-toggle="tab" href="#centerCPE">Selected Customer</a></li>
                    :
                    null
                }
                {/************************* Download Link **********************/}

                {this.state.centerCPEtoggle ?
                    <NavItem className="ml-auto">
                        <NavLink onClick={() => this.centerCPEdownload('Selected-centralCPE.csv')}><i class="fas fa-file-download"></i></NavLink>
                        <CSVLink 
                               headers={this.headers}
                               data={this.state.centerCPEAttributes.map(e=>{
                                   return e.attributes
                               })}
                               filename="selected-centralCPE.csv"
                               ref={this.csvLink_centralCPE}
                           />
                    </NavItem>
                
                :
                null
                }
                 
                </ul>

                : null
                }
            {/**************************** South customer Table ********************************/}
            {this.state.centerCPETable ?

            <div className="tab-content">

                <div id="centerCPE" class="tab-pane fade in active">
                    <table id="centerCPEcsv" className="graphicTable">
                        <thead className="thead">
                            <tr>
                                <th><strong>Name</strong></th>
                                <th><strong>ID</strong></th>
                                <th><strong>Address</strong></th>
                                <th><strong>Type</strong></th>
                                <th><strong>OLT</strong></th>
                                <th><strong>Frame</strong></th>
                                <th><strong>Slot</strong></th>
                                <th><strong>Port</strong></th>
                                <th><strong>ONT ID</strong></th>
                                <th><strong>ONT Model</strong></th>
                                <th><strong>Alarm</strong></th>
                                <th><strong>Bandwidth</strong></th>
                                <th><strong>Last Up Time</strong></th>
                                <th><strong>Last Down Time</strong></th>
                                
                            </tr>
                        </thead>

                        <tbody className="tbody">
                        {
                            this.state.centerCPEAttributes.map((data,index) => {
                            return (
                                    
                                <tr key={index}>
                                    <td>{data.attributes.name}</td>
                                    <td>{data.attributes.id}</td>
                                    <td>{data.attributes.address}</td>
                                    <td>{data.attributes.type}</td>
                                    <td>{data.attributes.olt}</td>
                                    <td>{data.attributes.frame}</td>
                                    <td>{data.attributes.slot}</td>
                                    <td>{data.attributes.port}</td>
                                    <td>{data.attributes.ontid}</td>
                                    <td>{data.attributes.ontmodel}</td>
                                    <td>{data.attributes.alarminfo}</td>
                                    <td>{data.attributes.bandwidth}</td>
                                    <td>{data.attributes.lastuptime}</td>
                                    <td>{data.attributes.lastdowntime}</td>
                                </tr>
                                )
                    
                            })
                        }
                        </tbody>
                    
                    </table>
                </div>

            </div>
                
            :
            null
            }

            </div>
        </div>
    )
}
   
}