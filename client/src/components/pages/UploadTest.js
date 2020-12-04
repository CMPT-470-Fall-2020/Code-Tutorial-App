import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Tutorials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      courseID: props.location.state.course._id,
      code: '',
      selectedFile: "", // selected file
      tests: [],
      language: "Language",
      languages: ["bash", "python", "julia", "zsh"]
    };
  }

  componentDidMount() {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      this.setState({ userID: res.data._id }); 
      axios
      .get(`/autograder/${this.state.courseID}`)
      .then((res) => {
        this.setState({ tests: res.data});
        console.log("tests returned", res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    });
  }

  deleteTest(testID, fileName) {
    axios({
      method: "DELETE",
      withCredentials: true,
      url: `autograder/${this.state.courseID}/${testID}/${fileName}`,
    }).then((res) => {
      console.log(res);
      axios
      .get(`/autograder/${this.state.courseID}`)
      .then((res) => {
        this.setState({ tests: res.data});
        console.log("tests returned", res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    });
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
    data.append('language', this.state.language)

    axios.post(`/autograder/${this.state.courseID}/add`, data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
        console.log(res.statusText)
        axios
        .get(`/autograder/${this.state.courseID}`)
        .then((res) => {
          this.setState({ tests: res.data});
          console.log("tests returned", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    })    
  }

  handleSelect = (e) => {
    for (let idx in this.state.languages) {
      if (this.state.languages[idx] === e) {
        this.setState({ language: this.state.languages[idx] });
      }
    }
    this.setState({ language: e });
  };

  render() {
    const languageDropdown = [];
    for (let idx in this.state.languages) {
      const lang = this.state.languages[idx];
      languageDropdown.push(
        <Dropdown.Item eventKey={lang} key={lang}>
          {lang}
        </Dropdown.Item>
      );
    }
    return (
      <React.Fragment>
        <div>
          <h3 style={uploadTestTitle}> Upload a Test File</h3>
        </div>
        <main style={main}>
          
          <InputGroup style={uploadTestStyle}>
            <DropdownButton
            as={InputGroup.Append}
            variant="outline-secondary"
            title={this.state.language}
            id="dropdown-basic-button"
            onSelect={this.handleSelect}
            >
                {languageDropdown}
            </DropdownButton>
            <input type="file" name="file" style={fileButtonStyle} onChange={this.onChangeHandler}/>
            <input type="button" style={buttonStyle} className="btn btn-success btn-block" onClick={this.onClickHandler} value="submit"></input> 
          </InputGroup>
          {this.state.tests.map((test, key) => (
            <div style={background}>
              <div style={testCard}>
                <div style={name}>
                  {test.testName}
                  <Button
                      variant="secondary"
                      style={buttonStyleDelete}
                      onClick = {this.deleteTest.bind(this,test._id,test.fileName)}
                      >
                        del
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
  paddingBottom: "5%",
}

const fileButtonStyle = {
  margin: "1%"
}

const buttonStyle = {
  marginTop: "1%",
  padding: "3px",
  float: "left",
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#6c757d",
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
  padding: "10px",
  color: "#343a40",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
};

const buttonStyleDelete= {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
};
