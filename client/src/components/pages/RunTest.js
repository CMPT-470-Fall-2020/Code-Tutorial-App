import React, { Component } from "react";
import { 
    InputGroup,
    FormControl,
    DropdownButton,
    Dropdown,
  } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default class RunTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.location.state.course._id,
      userID: '',
      userName: '',
      code: '',
      tests: '',
      selectedTest: 'Select test'
    };
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

    // get file list object from server
    axios
      .get(`/autograder/${this.state.course}`)
      .then((res) => {
        this.setState({ tests: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

    onChangeCode(e) {
        this.setState({
            code: e.target.value,
        });
    }

    runTest() {
      var runTest;

      // Get the whole test object from state by using the test name
      for (var i = 0; i < this.state.tests.length; i ++) {
        if (this.state.tests[i].testName == this.state.selectedTest) {
          runTest = this.state.tests[i];
        }
      }

      axios({
        method: "POST",
        data: {
          test: runTest,
          code: this.state.code
        },
        withCredentials: true,
        url: `/autograder/runTest`,
      }).then((res) => {
        console.log(res);
        let output = document.createElement("p");
        output.innerHTML = res.data;
        document.getElementById("output").appendChild(output);
      });
    }

    handleSelect = (e) => {
      this.setState({ selectedTest: e });
    };

  render() {
    const testDropdown = [];
    for (let idx in this.state.tests) {
      const testName = this.state.tests[idx].testName;
      testDropdown.push(
        <Dropdown.Item eventKey={testName} key={testName}>
          {testName}
        </Dropdown.Item>
      );
    }

    return (
      <React.Fragment>
          <InputGroup>
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              title={this.state.selectedTest}
              id="dropdown-basic-button"
              onSelect={this.handleSelect}
            >
              {testDropdown}
            </DropdownButton>
          </InputGroup>
          <InputGroup style={postTitle}>
                <FormControl
                value={this.state.code}
                onChange={this.onChangeCode.bind(this)}
                ></FormControl>
            </InputGroup>
            <Button
                  variant="secondary"
                  style={buttonStyle}
                  onClick={this.runTest.bind(this)}
                >
                  Run Test
            </Button>
            <div id="output">Output: </div>
      </React.Fragment>
    );
  }
}


// const forumCard = {
//     padding: "1%",
//     border: "1px solid black",
//     background: "white",
// };

const postTitle = {
  borderBottom: "1px solid black",
};

// const commentsSection = {
//   marginTop: "10%",
//   marginLeft: "10%",
//   marginRight: "10%",
// };

// const commentsTitle = {
//   borderBottom: "1px solid black",
// };

// const centerLayout = {
//   margin: "2% 10%",
// };

// const main = {
//   margin: "5% 0% 0% 0%",
// }

// const postText = {
//     margin: "2% 10%",
//     borderBottom: "1px solid black",
//   };

const buttonStyle = {
    padding: "3px",
    float: "right",
    margin: "2% 0% 0% 1%",
    fontFamily: "Arial, Helvetica, sans-serif",
};
