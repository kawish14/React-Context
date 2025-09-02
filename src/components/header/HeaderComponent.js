import React, { useContext, useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";
import { NavLink } from "react-router-dom";
import { authenticationService } from "../../_services/authentication";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileCsv, faRightFromBracket, faGlobe } from '@fortawesome/free-solid-svg-icons'
import mapContext from "../../context/mapContext";
import {Nav,NavItem,DropdownToggle,DropdownMenu,UncontrolledDropdown} from "reactstrap";
import "./header.css";
import {version} from '../../url'

setDefaultOptions({ version: version })
export default class HeaderComponent extends React.Component {
  static contextType = mapContext;
  constructor(props) {
    super(props);

    this.state = {
      checked: true,
      sidebarVisible: false,
      navbarVisible: false,
      selectLOS: null,
      vehicleName: null,
      pointerEvent: "none",
      loading: null,
    };
  }
 
  toggleSidebar = () => {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
    });
    this.props.sideBarToggle(!this.state.sidebarVisible);

    if (this.state.navbarVisible) {
      this.setState({
        navbarVisible: false,
      });
    }
  };

  toggleNavbar = () => {
    this.setState({
      navbarVisible: !this.state.navbarVisible,
    });
    if (this.state.sidebarVisible) {
      this.setState({
        sidebarVisible: false,
      });
    }
  };

  logout = () => {
    authenticationService.logout();
  };

 getSelected = (e) => {
    this.regionAlarms = this.regionAlarms || {}; 

    const { customer, region } = this.context.view;
    const selectedRegion = this.props.region; // e.g. "North"

    let values = [];
    const checkboxes = document.querySelectorAll("input[name='status']:checked");
    checkboxes.forEach((checkbox) => values.push(parseInt(checkbox.value)));


    if (values.includes(0)) {
      // reset all regions to default (2)
      region.forEach(r => {
          this.regionAlarms[r] = [2,4]; 
      });

      // then apply 0 only for the selected region
      this.regionAlarms[selectedRegion] = [0];

    } else {
      // normal case: apply same alarms to all regions
      region.forEach(r => {
        this.regionAlarms[r] = [...values];
      });
    }

    // Build CQL filter with parentheses
    let regionFilters = [];
    for (const r of region) {
      const alarms = this.regionAlarms[r];
      if (alarms && alarms.length > 0) {
        regionFilters.push(
          `(region='${r}' AND alarmstate IN (${alarms.join(",")}))`
        );
      }
    }

    let ticketMode = "No Ticket"; // Default value
    if(e.target && e.target.name === "ticket"){
      if(e.target.checked){
        document.querySelectorAll("input[name='status']").forEach(cb => cb.checked = false);
        const placeholders = region.map((region, index) => `'${region}'`).join(",");
        
        const CQL_FILTER = `region in (${placeholders}) and ticketstatus = 'In-process' `;
        customer.customParameters.CQL_FILTER = CQL_FILTER;
        customer.definitionExpression = CQL_FILTER;
        
        ticketMode ="All Ticket";
        this.regionAlarms = {};
      }
    }
    else{
      const ticketCb = document.querySelector("input[name='ticket']");
      if (ticketCb) ticketCb.checked = false;

        const CQL_FILTER = regionFilters.join(" OR ");
        console.log("CQL_FILTER:", CQL_FILTER);

        customer.customParameters.CQL_FILTER = CQL_FILTER;
        customer.definitionExpression = CQL_FILTER;

        ticketMode ="No Ticket";
    }
    
    customer.refresh();

    this.setState({ loading: "Loading....." });
    //this.props.dataloading(true);

    loadModules(["esri/core/watchUtils"], { css: false }).then(([watchUtils]) => {
      this.props.view.when(() => {
        watchUtils.whenFalse(this.props.view, "updating", () => {
          this.setState({ loading: null });
          // Pass current filter state to the table component
          this.props.ticket(ticketMode); 
          this.props.onFilterChange && this.props.onFilterChange(this.regionAlarms);
          this.props.gponTable(true);
          //this.props.dataloading(false);
        });
      });
    });

    


    return values;
  };

  selectAll = () => {
    let _this = this;

    const { loginRole, customer, region } = this.context.view;

    const cbs = document.querySelectorAll('input[name="status"]');
    cbs.forEach((cb) => {
      cb.checked = this.state.checked;
    });

    this.setState({
      checked: !this.state.checked,
    });

    const placeholders = region.map((region, index) => `'${region}'`).join(",");
    if (!this.state.checked) {
      let queryExpression = `alarmstate in (2)`;

      var CQL_FILTER = `region in (${placeholders}) and alarmstate in (2)`;
      customer.customParameters.CQL_FILTER = CQL_FILTER;
      customer.definitionExpression = queryExpression;

      customer.refresh();

      this.setState({
        loading: "Loading.....",
      });

      loadModules(["esri/core/watchUtils"], {
        css: false,
      }).then(([watchUtils]) => {
        this.props.view.when(() => {
          watchUtils.whenFalse(this.props.view, "updating", () => {
            this.setState({ loading: null });
          });
        });
      });

      _this.props.ticket("No Ticket");

      _this.props.gponTable(true);
    }
    
  };

  tickets = () => {
    const { loginRole, customer, region } = this.context.view;

    const cbs = document.querySelectorAll('input[name="status"]:checked');

    if (cbs.length === 0) {
      const placeholders = region.map((region, index) => `'${region}'`).join(",");

      var queryExpression = `ticketstatus = 'In-process'`;
      var CQL_FILTER = `region in (${placeholders}) and ticketstatus = 'In-process' `;
      
      customer.customParameters.CQL_FILTER = CQL_FILTER;
      customer.definitionExpression = queryExpression;

      customer.refresh();

      this.setState({
        loading: "Loading.....",
      });

      loadModules(["esri/core/watchUtils"], {
        css: false,
      }).then(([watchUtils]) => {
        this.props.view.when(() => {
          watchUtils.whenFalse(this.props.view, "updating", () => {
            this.setState({ loading: null });
          });
        });
      });

      this.props.ticket("All Ticket");
    } else {
      alert("please uncheck the all check boxes");
    }
  };

  inputData = (e) => {
    let vehicle = e.target.value;
    this.setState({
      vehicleName: vehicle.toUpperCase(),
      pointerEvent: "auto",
    });
  };

  showState = () => {
    if (this.props.search) {
      this.props.search.forEach((e) => {
        if (e.reg_no === this.state.vehicleName) {
          this.props.view.goTo({
            center: [e.Longitude, e.Latitude],
            zoom: 18,
          });
        }
      });
    }
  };

  getFile = (e) => {
    if (e.target.title === "Upload GeoJSON") {
      this.props.file("Upload GeoJSON");
    } else if (e.target.title === "Upload KML") {
      this.props.file("Upload KML");
    }
  };

  render() {
    return (
      <>
        <div className="navbar-brand ps-2" id="heading">
          Transworld
        </div>

        <form
          className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"
          id="searchForm"
        >
          <input
            className="form-control mr-sm-2"
            placeholder="Search Vehicle"
            aria-label="Search"
            onChange={this.inputData}
          />
          <button
            className="btn my-2 my-sm-0"
            type="button"
            onClick={this.showState}
          >
            Search
          </button>
        </form>

        {/******  Navbar Button *****/}
        {/* <button
          className={`navbar-toggler custom-navbar-toggler ${
            this.state.navbarVisible ? "collapsed" : ""
          }`}
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={this.toggleNavbar}
          disabled={this.state.sidebarVisible}
        >
          <i className="fas fa-retweet"></i>
        </button> */}

        <div
          className={`collapse navbar-collapse`}
          id="navbarSupportedContent"
        ></div>
       {/*  <Nav navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle style={{color: 'rgb(38, 144, 243)'}} nav caret>
                  <span title="Upload File" className="UploadFile" >
                    <FontAwesomeIcon icon={faFile} />  Upload File
                  </span>
                </DropdownToggle>

                <DropdownMenu
                  onClick={(e) => this.getFile(e)}
                  center
                > 
                 <NavItem  >
                  <span title="Upload GeoJSON" className="UploadCSV" >
                    <FontAwesomeIcon icon={faFileCsv} /> Upload Geojson
                  </span>
                </NavItem>

                
                </DropdownMenu>
              </UncontrolledDropdown> 
            </Nav> */}

        <form className="d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <Nav className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle style={{ color: "rgb(38, 144, 243)" }} nav caret>
                <span className="CustomerStatus">Customer Status</span>
              </DropdownToggle>

              <DropdownMenu onClick={this.getSelected} center>
               {/*  <NavItem>
                  <div className="label-container">
                    <label>
                      <input onClick={this.selectAll} type="checkbox" /> All
                    </label>
                  </div>
                </NavItem> */}
                <NavItem>
                  <div className="label-container">
                    <label>
                      <input
                        type="checkbox"
                        id="online"
                        value="0"
                        name="status"
                      />{" "}
                      Online
                    </label>
                  </div>
                </NavItem>
                <NavItem>
                  <div className="label-container">
                    <label>
                      <input
                        type="checkbox"
                        id="poweredOff"
                        value="1"
                        name="status"
                      />{" "}
                      Powered Off
                    </label>
                  </div>
                </NavItem>
                <NavItem>
                  <div className="label-container">
                    <label>
                      <input
                        type="checkbox"
                        id="linkDown"
                        value="2"
                        name="status"
                      />{" "}
                      Link Down
                    </label>
                  </div>
                </NavItem>
                <NavItem>
                  <div className="label-container">
                    <label>
                      <input
                        type="checkbox"
                        id="gemPacketLoss"
                        value="3"
                        name="status"
                      />{" "}
                      GEM Packet Loss
                    </label>
                  </div>
                </NavItem>
                <NavItem>
                  <div className="label-container">
                    <label>
                      <input
                        type="checkbox"
                        id="lowOpticalPower"
                        value="4"
                        name="status"
                      />{" "}
                      Low Optical Power
                    </label>
                  </div>
                </NavItem>

                {this.context.view.loginRole.role === "TWA" ? null : (
                  <NavItem>
                  <div className="label-container">
                    <label>
                      <input
                        type="checkbox"
                        id="ticket"
                        value="In-process"
                        name="ticket"
                        disabled={this.state.loading !== null}
                      />{" "}
                      Tickets
                    </label>
                  </div>
                </NavItem>
                )}
                <NavItem>
                  <h7 style={{ color: "red" }}>{this.state.loading}</h7>
                </NavItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </form>

  {/*        <form className="d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0" id="notification">
            <Notification view={this.props.view} />   
        </form>  */}   

        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <NavLink
            style={{ color: "rgb(31, 145, 243)" }}
            className="nav-link"
            to="/login"
            onClick={this.logout}
          >
            <button className="btn my-2 my-sm-0 d-none d-sm-block">
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </NavLink>
        </form>
      </>
    );
  }
}