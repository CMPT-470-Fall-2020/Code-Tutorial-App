// Function based component
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';

export default class Header extends Component {
    
    onLogout(e){
        console.log("CALLED");
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/logout",
          }).then((res) => {
            window.location.href="/login";
        });
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Learning Platform</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <NavDropdown title="Tutorials" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/CourseDashboard">Dashboard</NavDropdown.Item>
                        <NavDropdown.Item href="/CreateTutorial">Create Tutorial</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/CodePlayground">Code Playground</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Button onClick={this.onLogout.bind(this)} style={logoutStyle}>Logout</Button>
            </Navbar>
        )
    }
}

const logoutStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,.5)'
}