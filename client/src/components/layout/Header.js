// Function based component
import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Learning Platform</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/Tutorial">Tutorials Dashboard</Nav.Link>
                <Nav.Link href="/CodePlayground">Code Playground</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}