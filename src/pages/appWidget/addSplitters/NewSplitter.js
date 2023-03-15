import React, { Component,createRef } from 'react'
import { loadModules, setDefaultOptions } from "esri-loader";
import './css/addSplittter.css'
import axios from 'axios'
import {version} from '../../../url'
setDefaultOptions({ version: version })

export default class NewSplitter extends Component {
    constructor(props){
        super(props);
        this.state = {
          splitter_id:null,
          dc:null,
          pop:null,
          splitter_type:null,
          primary_fsp:null,
          secondary_fsp:null,
          remarks:null,
          name:null
        }
    
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
        this.setState({
            splitter_id:this.props.splitterInput,
            dc:this.props.dcInput,
         
        })
    }
    handleChange(event) {
        let _this = this
        _this.setState({
          [event.target.name] : event.target.value
        })
  
        if(this.state.dc !== null){
          let pop = String(this.state.dc).slice(0,4)
          this.setState({
            pop:parseInt(pop)
          })
        }
      }
  
      handleSubmit(event) {
      const { splitter_id, dc, pop } = this.state
      event.preventDefault();
        console.log(this.state)

        this.props.initial(true)
     
    }


  render() {
    return (
        <form  className="splitterForm"  onSubmit={this.handleSubmit}>
        <label className='heading'>Add Splitters</label>
   
        <label>Splitter ID</label>
        <input type="text" name="splitter_id" value={this.props.splitterInput} placeholder='Splitter ID' pattern="^\d{7}\/\d{1}\d{1,1}$" onChange={this.handleChange} required readOnly />
        <button className='generate' onClick={this.generate}> Generate ID </button> <br />

        <label>DC ID</label>
        <input type="text" name="dc" value={this.props.dcInput} placeholder='DC ID' onChange={this.handleChange} readOnly /><br />

        <label>POP ID</label>
        <input type="text" name="pop" value={this.state.pop} placeholder='POP ID' onChange={this.handleChange} readOnly /><br />

        <label>Splitter Type</label>
        <input type="text" name="splitter_type" value={this.state.splitter_type} placeholder='2x16 or 2x8' onChange={this.handleChange} required /><br />

        <label>Primary FSP</label>
        <input type="text" name="primary_fsp" value={this.state.primary_fsp} placeholder='like 0/5/1' onChange={this.handleChange} /><br />

        <label>Secondary FSP</label>
        <input type="text" name="secondary_fsp" value={this.state.secondary_fsp} placeholder='like 0/5/2' onChange={this.handleChange} /><br />

        <label>Remarks</label>
        <input type="text" name="remarks" value={this.state.remarks} placeholder='Remarks' onChange={this.handleChange} /><br />

        <label>Landmark/Name</label>
        <input type="text" name="name" value={this.state.name} placeholder='Landmark' onChange={this.handleChange} />

        <br />

        <button className='splitterSubmit' >Submit</button>

      </form>
    )
  }
}
