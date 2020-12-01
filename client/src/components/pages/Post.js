import React, { Component } from "react";
import {
    Container,
    InputGroup,
    FormControl
  } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forum: props.location.state.forum,
      comments: [],
      userID: '',
      userName: '',
      commentText: '',
      editComment: '',
      editTitle: props.location.state.forum.postTitle,
      editBody: props.location.state.forum.postText
    };
    console.log(this.state);
  }

  componentDidMount() {
    // Get user id
    axios({
        method: "GET",
        withCredentials: true,
        url: "/user",
      }).then((res) => {
        this.setState({ userID: res.data._id, userName: res.data.userName });
    });

    // get comments list object from server
    axios
      .get(`/forum/${this.state.forum.courseID}/${this.state.forum._id}`)
      .then((res) => {
        this.setState({ comments: res.data });
      })
      .catch((error) => {
        console.log(error);
      });

    // redundant but required after refresh for editting the post
    axios
    .get(`/forum/${this.state.forum._id}/getPost`)
    .then((res) => {
      console.log(res.data);
      this.setState({ forum: res.data });
    })
    .catch((error) => {
      console.log(error);
    });
  }

    onChangeText(e) {
        this.setState({
            commentText: e.target.value,
        });
    }

    onChangeComment(e) {
        this.setState({
            editComment: e.target.value,
        });
    }

    onChangePostTitle(e) {
        this.setState({
            editTitle: e.target.value,
        });
    }

    onChangePostBody(e) {
        this.setState({
            editBody: e.target.value,
        });
    }


/////////////////////////////////  Show delete and edit buttons  /////////////////////////////////
  showCommentButtons(comment) {
    if (comment.userID === this.state.userID) {
        return (
            <div id={comment._id}>
                <button onClick={this.deleteComment.bind(this, comment)}>Delete</button>
                <button onClick={this.editComment.bind(this, comment)}>Edit</button>
            </div>
        )
    }
    return
  }

  showPostEditButton() {
        // Check for role restriction
        if (this.state.userID === this.state.forum.userID) {
            return (
                <div id="editPost">
                    <button onClick={this.editPost.bind(this)}>Edit Post</button>
                </div>
            )
        }
        return
    }


/////////////////////////////////   Edit, add, and delete functions /////////////////////////////////
    editPost() {
        var inputTitle = document.createElement("input");
        inputTitle.id = "editTitle";
        inputTitle.type = "text";
        inputTitle.value = this.state.forum.postTitle;
        inputTitle.onchange = this.onChangePostTitle.bind(this);

        var inputBody = document.createElement("input");
        inputBody.id = "editBody";
        inputBody.type = "text";
        inputBody.value = this.state.forum.postText;
        inputBody.onchange = this.onChangePostBody.bind(this);

        var saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.onclick = this.updatePost.bind(this);

        // Add input box and button
        document.getElementById("editPost").appendChild(inputTitle);
        document.getElementById("editPost").appendChild(inputBody);
        document.getElementById("editPost").appendChild(saveButton);
    }

    updatePost() {
        console.log("NEW");
        console.log(this.state.editTitle);
        axios({
            method: "POST",
            data: {
                userID: this.state.userID,
                postTitle: this.state.editTitle,
                postText: this.state.editBody
              },
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/update`,
        }).then((res) => {
            console.log(res);
        });

        console.log(this.state);
        window.location.reload();
    }

    editComment(comment) {
        var input = document.createElement("input");
        input.id = "edit " + comment._id;
        input.type = "text";
        input.value = comment.commentText;
        input.onchange = this.onChangeComment.bind(this);

        var saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.onclick = this.updateComment.bind(this, comment._id);

        // Add input box and button
        document.getElementById(comment._id).appendChild(input);
        document.getElementById(comment._id).appendChild(saveButton);
    }

    updateComment(commentID) {
        axios({
            method: "POST",
            data: {
                userID: this.state.userID,
                commentText: this.state.editComment
              },
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/${commentID}/update`,
        }).then((res) => {
            console.log(res);
        });
        window.location.reload();
    }

    deleteComment(comment) {
        axios({
            method: "DELETE",
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/${comment._id}`,
        }).then((res) => {
            console.log(res);
        });
        window.location.reload();
    }

    addComment() {
        axios({
            method: "POST",
            data: {
                userID: this.state.userID,
                postID: this.state.forum._id,
                userName: this.state.userName,
                commentText: this.state.commentText
            },
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/add`,
        }).then((res) => {
            console.log(res);
        });
        window.location.reload();
    }

    createCommentList() {
        return this.state.comments.map((comment, key) => (
                <div style={forumCard} key={key}>
                    <div style={postText}>{comment.commentText}</div>
                    <p>Created by: {comment.userName}</p>
                    <div>{this.showCommentButtons(comment)}</div>
                </div>
        ));
    }

  render() {
    return (
      <React.Fragment>
        <div style={centerLayout}>
          <h3 style={postTitle}>Post</h3>
          <main style={main}>
          <h5><b>Title: {this.state.forum.postTitle}</b></h5>
          <p>{this.state.forum.postText}</p>
          {this.showPostEditButton()}
          <div style={commentsSection}>
          <h6 style={commentsTitle}>Comments</h6>
          {this.createCommentList()}
          <br></br><br></br>
          <InputGroup style={postTitle}>
                <FormControl
                placeholder="Comment"
                value={this.state.commentText}
                onChange={this.onChangeText.bind(this)}
                ></FormControl>
            </InputGroup>
            <Button
                  variant="secondary"
                  style={buttonStyle}
                  onClick={this.addComment.bind(this)}
                >
                  Add Comment
            </Button>
            <br></br>
            </div>
            </main>
          </div>
      </React.Fragment>
    );
  }
}


const forumCard = {
    padding: "1%",
    border: "1px solid black",
    background: "white",
};

const postTitle = {
  borderBottom: "1px solid black",
};

const commentsSection = {
  marginTop: "10%",
  marginLeft: "10%",
  marginRight: "10%",
};

const commentsTitle = {
  borderBottom: "1px solid black",
};

const centerLayout = {
  margin: "2% 10%",
};

const main = {
  margin: "5% 0% 0% 0%",
}

const postText = {
    margin: "2% 10%",
    borderBottom: "1px solid black",
  };

const buttonStyle = {
    padding: "3px",
    float: "right",
    margin: "2% 0% 0% 1%",
    fontFamily: "Arial, Helvetica, sans-serif",
};
