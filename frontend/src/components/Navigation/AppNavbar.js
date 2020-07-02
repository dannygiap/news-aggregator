import React, { Component, Fragment } from 'react';
import { logout } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RegisterModal from '../Register/Register';
import LoginModal from '../Login/Login';
import UpdateModal from '../UpdateModal/UpdateModal';
import logo from '../../crocodile.png';
import './AppNavbar.css';
import '../ArticleDropdown/ArticleDropdown.css';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class AppNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Fragment>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            <span className="navbar-text pl-3" style={{ color: '#eeeeee' }}>
              <strong>{user ? `Welcome, ${user.name}` : ''}</strong>
            </span>
          </DropdownToggle>
          <DropdownMenu right className="dark">
            <UpdateModal />
            <DropdownItem divider />
            <DropdownItem
              href="#0"
              onClick={this.props.logout}
              className="text-danger"
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <LoginModal />
        </NavItem>
        <NavItem>
          <RegisterModal />
        </NavItem>
      </Fragment>
    );

    return (
      <div>
        <Navbar expand="sm" className="darkNav mb-3 navbar-dark">
          <Container>
            <NavbarBrand
              href="#0"
              value="home"
              style={{ color: '#4ecca3' }}
              className="pl-3"
            >
              <img src={logo} className="logo" alt="alligator logo" />
              News Alligator
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(AppNavbar);
