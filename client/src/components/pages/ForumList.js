import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default class ForumList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.location.state.course._id,
      forums: [],
      userID: "",
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
      <div key={key} id={forum._id}>
        <div style={background}>
          <Link
            to={{
              pathname: "/post",
              state: { forum },
            }}
          >
            <div style={name}>{forum.postTitle}</div>
          </Link>
          <div style={forumCard}>
            <p>Created by: {forum.userName}</p>
            <div>{this.showDeleteButton(forum)}</div>
          </div>
        </div>
      </div>
    ));
  }

  showDeleteButton(forum) {
    if (forum.userID === this.state.userID) {
      return (
        <div>
          <Button
            onClick={this.deletePost.bind(this, forum)}
            variant="secondary"
            style={buttonStyleDefault}
          >
            Delete
          </Button>
        </div>
      );
    }
    return;
  }

  deletePost(forum) {
    axios({
      method: "DELETE",
      withCredentials: true,
      url: `/forum/${forum.courseID}/${forum._id}`,
    }).then((res) => {
      console.log(res);
    });
    document.getElementById(forum._id).remove();
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div style={postTitle}>
            <Link
              to={{
                pathname: "/createPost",
                state: { course: this.state.course },
              }}
            >
              <Button variant="secondary" style={buttonStyle}>
                Add Post
              </Button>
            </Link>
            <h3>Forum</h3>
          </div>
          <main style={main}>{this.createForumList()}</main>
        </div>
      </React.Fragment>
    );
  }
}

const background = {
  border: "1px solid black",
  margin: "2% 10%",
  paddingTop: "1%",
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
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
  paddingBottom: "1%",
};

const buttonStyle = {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const buttonStyleDefault = {
  padding: "3px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const main = {
  margin: "5% 0% 0% 0%",
};
