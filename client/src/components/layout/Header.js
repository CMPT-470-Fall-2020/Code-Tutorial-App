// Function based component
import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import axios from "axios";

//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
    };
  }

  componentDidMount() {
    // get user object from server
    axios({
      method: "GET",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      this.setState({ user: res.data }); // get user object containing: _id, userName, accountType
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  onLogout(e) {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/logout",
    });
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/coursedashboard">
          Learning Platform
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {this.state.user.accountType === "Student" && (
          <React.Fragment>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavDropdown title="Tutorials" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/coursedashboard">
                    Dashboard
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </React.Fragment>
        )}
        {this.state.user.accountType === "Teacher" && (
          <React.Fragment>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Item as={Link} to="/coursedashboard" style={textStyle}>
                  Dashboard
                </Nav.Item>
                &nbsp;
                <Nav.Item as={Link} to="/createtutorial" style={textStyle}>
                  Create Tutorial
                </Nav.Item>
                &nbsp;
                <Nav.Item as={Link} to="/createcourse" style={textStyle}>
                  Create Course
                </Nav.Item>
                &nbsp;
              </Nav>
            </Navbar.Collapse>
          </React.Fragment>
        )}
        <Nav.Link
          as={Link}
          to="/login"
          style={logoutStyle}
          onClick={this.onLogout.bind(this)}
        >
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

const textStyle = {
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  textAlign: "center",
  marginRight: "25px",
};
