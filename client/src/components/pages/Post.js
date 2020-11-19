import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./../layout/Header";
import {
    Container,
    InputGroup,
    FormControl
  } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forum: props.location.state.forum,
      userID: '',
      commentText: ''
    };
    console.log(this.state);
  }

  componentDidMount() {
    axios({
        method: "GET",
        withCredentials: true,
        url: "/user",
      }).then((res) => {
        this.setState({ userID: res.data._id });
    });
    // get tutorials list object from server
    // axios
    //   .get(`/forum/${this.state.course}`)
    //   .then((res) => {
    //     this.setState({ forums: res.data });
    //     console.log("forumList/courseid returned", res.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

//   createForumList() {
//     return this.state.forums.map((forum, key) => (
//       <Link
//         key={key}
//         to={{
//           pathname: "/post",
//           state: { forum },
//         }}
//       >
//         <div style={background}>
//           <div style={forumCard}>
//             <div style={name}>{forum.postTitle}</div>
//           </div>
//         </div>
//       </Link>
//     ));
//   }

    onChangeText(e) {
        this.setState({
            commentText: e.target.value,
        });
    }

    addComment() {
        var data = {
            userID: this.state.userID,
            postID: this.state.forum._id,
            commentText: this.state.commentText
        }
        console.log(data);

        axios({
            method: "POST",
            data: {
                userID: this.state.userID,
                postID: this.state.forum._id,
                commentText: this.state.commentText
            },
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/add`,
        }).then((res) => {
            console.log(res);
        });
    }

  render() {
    return (
      <React.Fragment>
        {this.props.location.pathname !== "/login" && <Header />}
        <div>
          <h3 style={postTitle}>{this.state.forum.postTitle}</h3>
          <p style={postText}>{this.state.forum.postText}</p>
          <h3 style={postTitle}> Comments</h3> 
        </div>
        <Container>
          <InputGroup style={postTitle}>
                <FormControl
                placeholder="Comment"
                value={this.state.commentText}
                onChange={this.onChangeText.bind(this)}
                ></FormControl>
            </InputGroup>
            <Link 
              to={{
                // pathname: "/post",
                // state: { forum: this.state }
              }}
            >
              <Button
                  variant="primary"
                  style={buttonStyle}
                  onClick={this.addComment.bind(this)}
                >
                  Add Comment
                </Button>
            </Link>
        </Container>
      </React.Fragment>
    );
  }
}

const postTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const postText = {
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