import React, { Component, createRef } from 'react'
import { loadModules, setDefaultOptions } from "esri-loader";
import NewSplitter from './NewSplitter';
import './css/addSplittter.css'
import axios from 'axios'
import {authenticate, version} from '../../../url'
setDefaultOptions({ version: version })

export default class AddSplitters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: true,
      newSplitter: false,
      existingSplitter: false,

      dcInput:null,
      splitterInput:null,
    };

    this.form = createRef();
    this.submit = this.submit.bind(this)
    this.initial = this.initial.bind(this)
  }
  componentDidMount() {
    loadModules(["esri/widgets/Expand"], { css: false }).then(([Expand]) => {
      var searchWidget = new Expand({
        content: this.form.current,
        view: this.props.view,
        group: "bottom-right",
        expanded: false,
        expandIconClass: "esri-icon-documentation",
      });

      this.props.view.ui.add(searchWidget, "top-right");
    });
  }

  submit(event) {
    let _this = this
    if (event.target.value === "Existing") {
  
    /*   this.setState({
        initial: false,
        newSplitter: false,
        existingSplitter: true,
      }) */;
    } else if (event.target.value === "New") {
     
   /*    this.setState({
        initial: false,
        existingSplitter: false,
        newSplitter: true,
      }); */

      var input = prompt("Enter DC ID")
      if(/^21\d{2}\d{3}$/.test(input)){
          axios.post('http://localhost:2000/new/splitter',{
            dc:parseInt(input)
          })
          .then(function(res){
              if(res.data === 402){
                alert(`Duplication..! Please Enter the new ID`)
             
              }else{

                _this.setState({
                  initial: false,
                  existingSplitter: false,
                  newSplitter: true,
                  dcInput:parseInt(input),
                  splitterInput:`${input}/01`
                })
              }
          })
      }
      else{
        alert('Prefix is wrong')
      }
      
    }
  }

  componentDidUpdate(prevProps, prevState){
   
  }

  initial(e){
    this.setState({
      initial:e,
      existingSplitter: false,
      newSplitter: false,
    })
  }

  render() {
    return (
      <div className="main" ref={this.form}>
        {this.state.initial && (
          <div className='inital'>
              <h6> Assign Splitter ID</h6>
              <p className="initial-para">
                Do you want to add Splitter in existing Cabinet/Box{" "}
              </p>
              <button
                className="initial-btn"
                value="Existing"
                onClick={this.submit}
              >
                Existing Cabinet/Box
              </button>{" "}
              <br />
              <br />
              <p className="initial-para">
                Do you want to add Splitter in new Cabinet/Box{" "}
              </p>
              <button className="initial-btn" value="New" onClick={this.submit}>
                New Cabinet/Box
              </button>
         
       
          </div>
        )}
        
        {this.state.newSplitter &&  <NewSplitter initial={this.initial} dcInput={this.state.dcInput}
        splitterInput={this.state.splitterInput} />}
     
      </div>
    );
  }
}
