import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

// For some reason, react-bootstrap does not seem to have a page footer
function Footer() {
  return (
    <footer
      className="navbar fixed-bottom"
      style={{
        paddingTop: "2rem",
        paddingBottom: "3rem",
        backgroundColor: "#343a40",
        position: "relative",
      }}
    >
      <Container fluid>
        <Row className="justify-content-around" style={{ width: "100%" }}>
          <Link to="/coursedashboard">Home</Link>
          <Link to="/login">Log In</Link>
          <Link to="/login">Sign Up</Link>
          <a href="#">Source Code</a>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
