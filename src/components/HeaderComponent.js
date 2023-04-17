import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileCsv, faRightFromBracket, faGlobe } from '@fortawesome/free-solid-svg-icons'
import {Loading} from './loading/LoadingComponent'
import { loadModules, setDefaultOptions } from "esri-loader";
import {UpdateCPEStatus} from './UpdateCPEStatus'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { authenticationService } from "../_services/authentication";

import mapContext from "../context/mapContext";
import CSV from '../pages/appWidget/csvFileUploader/CSV'
import "./css/header.css";
import axios from 'axios'
import histroy from "../history";

import {version} from '../url'
setDefaultOptions({ version: version })

class Header extends Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);

    this.state = {
      checked: true,
      isNavOpen: false,
      isModalOpen: false,
      selectLOS: null,
      vehicleName: null,
      pointerEvent: "none",
      loading:null
    };

    this.toggleNav = this.toggleNav.bind(this);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  logout = () => {
    
   /*   if(authenticationService.currentUserValue){
      axios.post('http://gis.tes.com.pk:28200/user/logout', {
        username:authenticationService.currentUserValue.username,
        role:authenticationService.currentUserValue.role,
        region:authenticationService.currentUserValue.region,
        token:authenticationService.currentUserValue.token,
     })

      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }); 
    }   */ 
      

   // console.log(authenticationService.currentUserValue);
    authenticationService.logout();
 

  };

  toggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen, // true
    });
  }
  toggleDrop() {
    this.setState({
      isNavOpen: !this.state.isNavOpen, // true
    });
  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  dateWidgetClose = (e) => {
    this.setState({
      isModalOpen: e,
    });
  };

  getSelected = (e) => {
    let _this = this
    const { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    if (loginRole.role !== null) {

      if (loginRole.role === "Admin" || loginRole.role === "CSD") {

        var southQueryAdmin = southCPELayer.createQuery();
        var northQueryAdmin = northCPELayer.createQuery();
        var centralQueryAdmin = centralCPELayer.createQuery();

        let values = [];
        const checkboxes = document.querySelectorAll(
          "input[name='status']:checked"
        );

        checkboxes.forEach((checkbox) => {
          values.push(parseInt(checkbox.value));

          var queryExpression = `alarmstate in (${values}) AND status = 'Active'`;

          southCPELayer.definitionExpression = queryExpression;
          southQueryAdmin.where = queryExpression;

          northCPELayer.definitionExpression = queryExpression;
          northQueryAdmin.where = queryExpression;

          centralCPELayer.definitionExpression = queryExpression;
          centralQueryAdmin.where = queryExpression;

          southCPELayer.refresh();
          northCPELayer.refresh();
          centralCPELayer.refresh();
          
          this.setState({
            loading:"Loading....."
          })

          loadModules(["esri/core/watchUtils"], {
            css: false,
          }).then(([watchUtils]) => {

            this.props.view.when(() =>{
              watchUtils.whenFalse(this.props.view, "updating", () => {
                this.setState({loading:null})
              
              })
            })
          })

          _this.props.SouthTicket("No Ticket")
          _this.props.NorthTicket("No Ticket")
          _this.props.CentralTicket("No Ticket")

        });

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.southCPEstatus(res);
            _this.props.northCPEstatus(res);
            _this.props.centralCPEstatus(res);
        })

        return values;
      }

      if (loginRole.role === "SouthDEVuser") {

        var southQuery = southCPELayer.createQuery();

        let values = [];
        const checkboxes = document.querySelectorAll(
          "input[name='status']:checked"
        );

        checkboxes.forEach((checkbox) => {
          values.push(parseInt(checkbox.value));

          var queryExpression = `alarmstate in (${values}) AND status = 'Active'`;

          southCPELayer.definitionExpression = queryExpression;
          southQuery.where = queryExpression;
          southCPELayer.refresh();
          
          this.setState({
            loading:"Loading....."
          })

          loadModules(["esri/core/watchUtils"], {
            css: false,
          }).then(([watchUtils]) => {

            this.props.view.when(() =>{
              watchUtils.whenFalse(this.props.view, "updating", () => {
                this.setState({loading:null})
              
              })
            })
          })
        
          this.props.ticket("No Ticket")


        });
   
        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.southCPEstatus(res);
        })

        return values;
      }

      if (loginRole.role === "NorthDEVuser") {

        var northQuery = northCPELayer.createQuery();

        let values = [];
        const checkboxes = document.querySelectorAll(
          "input[name='status']:checked"
        );

        checkboxes.forEach((checkbox) => {
          values.push(parseInt(checkbox.value));

          var queryExpression = `alarmstate in (${values}) AND status = 'Active'`;

          northCPELayer.definitionExpression = queryExpression;
          northQuery.where = queryExpression;

          northCPELayer.refresh();
          
          this.setState({
            loading:"Loading....."
          })

          loadModules(["esri/core/watchUtils"], {
            css: false,
          }).then(([watchUtils]) => {

            this.props.view.when(() =>{

              watchUtils.whenFalse(this.props.view, "updating", () => this.setState({loading:null}))
              
            })
          })

          this.props.ticket("No Ticket")
   
        });

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.northCPEstatus(res);
        })

        return values;
      }

      if (loginRole.role === "CentralDEVuser") {

        var centralQuery = centralCPELayer.createQuery();

        let values = [];
        const checkboxes = document.querySelectorAll(
          "input[name='status']:checked"
        );

        checkboxes.forEach((checkbox) => {
          values.push(parseInt(checkbox.value));

          var queryExpression = `alarmstate in (${values}) AND status = 'Active'`;

          centralCPELayer.definitionExpression = queryExpression;
          centralQuery.where = queryExpression;

          centralCPELayer.refresh();
          
          this.setState({
            loading:"Loading....."
          })

          loadModules(["esri/core/watchUtils"], {
            css: false,
          }).then(([watchUtils]) => {

            this.props.view.when(() =>{

              watchUtils.whenFalse(this.props.view, "updating", () => this.setState({loading:null}))
              
            })
          })

          this.props.ticket("No Ticket")

        });

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.centralCPEstatus(res);
        })

        return values;
      }

    }


  };

  componentDidMount() {
    window.$(".checkbox-dropdown").click(function () {
      window.$(this).toggleClass("is-active");
    });

    window.$(".checkbox-dropdown ul").click(function (e) {
      e.stopPropagation();
    });
  }

  selectAll = () => {
    let _this = this

    const { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    const cbs = document.querySelectorAll('input[name="status"]');
    cbs.forEach((cb) => {
      cb.checked = this.state.checked;
    });

    this.setState({
      checked: !this.state.checked,
    });

    if (!this.state.checked) {
      let queryExpression = `alarmstate in (2) AND status = 'Active'`;

      if (loginRole.role === "Admin" || loginRole.role === "CSD") {
        southCPELayer.definitionExpression = queryExpression;
        northCPELayer.definitionExpression = queryExpression;
        centralCPELayer.definitionExpression = queryExpression;

        southCPELayer.refresh();
        northCPELayer.refresh();
        centralCPELayer.refresh();
          
        this.setState({
          loading:"Loading....."
        })

        loadModules(["esri/core/watchUtils"], {
          css: false,
        }).then(([watchUtils]) => {

          _this.props.view.when(() =>{
            watchUtils.whenFalse(this.props.view, "updating", () => {
              this.setState({loading:null})
            
            })
          })
        })

        _this.props.SouthTicket("No Ticket")
        _this.props.NorthTicket("No Ticket")
        _this.props.CentralTicket("No Ticket")

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.southCPEstatus(res);
            _this.props.northCPEstatus(res);
            _this.props.centralCPEstatus(res);
        })

      }

      if (loginRole.role === "SouthDEVuser") {
        southCPELayer.definitionExpression = queryExpression;
        southCPELayer.refresh();
          
        this.setState({
          loading:"Loading....."
        })

        loadModules(["esri/core/watchUtils"], {
          css: false,
        }).then(([watchUtils]) => {

          this.props.view.when(() =>{
            watchUtils.whenFalse(this.props.view, "updating", () => {
              this.setState({loading:null})
            
            })
          })
        })

        this.props.ticket("No Ticket")

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.southCPEstatus(res);
        })
      }

      if (loginRole.role === "NorthDEVuser") {
        northCPELayer.definitionExpression = queryExpression;

        northCPELayer.refresh();
          
        this.setState({
          loading:"Loading....."
        })

        loadModules(["esri/core/watchUtils"], {
          css: false,
        }).then(([watchUtils]) => {

          this.props.view.when(() =>{
            watchUtils.whenFalse(this.props.view, "updating", () => {
              this.setState({loading:null})
            
            })
          })
        })

        this.props.ticket("No Ticket")

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.northCPEstatus(res);
        })

        this.props.ticket("No Ticket")
      }

      if (loginRole.role === "CentralDEVuser") {
        centralCPELayer.definitionExpression = queryExpression;

        centralCPELayer.refresh();
          
        this.setState({
          loading:"Loading....."
        })

        loadModules(["esri/core/watchUtils"], {
          css: false,
        }).then(([watchUtils]) => {

          this.props.view.when(() =>{
            watchUtils.whenFalse(this.props.view, "updating", () => {
              this.setState({loading:null})
            
            })
          })
        })

        this.props.ticket("No Ticket")

        let CPEStatus = UpdateCPEStatus(loginRole, southCPELayer, northCPELayer, centralCPELayer)
        CPEStatus.then((res) =>{
          _this.props.centralCPEstatus(res);
        })

        this.props.ticket("No Ticket")
      }
    }

  };

  selectLOSbyDateFun = (e) => {
    this.props.selectLOSbyDate(e);
  };

  inputData = (e) => {
    let vehicle = e.target.value;
    this.setState({
      vehicleName: vehicle.toUpperCase(),
      pointerEvent: "auto",
    });
  };

  showState = () => {
    this.props.search.forEach((e) => {
      if (e.reg_no === this.state.vehicleName) {
        this.props.view.goTo({
          center: [e.Longitude, e.Latitude],
          zoom: 18,
        });
      }
    });
  };

  tickets = () => {
    const { loginRole, southCPELayer, northCPELayer, centralCPELayer } =
      this.context.view;

    const cbs = document.querySelectorAll('input[name="status"]:checked');

    if (cbs.length === 0) {
      var queryExpression = `ticketstatus = 'In-process' AND status = 'Active'`;

      if (loginRole.role === "Admin" || loginRole.role === "CSD") {
        southCPELayer.definitionExpression = queryExpression;
        northCPELayer.definitionExpression = queryExpression;
        centralCPELayer.definitionExpression = queryExpression;

        this.props.SouthTicket("All Ticket")
        this.props.NorthTicket("All Ticket")
        this.props.CentralTicket("All Ticket")

      }

      if (loginRole.role === "SouthDEVuser") {
        southCPELayer.definitionExpression = queryExpression;
        this.props.ticket("All Ticket")
      }

      if (loginRole.role === "NorthDEVuser") {
        northCPELayer.definitionExpression = queryExpression;
        this.props.ticket("All Ticket")
      }

      if (loginRole.role === "CentralDEVuser") {
        centralCPELayer.definitionExpression = queryExpression;
        this.props.ticket("All Ticket")
      }
    } else {
     
      alert("please uncheck the all check boxes");
    }
  };

  getFile = (e) => {
    if(e.target.title === "Upload CSV"){
      this.props.file("Upload CSV")
    }
    else if(e.target.title === "Upload KML"){
      this.props.file("Upload KML")
    }
  }

  render() {
    return (
      <div className="HeaderComponent">
        <Navbar color="dark" dark expand="md">
          <NavbarToggler onClick={this.toggleNav} />
          <NavbarBrand style={{ color: "#1f91f3" }}>Transworld</NavbarBrand>
          {this.context.view.loginRole.role === "TWA" ? null : (
            <>
              {this.context.view.loginRole.role === "CSD" ? null : (
                <div className="input-group" style={styles.inputGroup}>
                  <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search Vehicle"
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={this.inputData}
                    style={styles.TrackInput}
                  />

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={this.showState}
                    style={{
                      pointerEvent: this.state.pointerEvent,
                      color: "#2690f3",
                    }}
                  >
                    Search
                  </button>
                </div>
                
              )}
            </>
          )}
          
          <Collapse isOpen={this.state.isNavOpen} navbar>
            {/*  <Nav navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle style={{color: 'rgb(38, 144, 243)'}} nav caret>
                  <span title="Upload File" className="UploadFile" >
                    <FontAwesomeIcon icon={faFile} />  Upload File
                  </span>
                </DropdownToggle>

                <DropdownMenu
                  onClick={(e) => this.getFile(e)}
                  style={styles.dropdown}
                  center
                > 
                 <NavItem style={styles.dropToggle} >
                  <span title="Upload CSV" className="UploadCSV" >
                    <FontAwesomeIcon icon={faFileCsv} /> Upload CSV
                  </span>
                </NavItem>

                <NavItem style={styles.dropToggle} >
                  <span title="Upload KML" className="UploadCSV" >
                    <FontAwesomeIcon icon={faGlobe} /> Upload KML
                  </span>
                </NavItem>
                
                </DropdownMenu>
              </UncontrolledDropdown> 
            </Nav>  */}

            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle style={{color: 'rgb(38, 144, 243)'}} nav caret>
                  <span  className="CustomerStatus" >Customer Status</span> 
                </DropdownToggle>

                <DropdownMenu
                  onClick={this.getSelected}
                  style={styles.dropdown}
                  center
                >
                  <NavItem>
                    <label>
                      <input
                        style={styles.input}
                        onClick={this.selectAll}
                        type="checkbox"
                      />{" "}
                      All
                    </label>
                  </NavItem>
                  <NavItem>
                    <label>
                      <input
                        style={styles.input}
                        type="checkbox"
                        id="online"
                        value="0"
                        name="status"
                      />{" "}
                      Online
                    </label>
                  </NavItem>
                  <NavItem>
                    <label>
                      <input
                        style={styles.input}
                        type="checkbox"
                        id="poweredOff"
                        value="1"
                        name="status"
                      />{" "}
                      Powered Off
                    </label>
                  </NavItem>
                  <NavItem>
                    <label>
                      <input
                        style={styles.input}
                        type="checkbox"
                        id="linkDown"
                        value="2"
                        name="status"
                      />{" "}
                      Link Down
                    </label>
                  </NavItem>
                  <NavItem>
                    <label>
                      <input
                        style={styles.input}
                        type="checkbox"
                        id="gemPacketLoss"
                        value="3"
                        name="status"
                        
                      />{" "}
                      GEM Packet Loss
                    </label>
                  </NavItem>
                  <NavItem>
                    <label>
                      <input
                        style={styles.input}
                        type="checkbox"
                        id="lowOpticalPower"
                        value="4"
                        name="status"
                      />{" "}
                      Low Optical Power
                    </label>
                  </NavItem>

                  {this.context.view.loginRole.role === "TWA" ? null : (
                    <NavItem>
                      <button onClick={this.tickets} style={styles.ticket}>
                        Ticket
                      </button> <br />
                    </NavItem>
                  )}
                  <NavItem>
                      <h7 style={{color:'red'}}>{this.state.loading}</h7>
                     
                  </NavItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <NavItem>
                <NavLink style={{color:'rgb(31, 145, 243)'}} className="nav-link" to="/login" onClick={this.logout}>
                  <span className="logout">
                  <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                  </span>
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const styles = {
  dropItem: {
    color: "#1f91f3",
  },
  filterItem: {
    padding: "10px",
  },
  dropDown: {
    marginRight: "15px",
  },
  dropdown: {
    background: "rgb(52, 58, 64)",
    color: "#1f91f3",
    fontSize: "14px",
    padding: "9px",
  },
  input: {
    marginRight: "5px",
  },
  inputGroup: {
    width: "17%",
  },
  TrackInput: {
    width: "0%",
    background: "#242424",
    border: "black",
    color: "#d3d3d3",
    fontSize: "13px",
  },
  ticket: {
    width: "100%",
    color: "white",
    backgroundColor: "#247ac5",
    border: "none",
    cursor: "pointer",
  },
};

export default Header;
