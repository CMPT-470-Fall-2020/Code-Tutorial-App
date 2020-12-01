import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";

//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Tutorials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      courseID: props.location.state.course._id,
      code: '',
      selectedFile: "", // selected file
      tests: ["test1", "test2", "test3"]
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

  createTestFileList() {
    return this.state.tests.map((test, key) => (

    <div style={background}>
      <div style={testCard}>
        <div style={name}>
          {test}
          <Button
              variant="primary"
              style={buttonStyleDelete}
              >
                del
          </Button>
        </div>
        
      </div>
    </div>
    ));
  }

  onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  onClickHandler = (event) => {
    const data = new FormData() 
    data.append('file', this.state.selectedFile)
    data.append('courseID', this.state.courseID)
    data.append('userID', this.state.userID)

    axios.post(`/autograder/${this.state.courseID}/add`, data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
        console.log(res.statusText)
    })
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3 style={uploadTestTitle}> Upload a Test File</h3>          
        </div>
        <main style={main}>
          <div style={uploadTestStyle}>
            <input type="file" name="file" onChange={this.onChangeHandler}/>
            <input type="button" style={buttonStyle} className="btn btn-success btn-block" onClick={this.onClickHandler} value="submit"></input> 
          </div>
          {this.createTestFileList()}
        </main>
      </React.Fragment>
    );
  }
}

const uploadTestTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const uploadTestStyle = {
  margin: "2% 10%",
  paddingBottom: "5%"
}

const buttonStyle = {
  padding: "3px",
  float: "left",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#343a40",
}

const main = {
  margin: "0% 20% 0% 20%",
}

const background = {
  border: "1px solid black",
  margin: "2% 10%",
  paddingTop: "5%",
  borderRadius: "5px",
  background: "#343a40",
};

const testCard = {
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

const buttonStyleDelete= {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#343a40",
};
