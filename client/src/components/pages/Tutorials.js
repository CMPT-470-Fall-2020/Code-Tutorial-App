import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./../layout/Header";
import axios from "axios";
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Tutorials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.location.state.course._id,
      tutorials: [],
    };
  }

  componentDidMount() {
    // get tutorials list object from server
    axios
      .get(`/tutorial/${this.state.course}`)
      .then((res) => {
        this.setState({ tutorials: res.data });
        console.log("tutorial/courseid returned", res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createTutorialList() {
    return this.state.tutorials.map((tutorial, key) => (
      <Link
        key={key}
        to={{
          pathname: "/runtutorial",
          state: { tutorial },
        }}
      >
        <div style={background}>
          <div style={tutorialCard}>
            <div style={name}>{tutorial.tutorialName}</div>
          </div>
        </div>
      </Link>
    ));
  }

  render() {
    return (
      <React.Fragment>
        {this.props.location.pathname !== "/login" && <Header />}
        <div>
          <h3 style={tutorialTitle}>{this.state.tutorialSelected} Tutorials</h3>
          <main>{this.createTutorialList()}</main>
        </div>
      </React.Fragment>
    );
  }
}

const background = {
  border: "1px solid black",
  margin: "2% 10%",
  paddingTop: "5%",
  borderRadius: "5px",
  background: "#343a40",
};

const tutorialTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const tutorialCard = {
  padding: "1%",
  border: "1px solid black",
  background: "white",
};

const name = {
  color: "#343a40",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
};
