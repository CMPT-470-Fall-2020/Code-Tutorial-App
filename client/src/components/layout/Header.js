// Function based component
import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import axios from "axios";

//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Header extends Component {
  onLogout(e) {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/logout",
    })
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/coursedashboard">
          Learning Platform
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Tutorials" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/coursedashboard">
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/createtutorial">
                Create Tutorial
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/codeplayground">
              Code Playground
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav.Link as={Link} to="/login" style={logoutStyle} onClick={this.onLogout.bind(this)}>
          Logout        
        </Nav.Link>
      </Navbar>
    );
  }
}

const logoutStyle = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,.5)",
};
