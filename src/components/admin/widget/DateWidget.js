import React from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import { loadModules, setDefaultOptions } from 'esri-loader';
import { map } from 'jquery';


export default class DateWidget extends React.Component{
    constructor(props){

        super(props);
        this.state = {
            fromDate:null,
            toDate:null,
            southLayerView:null,
            southCPEHighlight:null
        }
        this.button = React.createRef()
        this.check = React.createRef()
}

componentDidMount(){
    let _this = this
    const southCPE = this.props.south
    let southLayerViewCPE = this.props.southLayerViewCPE
    const view = this.props.view

    southCPE.when(function(){
            view.whenLayerView(southCPE).then(function (layerView) {
                _this.setState({
                    southLayerView : layerView
                })

            })
        })
}

fromDate = (e) => {

    this.setState({
        fromDate:e.target.value,
   
    })
    if(this.state.southCPEHighlight){
                
        this.state.southCPEHighlight.remove()
    }
}

toDate = (e) => {

    this.setState({
        toDate:e.target.value
    })
 
}

dateData = () => {

    let _this = this
    console.log(_this.props.southLayerViewCPE)
    const southCPE = this.props.south
    const view = this.props.view

    let south = _this.state.southLayerView.createQuery();
    
    south.where = `lastdowntime >= '${this.state.fromDate}' AND lastdowntime <= '${this.state.toDate}' AND status = 'Active' AND alarmstate = 2 `
    
    //southCPE.definitionExpression = `lastdowntime >= '${this.state.fromDate}' AND lastdowntime <= '${this.state.toDate}' AND status = 'Active' AND alarmstate = 2 `;

        _this.state.southLayerView.queryFeatures(south)
        .then(function(results){

            _this.setState({
        
                southCPEHighlight:_this.state.southLayerView.highlight(results.features),
            })
        
        })

    this.props.isModalOpen(false)
    _this.props.selectLOSbyDate(_this.state.southCPEHighlight)
 
}
    render(){
        return (
            <div className="date-form">
                <Form>
                    <FormGroup>
                        <Label>From</Label>
                        <Input type="date" className="dateClass"
                            onChange={this.fromDate}  />
                    </FormGroup>
                    <FormGroup>
                        <Label>To</Label>
                        <Input type="date"  className="dateClass" onChange={this.toDate}  />
                    </FormGroup>
                    <Button ref={this.button} onClick={this.dateData}  color="primary">Query</Button>                  
                </Form>
            </div>
        )
    }
}


/* var date = new Date(e.attributes.lastdowntime);
                let getOnlyTime = date.toLocaleTimeString('it-IT')

                let currentDate = new Date()

                let formatted_date = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + "-" + ('0' + currentDate.getDate()).slice(-2)+ " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()

                console.log(formatted_date)

                var subbed = new Date(currentDate - 1*60*60*1000); // subtract 1 hours
                let getTimeFormCurrent = subbed.toLocaleTimeString('it-IT')

                if(e.attributes.lastdowntime === formatted_date) {
                    southCPE.definitionExpression = `lastdowntime == '${formatted_date}'  AND status = 'Active' AND alarmstate = 2 `;
                    console.log(e.attributes.lastdowntime)
                    
}  */