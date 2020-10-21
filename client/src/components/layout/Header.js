// Function based component
import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Learning Platform</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown title="Tutorials" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/TutorialDashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="/Tutorial">Create Tutorial</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/CodePlayground">Code Playground</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}