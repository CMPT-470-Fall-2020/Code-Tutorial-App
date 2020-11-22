import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./../layout/Header";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default class ForumList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.location.state.course._id,
      forums: [],
      userID: ''
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
      <div key={key}>
        <Link
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
        <div>{this.showDeleteButton(forum)}</div>
      </div>
    ));
  }

  showDeleteButton(forum) {
    if (forum.userID === this.state.userID) {
        return (
            <div>
                <button onClick={this.deletePost.bind(this, forum)}>Delete</button>
            </div>
        )
    } 
    return
  }

  deletePost(forum) {
      axios({
          method: "DELETE",
          withCredentials: true,
          url: `/forum/${forum.courseID}/${forum._id}`,
      }).then((res) => {
          console.log(res);
      });
      window.location.reload(); 
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
            <Button
                  variant="primary"
                  style={buttonStyle}
                  >
              Add Post
            </Button>
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

const buttonStyle = {
  padding: "3px",
  float: "right",
  margin: "2% 0% 0% 1%",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#343a40",
};
