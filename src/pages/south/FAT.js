import React from "react";
import mapContext from "../../context/mapContext";

export default class FAT extends React.Component {
  static contextType = mapContext;
  constructor(props){
    super(props);
    this.state={
        latitude:null,
        longitude:null
    }
  }
  componentDidMount() {
    let context = this.context;

    let fatLayer = context.view.southFAT;

    let view = this.props.view;
    let map = this.props.map;

    const wf_status = "$feature.wf_status";

    const valueExpression = `When (${wf_status} == 0 , 'Status-AsBuilt' ,${wf_status} == 1 , 'Status-Design','none')`;

    var rendererCheck = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      valueExpression: valueExpression,
      uniqueValueInfos: [
        /************************  As Built Network ***********************/
        {
          value: "Status-AsBuilt", //02F AsBuilt
          symbol: {
            type: "picture-marker",
            url: "images/pink_fat.png",
            width: "17px",
            height: "17px",
          },
        },
        /************************  Design Network ***********************/
        {
          value: "Status-Design", //02F Design
          symbol: {
            type: "picture-marker",
            url: "images/black_fat.png",
            width: "13px",
            height: "13px",
          },
        },
      ],
    };

    let labelClassFAT = {
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: 1,
        font: {
          family: "Arial",
          size: 8,
          weight: "bold",
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: `$feature.name + " - " + $feature.id`,
      },
    };

    fatLayer.renderer = rendererCheck;
    fatLayer.labelingInfo = labelClassFAT;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            this.setState({
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            })

        },
        (error) => {
          console.log(error);
        }
      );
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState !== this.state){
        console.log(this.state)
    }
  }

  render() {
    return null;
  }
}
