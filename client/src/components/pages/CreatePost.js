import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Container,
    InputGroup,
    FormControl
  } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseID: props.location.state.course,
      userID: props.location.state.userid,
      postTitle: '',
      postText: ''
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

    onChangeTitle(e) {
        this.setState({
            postTitle: e.target.value,
        });
    }

    onChangeText(e) {
        this.setState({
            postText: e.target.value,
        });
    }


  saveDB() {
    axios({
      method: "POST",
      data: {
        userID: this.state.userID,
        courseID: this.state.courseID,
        postTitle: this.state.postTitle,
        postText: this.state.postText
      },
      withCredentials: true,
      url: `/forum/${this.state.courseID}/add`,
    }).then((res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3 style={postTitle}>Forum</h3>
        </div>

        <Container>
          <InputGroup style={postTitleStyle}>
            <FormControl
              placeholder="Post Title"
              value={this.state.title}
              onChange={this.onChangeTitle.bind(this)}
            ></FormControl>
            <FormControl
              placeholder="Post Body"
              value={this.state.title}
              onChange={this.onChangeText.bind(this)}
            ></FormControl>
            </InputGroup>
            <Link 
              to={{
                pathname: "/post",
                state: { forum: this.state }
              }}
            >
              <Button
                  variant="primary"
                  style={buttonStyle}
                  onClick={this.saveDB.bind(this)}
                >
                  Add Post
                </Button>
            </Link>
        </Container>
      </React.Fragment>
    );
  }
}

const postTitleStyle = {
    marginTop: "2%",
    paddingLeft: "0px",
};

const postTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const buttonStyle = {
    padding: "3px",
    float: "right",
    margin: "2% 0% 0% 1%",
    fontFamily: "Arial, Helvetica, sans-serif",
    backgroundColor: "#343a40",
};
  