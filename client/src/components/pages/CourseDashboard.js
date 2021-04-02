import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Footer from "./Footer";

export default class CourseDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      user: "",
      newCourse: "",
      courseList: [],
    };
  }

  addCourse() {
    if (this.state.courseList.includes(this.state.newCourse)) {
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
    } else {
      window.alert(this.state.newCourse + " is and invalid course code!");
    }
  }

  onChangeCourseID(e) {
    this.setState({
      newCourse: e.target.value,
    });
  }

  componentDidMount() {
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

    // get user object from server
    axios({
      method: "GET",
      withCredentials: true,
      url: "/course/courseList",
    })
      .then((res) => {
        this.setState({ courseList: res.data });
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createCourseContainers() {
    return this.state.courses.map((course, key) => (
      <div>
        <div style={background}>
          <div style={courseCode}>
            {this.state.user.accountType === "Teacher" && (
              <Link
                key={key}
                to={{
                  pathname: "/uploadtest",
                  state: { course },
                }}
              >
                <Button
                  variant="secondary"
                  style={{ ...buttonStyleForum, marginRight: "0.3rem" }}
                >
                  Upload Test File
                </Button>
              </Link>
            )}
            <Link
              key="forumList"
              to={{
                pathname: "/forumList",
                state: { course },
              }}
            >
              <Button
                variant="secondary"
                style={{ ...buttonStyleForum, marginRight: "0.3rem" }}
              >
                Forum
              </Button>
            </Link>
            <Link
              key={key}
              to={{
                pathname: "/runTest",
                state: { course },
              }}
            >
              <Button
                variant="secondary"
                style={{ ...buttonStyleRunTest, marginLeft: "0.3rem" }}
              >
                Test Code
              </Button>
            </Link>
            {course.courseCode}
            <Link
              key={key}
              to={{
                pathname: "/tutorials",
                state: { course },
              }}
            >
              <Button
                variant="secondary"
                style={{ ...buttonStyleTutorial, marginLeft: "0.3rem" }}
              >
                Tutorials
              </Button>
            </Link>
          </div>

          <div style={courseCard}>
            <div style={courseName}>{course.courseName}</div>
            {/* change to only for teacher */}
            <div style={courseName}>{"ID: ".concat(course._id)}</div>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className="min-vh-100">
        <h3 style={dashboardTitle} className="text-center">
          Dashboard - Courses
        </h3>
        <main style={main} className="min-vh-100">
          <div style={backgroundaddCourse}>
            <InputGroup>
              <FormControl
                placeholder="Course Code..."
                value={this.state.newCourse}
                onChange={this.onChangeCourseID.bind(this)}
              ></FormControl>
              <InputGroup.Append>
                <Button
                  variant="secondary"
                  style={buttonStyle}
                  onClick={this.addCourse.bind(this)}
                >
                  Add Course
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          {this.createCourseContainers()}
          <p className="text-center font-weight-bold">
            There are no more courses available!
          </p>
        </main>
        <Footer />
      </div>
    );
  }
}

const dashboardTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const main = {
  marginTop: "1rem",
  minHeight: "100%",
};

const buttonStyleTutorial = {
  padding: "3px",
  float: "left",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const buttonStyleRunTest = {
  padding: "3px",
  float: "left",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const buttonStyleForum = {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const buttonStyle = {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const background = {
  border: "1px solid black",
  margin: "2% 10%",
  paddingTop: "1%",
  borderRadius: "5px",
  background: "#343a40",
};

const backgroundaddCourse = {
  border: "1px solid black",
  margin: "2% 10%",
  borderRadius: "5px",
  background: "#343a40",
};

const courseCard = {
  padding: "1%",
  marginTop: "1rem",
  border: "1px solid black",
  background: "white",
};

const courseCode = {
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
  paddingBottom: "1%",
};

const courseName = {
  color: "#343a40",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
};
