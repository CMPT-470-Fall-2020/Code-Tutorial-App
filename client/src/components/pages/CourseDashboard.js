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
    if(this.state.courseList.includes(this.state.newCourse)) {
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
      window.alert(this.state.newCourse + ' is and invalid course code!');
    }

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

        // get user object from server
    axios({
      method: "GET",
      withCredentials: true,
      url: "/course/courseList",
    }).then((res) => {
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
          <Link
            key={key}
            to={{
              pathname: "/uploadtest",
              state: { course },
            }}
          >
            <Button
              variant="primary"
              style={buttonStyleForum}
              >
                Upload Test File
            </Button>
          </Link>
          <Link
            key="forumList"
            to={{
              pathname: "/forumList",
              state: { course },
            }}
          >
            <Button
              variant="primary"
              style={buttonStyleForum}
              >
                Forum
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
              variant="primary"
              style={buttonStyleTutorial}
              >
                Tutorials
            </Button>
          </Link>
          </div>

            <div style={courseCard}>

              <div style={courseName}>{course.courseName}</div>
              {/* change to only for teacher */}
              <div style={courseName}>{course._id}</div>
            </div>
          </div>
        </div>
    ));
  }



  render() {
    return (
      <React.Fragment>
        <div>
          <h3 style={dashboardTitle}>Dashboard - Courses</h3>
        </div>
        <main style={main}>
        <div style={backgroundaddCourse}>
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
      </div>
         {this.createCourseContainers()}
        </main>
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


const buttonStyleTutorial = {
  padding: "3px",
  float: "left",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#343a40",
};

const buttonStyleForum = {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#343a40",
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
