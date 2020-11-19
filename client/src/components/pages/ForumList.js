import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./../layout/Header";
import axios from "axios";
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class ForumList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.location.state.course._id,
      forums: [],
    };
  }

  componentDidMount() {
    // get forum list object from server
    axios
      .get(`/forum/${this.state.course}`)
      .then((res) => {
        this.setState({ forums: res.data });
        console.log("forumList/courseid returned", res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createForumList() {
    return this.state.forums.map((forum, key) => (
      <Link
        key={key}
        to={{
          pathname: "/post",
          state: { forum },
        }}
      >
        <div style={background}>
          <div style={forumCard}>
            <div style={name}>{forum.postTitle}</div>
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
          <h3 style={postTitle}>Forum</h3>
          <main>{this.createForumList()}</main>
        </div>
        <Link
          to={{ 
            pathname: "/createPost",
            state: {course: this.state.course}
          }}>
          <p>Add Post</p>
        </Link>
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

const postTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const forumCard = {
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
