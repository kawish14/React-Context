import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem,Dropdown,DropdownToggle,
    DropdownMenu,DropdownItem,UncontrolledDropdown,Modal, ModalHeader, ModalBody} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { authenticationService } from '../_services/authentication';
import mapContext from '../context/mapContext'
import './css/header.css'

import DateWidget from './admin/widget/DateWidget'

class Header extends Component {
static contextType = mapContext
  constructor(props) {
    super(props);

    this.state = {
        checked:true,
        isNavOpen: false,
        isModalOpen: false,
        selectLOS:null,
        vehicleName:null,
        pointerEvent:'none'

      };

    this.toggleNav = this.toggleNav.bind(this);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
   
  }


logout = () => {
    authenticationService.logout();
    console.log(authenticationService.currentUserValue)
    
}
  toggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen // true
    });
}
toggleDrop() {
    this.setState({
      isNavOpen: !this.state.isNavOpen // true
    });
}
toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

dateWidgetClose = (e) => {
    this.setState({
        isModalOpen: e
      });
}

getSelected = () => {

    const {loginRole,southLayer} =this.context;

    if (loginRole.role !== null){
        if(loginRole.role === 'Admin'){

            var southQuery = southLayer.createQuery();
        
            let northCPEQuery = this.props.northItem.northCustomer.data
            var northQuery = northCPEQuery.createQuery();
        
            let centralCPEQuery = this.props.centerItem.centerCustomer.data
            var centralQuery = centralCPEQuery.createQuery();
          
            
            let values = [];
            const checkboxes = document.querySelectorAll("input[name='status']:checked");
        
            checkboxes.forEach((checkbox) => {
            
            values.push(parseInt(checkbox.value));
        
            var queryExpression = `alarmstate in (${values}) AND status = 'Active'`
        
            southLayer.definitionExpression = queryExpression
            southQuery.where = queryExpression
        
            northCPEQuery.definitionExpression = queryExpression
            northQuery.where = queryExpression
        
            centralCPEQuery.definitionExpression = queryExpression
            centralQuery.where = queryExpression
        
        
            });
            
           return values
        }
    
        if(loginRole.role === 'SouthDEVuser'){
            var southQuery = southLayer.createQuery();
       
            let values = [];
            const checkboxes = document.querySelectorAll("input[name='status']:checked");
        
            checkboxes.forEach((checkbox) => {
            
            values.push(parseInt(checkbox.value));
        
            var queryExpression = `alarmstate in (${values}) AND status = 'Active'`
        
            southLayer.definitionExpression = queryExpression
            southQuery.where = queryExpression
        
            });
            
           return values
        }
    
        if(loginRole.role === 'NorthDEVuser'){
      
        
            let northCPEQuery = this.props.northItem.northCustomer.data
            var northQuery = northCPEQuery.createQuery();
            
            let values = [];
            const checkboxes = document.querySelectorAll("input[name='status']:checked");
        
            checkboxes.forEach((checkbox) => {
            
            values.push(parseInt(checkbox.value));
        
            var queryExpression = `alarmstate in (${values}) AND status = 'Active'`
        
            northCPEQuery.definitionExpression = queryExpression
            northQuery.where = queryExpression
    
            });
            
           return values
        }
    
        if(loginRole.role === 'CentralDEVuser'){
    
            let centralCPEQuery = this.props.centerItem.centerCustomer.data
            var centralQuery = centralCPEQuery.createQuery();
          
            
            let values = [];
            const checkboxes = document.querySelectorAll("input[name='status']:checked");
        
            checkboxes.forEach((checkbox) => {
            
            values.push(parseInt(checkbox.value));
        
            var queryExpression = `alarmstate in (${values}) AND status = 'Active'`
        
            centralCPEQuery.definitionExpression = queryExpression
            centralQuery.where = queryExpression
        
        
            });
            
           return values
        }
    }
  

}


componentDidMount(){

    window.$(".checkbox-dropdown").click(function () {
        window.$(this).toggleClass("is-active");
    });
    
    window.$(".checkbox-dropdown ul").click(function(e) {
        e.stopPropagation();
    });
}

selectAll = () => {

    const {loginRole,southLayer} =this.context;

    const cbs = document.querySelectorAll('input[name="status"]');
    cbs.forEach((cb) => {
    
        cb.checked = this.state.checked;
    });

    this.setState({
        checked: !this.state.checked
    })

    if(!this.state.checked){

        let queryExpression =  `alarmstate in (2) AND status = 'Active'`

        if(loginRole.role === 'Admin'){

            let northCPEQuery = this.props.northItem.northCustomer.data
            let centralCPEQuery = this.props.centerItem.centerCustomer.data
            
            southLayer.definitionExpression = queryExpression
            northCPEQuery.definitionExpression = queryExpression
            centralCPEQuery.definitionExpression = queryExpression
        }

        if(loginRole.role === 'SouthDEVuser'){

            southLayer.definitionExpression = queryExpression
        }

        if(loginRole.role === 'NorthDEVuser'){
            let northCPEQuery = this.props.northItem.northCustomer.data
            northCPEQuery.definitionExpression = queryExpression
        }
        
        if(loginRole.role === 'CentralDEVuser'){
            let centralCPEQuery = this.props.centerItem.centerCustomer.data
            centralCPEQuery.definitionExpression = queryExpression
        }

    }
}
 
selectLOSbyDateFun = (e) => {

    this.props.selectLOSbyDate(e)
}

inputData = (e) => {
    this.setState({
       vehicleName:e.target.value,
       pointerEvent:'auto'

    })

 }
 
showState = () => {
   
   this.props.search.forEach(e => {
 
    if(e.reg_no === this.state.vehicleName){
 
       this.props.view.goTo({
         center:[e.Longitude, e.Latitude],
         zoom:18
       })
 
     }
 
   })
 }

render() {
    return(
        <div>
            <Navbar color="dark" dark expand="md">
                    <NavbarToggler onClick={this.toggleNav} />
                    <NavbarBrand style={{color:'#1f91f3'}}>Transworld</NavbarBrand>

                    <div  className="input-group" style={styles.inputGroup}>

                        <input type="search" className="form-control rounded" placeholder="Search Vehicle" aria-label="Search"
                        aria-describedby="search-addon" onChange={this.inputData}
                        style={styles.TrackInput}
                         />

                        <button type="button" className="btn btn-dark" onClick= {this.showState} 
                        style={{pointerEvent:this.state.pointerEvent}}
                        >Search</button>

                    </div>
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                   {/*  <Nav navbar>
                        <NavItem>
                            <div className="date-widget" onClick={this.toggleModal}><i class="far fa-calendar-alt"></i> Select By Date</div>
                        </NavItem>
                    </Nav> */}

                    <Nav  className="ml-auto" navbar>
                        
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle style={styles.dropToggle} nav caret>
                                Customer Status
                            </DropdownToggle>
                            
                            <DropdownMenu onClick={this.getSelected}  style={styles.dropdown} center>
                            <NavItem>
                                <label>
                                    <input style={styles.input} onClick={this.selectAll} type="checkbox" /> All
                                </label>
                            </NavItem>
                            <NavItem>
                                <label>
                                    <input style={styles.input} type="checkbox" id="online" value='0' name="status" />  Online
                                </label>
                            </NavItem>
                            <NavItem>
                                <label>
                                    <input style={styles.input} type="checkbox" id="poweredOff" value='1' name="status" />  Powered Off
                                </label>
                            </NavItem>
                            <NavItem>
                                <label>
                                    <input style={styles.input} type="checkbox" id="linkDown" value='2' name="status" />  Link Down
                                </label>
                            </NavItem>
                            <NavItem>
                                <label>
                                    <input style={styles.input} type="checkbox" id="gemPacketLoss" value='3' name="status" />  GEM Packet Loss
                                </label>
                            </NavItem>
                            <NavItem>
                                <label>
                                    <input style={styles.input} type="checkbox" id="lowOpticalPower" value='4' name="status" />  Low Optical Power
                                </label>
                            </NavItem>
                                    
                            </DropdownMenu>
                        </UncontrolledDropdown>
    
                        <NavItem>
                            <NavLink className="nav-link"  to='/login' onClick={this.logout}><span className="fa fa-sign-in fa-lg"></span> Logout</NavLink>
                        </NavItem>
                    </Nav>
                    </Collapse>
             
            </Navbar>

            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader className="model-date-header" toggle={this.toggleModal}>Select Link Down by Date</ModalHeader>
                <ModalBody className="model-date-body">
                   {/*  <DateWidget 
                        south = {this.props.item.customer.data}
                        isModalOpen = {(e) => {this.dateWidgetClose(e)}}
                        map = {this.props.map}
                        view = {this.props.view}
                        selectLOSbyDate ={(e) => this.selectLOSbyDateFun(e)}
                        
                        southLayerViewCPE={this.props.southLayerViewCPE}
                        northLayerViewCPE={this.props.northLayerViewCPE}
                        centralLayerViewCPE={this.props.centralLayerViewCPE}
                    /> */}
                </ModalBody>
            </Modal>
        </div>
    );
  }
}

const styles = {
    dropToggle:{
        background:"#343a40",
        color:"#1f91f3",
    },
    dropItem:{
        color:"#1f91f3",
    },
    filterItem:{
        padding: '10px'
    },
    dropDown:{
        marginRight:'15px'
    },
    dropdown:{
        background: 'rgb(52, 58, 64)',
        color: '#1f91f3',
        fontSize: '14px',
        padding: '9px',
    },
    input:{
        marginRight: '5px'
    },
    inputGroup:{
        width:'17%'
    },
    TrackInput:{
        width:"0%",
        background: '#242424',
        border: 'black',
        color: '#d3d3d3',
        fontSize: '13px'
    }

}

export default Header;

