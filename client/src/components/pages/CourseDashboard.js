import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./../layout/Header";
import {
  Container,
  InputGroup,
  FormControl
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class CourseDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      user: "",
      newCourse: "",
    };
  }

  addCourse() {
    axios({
      method: "POST",
      data: {
        userID: this.state.user,
        courseID: this.state.newCourse,
      },
      withCredentials: true,
      url: `/user/addCourse`,
    }).then((res) => {
      console.log(res);
    });

    axios({
      method: "GET",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      this.setState({ user: res.data });
      console.log(res);
    });

    window.location.reload(false);
    
  }

  onChangeCourseID(e) {
    this.setState({
        newCourse: e.target.value,
    });
}

  componentDidMount() {
    console.log(
      "The state in the component before fetching data is:",
      this.state
    );
    // get user object from server
    axios({
      method: "GET",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      this.setState({ user: res.data }); // get user object containing: _id, userName, accountType

      // get courses for the user
      axios
        .get(`/dashboard/${this.state.user._id}`)
        .then((res) => {
          this.setState({ courses: res.data });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  createCourseContainers() {
    return this.state.courses.map((course, key) => (
      <Link
        key={key}
        to={{
          pathname: "/forumList",
          state: { course },
        }}
      >
        <div style={background}>
          <div style={courseCard}>
            <div style={courseCode}>{course.courseCode}</div>
            <div style={courseName}>{course.courseName}</div>
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
          <h3 style={dashboardTitle}>Dashboard - Courses</h3>
        </div>
          <Container style={addCourse}>
            <InputGroup >
              <FormControl
                placeholder="Course Code"
                value={this.state.newCourse}
                onChange={this.onChangeCourseID.bind(this)}
              ></FormControl>
              <InputGroup.Append>
                <Button
                    variant="primary"
                    style={buttonStyle}
                    onClick={this.addCourse.bind(this)}
                  >
                    Add Course
                </Button>
              </InputGroup.Append>
            </InputGroup>
        </Container>
        <main style={main}> {this.createCourseContainers()} </main>
      </React.Fragment>
    );
  }
}

const dashboardTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const main = {
  margin: "5% 0% 0% 0%",
}

const addCourse = {
  float: "right",
  padding: "3px",
  margin: "0% 10% 0% 0%"
};

const buttonStyle = {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#343a40",
};

const background = {
  border: "1px solid black",
  margin: "2% 10%",
  paddingTop: "5%",
  borderRadius: "5px",
  background: "#343a40",
};

const courseCard = {
  padding: "1%",
  border: "1px solid black",
  background: "white",
};

const courseCode = {
  color: "#343a40",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
};

const courseName = {
  color: "#343a40",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
};
