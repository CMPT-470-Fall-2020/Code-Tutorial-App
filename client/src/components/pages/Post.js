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
            <div id={"comment-buttons" + comment._id}>
                <Button onClick={this.deleteComment.bind(this, comment)}
                variant="secondary"
                style={buttonStyleDefault}>Delete</Button>&nbsp;
                <Button onClick={this.editComment.bind(this, comment)}
                variant="secondary"
                style={buttonStyleDefault}>Edit</Button>
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
                    <Button onClick={this.editPost.bind(this)}
                    variant="secondary"
                    style={buttonStyleDefault}>Edit Post</Button>
                </div>
            )
        }
        return
    }


/////////////////////////////////   Edit, add, and delete functions /////////////////////////////////
    editPost() {
        var titleLabel = document.createElement("p");
        titleLabel.id = "title-label";
        titleLabel.innerHTML = "Title: ";

        var contentLabel = document.createElement("p");
        contentLabel.id = "content-label";
        contentLabel.innerHTML = "Content: ";

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
        saveButton.id = "savePostEdit";
        saveButton.innerHTML = "Save";
        saveButton.onclick = this.updatePost.bind(this);

        // Add input box and button
        document.getElementById("editPost").appendChild(titleLabel);
        document.getElementById("editPost").appendChild(inputTitle);
        document.getElementById("editPost").appendChild(contentLabel);
        document.getElementById("editPost").appendChild(inputBody);
        document.getElementById("editPost").appendChild(saveButton);
    }

    updatePost() {
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
            this.state.forum.postTitle = this.state.editTitle;
            this.state.forum.postText = this.state.editBody;
            console.log(res);
        });

        document.getElementById("title").innerHTML = `Title: ${this.state.editTitle}`;
        document.getElementById("postText").innerHTML =`${this.state.editBody}`;

        // Get rid of post edit elements
        document.getElementById("savePostEdit").remove();
        document.getElementById("editTitle").remove();
        document.getElementById("editBody").remove();
        document.getElementById("title-label").remove();
        document.getElementById("content-label").remove();
    }

    editComment(comment) {
        var input = document.createElement("input");
        input.id = "edit " + comment._id;
        input.type = "text";
        input.value = comment.commentText;
        input.onchange = this.onChangeComment.bind(this);

        var saveButton = document.createElement("button");
        saveButton.id = "save " + comment._id;
        saveButton.innerHTML = "Save";
        saveButton.onclick = this.updateComment.bind(this, comment);

        // Add input box and button
        document.getElementById(comment._id).appendChild(input);
        document.getElementById(comment._id).appendChild(saveButton);
    }

    updateComment(comment) {
        axios({
            method: "POST",
            data: {
                userID: this.state.userID,
                commentText: this.state.editComment
              },
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/${comment._id}/update`,
        }).then((res) => {
            console.log(res);

            // Change elements in the DOM
            document.getElementById(comment._id).firstChild.innerHTML = this.state.editComment;
            document.getElementById("edit " + comment._id).remove();
            document.getElementById("save " + comment._id).remove();

            // Update state
            comment.commentText = this.state.editComment;
            this.setState({ editComment: ""});
        });
    }

    deleteComment(comment) {
        axios({
            method: "DELETE",
            withCredentials: true,
            url: `/forum/${this.state.forum.courseID}/${this.state.forum._id}/${comment._id}`,
        }).then((res) => {
            console.log(res);
            document.getElementById(comment._id).remove();
        });
    }

    createCommentBlock(newComment) {
      return (<div style={forumCard} id={newComment._id}>
             <div style={postText}>{newComment.commentText}</div>
             <p>Created by: {newComment.userName}</p>
             <div>{this.showCommentButtons(newComment)}</div>
          </div>)
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

            // get comments list object from server to get the new comment
            axios
            .get(`/forum/${this.state.forum.courseID}/${this.state.forum._id}`)
            .then((res) => {
              var newComment = res.data[res.data.length - 1];

              // Comment block
              var newCommentBlock = document.createElement("div");
              newCommentBlock.id = newComment._id;
              //Style from forumCard below
              newCommentBlock.style.padding = "1%";
              newCommentBlock.style.border = "1px solid black";
              newCommentBlock.style.background = "white";

              // Comment text
              var newCommentText = document.createElement("div");
              newCommentText.innerHTML = newComment.commentText;
              //Style from postText below
              newCommentText.style.margin = "2% 10%";
              newCommentText.style.borderBottom = "1px solid black";

              var createdBy = document.createElement("p");
              createdBy.innerHTML = "Created by: " + newComment.userName;

              // Delete and edit buttons
              var buttons = document.createElement("div");
              buttons.id = "comment-buttons" + newComment._id;

              var deleteBtn = document.createElement("button");
              deleteBtn.addEventListener('click', this.deleteComment.bind(this, newComment));
              deleteBtn.innerHTML = "Delete";

              var editBtn = document.createElement("button");
              editBtn.addEventListener('click', this.editComment.bind(this, newComment));
              editBtn.innerHTML = "Edit";

              // Add elements to the DOM
              buttons.appendChild(deleteBtn);
              buttons.appendChild(editBtn);
              newCommentBlock.appendChild(newCommentText);
              newCommentBlock.appendChild(createdBy);
              newCommentBlock.appendChild(buttons);

              // Add to end of the list
              document.getElementById("commentList").appendChild(newCommentBlock);

              // Clear input box
              document.getElementById("addCommentInput").value = "";
            })
            .catch((error) => {
              console.log(error);
             });
        });
    }

    createCommentList() {
        return this.state.comments.map((comment, key) => (
                <div style={forumCard} key={key} id={comment._id}>
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
          <h5><b id="title">Title: {this.state.forum.postTitle}</b></h5>
          <p id="postText">{this.state.forum.postText}</p>
          {this.showPostEditButton()}
          <div style={commentsSection}>
          <h6 style={commentsTitle}>Comments</h6>
          <div id="commentList">{this.createCommentList()}</div>
          <br></br><br></br>
          <InputGroup style={postTitle}>
                <FormControl
                id="addCommentInput"
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

const buttonStyleDefault = {
  padding: "3px",
  fontFamily: "Arial, Helvetica, sans-serif",
};
