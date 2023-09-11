import React from "react";
import MapContext from "../../context/mapContext";
import { loadModules, setDefaultOptions } from "esri-loader";
import { listItems } from "./listItems";
import {triggerAction} from './triggerAction'
import { version } from "../../url";
import './layerlist.css';
import Parcels from "../../map-items/layers/Parcels";

setDefaultOptions({ version: version });

let layers

export default class LayerList extends React.Component {
  static contextType = MapContext;
  constructor(props) {
    super(props);
    this.state = {
      parcelLayer:null
    };

    this.layerLists = React.createRef();
  }

  layers = () => {
    let view = this.props.view;
    let {
      customer,
      recentDown,
      graphicLayer,
      InactiveCPE,
      DC_ODB,
      FAT,
      Joint,
      POP,
      Feeder,
      Distribution,
      Backhaul,
      Zone,
      Outage,
      province,
      graphicLayerOffice,
      graphicLayerLOSiDC,
      graphicLayerLOPDC,
      loginRole
    } = this.context.view;

    loadModules(
      ["esri/layers/GroupLayer",],{ css: false }).then(([ GroupLayer]) => {
        
        let customerList = new GroupLayer({
          title:'Customers',
          layers:[InactiveCPE,customer]
        });

        let fiber = new GroupLayer({
          title:'Fiber',
          layers:[Backhaul,Distribution,Feeder],
          visible: false,
        });

        layers = new GroupLayer({
          title:"Network Layer",
          listMode:'show',
         // layers:[Zone,fiber,POP,Joint, DC_ODB,FAT,customerList,graphicLayer]
        });

        if(loginRole.role === 'Admin'){
          layers.layers = [Zone,fiber,POP,Joint, DC_ODB,FAT,customerList]
        }
        else{
          layers.layers = [Zone,fiber,POP,Joint, DC_ODB,FAT,customer]
        }
        view.map.add(this.state.parcelLayer)
        view.map.add(layers)
        view.map.add(Outage)
        view.map.add(graphicLayer)
        view.map.add(recentDown);
       // view.map.add(graphicLayerLOSiDC);
        view.map.add(province);
        view.map.add(graphicLayerOffice);
    })
  }

  componentDidMount() {
    let _this = this
    let view = this.props.view;

    this.layers()

    loadModules(
      ["esri/widgets/LayerList"],{ css: false }).then(([ LayerList]) => {
        let layerList = new LayerList({
            view:view,
            container:this.layerLists.current,
            listItemCreatedFunction: function (event) {
              listItems(event);
            },
        });

        layerList.on("trigger-action", function(event){
          let id = event.action.id
          triggerAction(id,view,_this.context.view)
        })
  
    });
  }

  fromChild = (e) =>{
    this.setState({
      parcelLayer:e
    })
    }

    componentDidUpdate(prevProps, prevState){
      if(prevState.parcelLayer !== this.state.parcelLayer){
   
        this.props.view.map.removeAll()
        this.layers()
      }

    }
  render() {
    return <>
      <div className="layerlist" ref={this.layerLists}></div>
      <Parcels view={this.props.view} parcelLayer={this.fromChild} />
    </>
  }
}
