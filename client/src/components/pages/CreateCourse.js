import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../layout/Header";
import axios from "axios";
import {
    Container,
    InputGroup,
    FormControl
  } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default class CreateCourse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      name: '',
      code: '',
      term: '',
      newCourse: '',
    };
  }

  componentDidMount() {
    axios({
        method: "GET",
        withCredentials: true,
        url: "/user",
      }).then((res) => {
        this.setState({ userID: res.data._id });
    });
  }

    onChangeName(e) {
        this.setState({
            name: e.target.value,
        });
    }

    onChangeCode(e) {
        this.setState({
            code: e.target.value,
        });
    }

    onChangeTerm(e) {
        this.setState({
            term: e.target.value,
        });
    }

  saveDB() {
    axios({
      method: "POST",
      data: {
        courseName: this.state.name,
        courseCode: this.state.code,
        term: this.state.term
      },
      withCredentials: true,
      url: `/course/courseList/add`,
    }).then((res) => {
        // this.setState({ newCourse: res.data });

        axios.post('/user/addCourse', {
            userID: this.state.userID,
            courseID: res.data,
          }).then((res) => {
            console.log(res);
          });

        console.log(res);
    });

  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3 style={Title}>Add Course</h3>
        </div>
        <main style={main}>
        <div style={backgroundaddCourse}>
        <p style={courseCode}>Course Information</p>
          <InputGroup style={inputStyle}>
            <FormControl
              placeholder="Course Name"
              value={this.state.name}
              onChange={this.onChangeName.bind(this)}
            ></FormControl>
            </InputGroup>
            <InputGroup style={inputStyle}>
            <FormControl
              placeholder="Course Code"
              value={this.state.code}
              onChange={this.onChangeCode.bind(this)}
            ></FormControl>
            </InputGroup>
            <InputGroup style={inputStyle}>
            <FormControl
              placeholder="Term"
              value={this.state.term}
              onChange={this.onChangeTerm.bind(this)}
            ></FormControl>
            </InputGroup>
            <Link
              to={{
                pathname: "/coursedashboard",
                state: { forum: this.state }
              }}
            >
              <Button
                  variant="secondary"
                  style={buttonStyle}
                  onClick={this.saveDB.bind(this)}
                >
                  Add Course
                </Button>
            </Link>
        </div>
        </main>
      </React.Fragment>
    );
  }
}

const formStyle = {
    padding: "1%",
    border: "2px solid black",
    background: "#343a40",
    color: "white",
  };

const inputStyle = {
    marginTop: "2%",
    paddingLeft: "0px",
};

const Title = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const buttonStyle = {
    padding: "3px",
    float: "right",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: "3% 0% 0% 1%",
};

const background = {
  border: "1px solid black",
  margin: "2% 10%",
  paddingTop: "1%",
  borderRadius: "5px",
  background: "#343a40",
};

const main = {
  margin: "5% 0% 0% 0%",
}

const courseCode = {
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
  paddingBottom: "1%",
};

const backgroundaddCourse = {
  border: "1px solid black",
  margin: "2% 10%",
  borderRadius: "5px",
  background: "#343a40",
  padding: "1%",
};
