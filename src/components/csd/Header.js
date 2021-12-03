import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem,Dropdown,DropdownToggle,
    DropdownMenu,DropdownItem,UncontrolledDropdown,Modal, ModalHeader, ModalBody} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { authenticationService } from '../../_services/authentication';

import '../../pages/csd/widget/css/widget.css'


class Header extends Component {
    
  constructor(props) {
    super(props);

    this.state = {
        checked:true,
        isNavOpen: false,
        isModalOpen: false,
        selectLOS:null

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

  render() {
    return(
        <div>
            <Navbar color="dark" dark expand="md">
                    <NavbarToggler onClick={this.toggleNav} />
                    <NavbarBrand style={{color:'#1f91f3'}}>Transworld</NavbarBrand>
                   
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                        <Nav  className="ml-auto" navbar>
                            <NavItem>
                                <NavLink className="nav-link"  to='/login' onClick={this.logout}><span className="fa fa-sign-in fa-lg"></span> Logout</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
             
            </Navbar>

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
    }

}

export default Header;

