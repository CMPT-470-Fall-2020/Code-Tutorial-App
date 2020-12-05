import React, { Component } from "react";
import {
    InputGroup,
    FormControl,
    DropdownButton,
    Dropdown,
    ButtonGroup,
  } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";

export default class RunTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.location.state.course._id,
      userID: '',
      userName: '',
      code: '',
      tests: '',
      selectedTest: 'Select test',
      testResult: {
        stdout: '',
        stderr: '',
      },
    };
    this.fileReader = undefined;
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
        console.log("Tests retrieve from server", res.data);
      })
      .catch((error) => {
        console.log(error);
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
        this.setState({testResult: {stdout: res.data.stdout, stderr: res.data.stderr}});
        //let output = document.createElement("p");
        //output.innerHTML = res.data;
        //document.getElementById("output").appendChild(output);
      }).catch((err) => {console.log("There was an error with the post request", err)})

    }

    handleSelect = (e) => {
      this.setState({ selectedTest: e });
    };

  handleFileRead = (e) => {
    const content = this.fileReader.result;
    this.setState({code: content})
  };

	onChangeHandler = (e)=>{
  		  console.log("got a file!")
  		let file = e.target.files[0]
		this.fileReader = new FileReader();
    	this.fileReader.onloadend = this.handleFileRead;
    	this.fileReader.readAsText(file);
 	 }

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
    		<div>
        <h3 style={runTestTitle}>Tests</h3>
        <main style={main}>
        <div style={backgroundaddCourse}>
            <DropdownButton
              as={InputGroup.Append}
              variant="secondary"
              title={this.state.selectedTest}
              id="dropdown-basic-button"
              onSelect={this.handleSelect}
              style={dropdownStyle}
            >{testDropdown}
          </DropdownButton>
          <input type="file" name="file" variant="secondary" onChange={this.onChangeHandler}/>
          <Button
                variant="secondary"
                style={buttonStyle}
                onClick={this.runTest.bind(this)}>
                Run Test
          </Button>


		  <div id='container' style={main}>

          <CodeMirror
            value={this.state.code}
          	options={{
			  viewportMargin: 10,
			  readOnly: false,
			  lineWrapping: true,
			  lineNumbers: true,
			  direction: "ltr",
			  indentUnit: 2,
			  tabSize: 4,
			}}
            onBeforeChange={(editor, data, value) => {
              this.setState({ code: value });
            }}
            onChange={(editor, data, value) => {
              this.setState({ code: value });
            }}
          />
          <div style={outputStyle}>
          	<p>Output:</p>
            <div id="output" style={newline}> {this.state.testResult.stdout} </div>
            <br></br>
            <p>Errors:</p>
            <div id="output" style={newline}> {this.state.testResult.stderr} </div>
          </div>
          </div>

		  </div>
      </main>
    		</div>
    );
  }
}

const newline = {
  whiteSpace: "pre-wrap",
};

const postTitle = {
  borderBottom: "1px solid black",
};

const outputStyle = {
  margin: "2%",
}


const buttonStyle = {
    padding: "3px",
    float: "right",
    fontFamily: "Arial, Helvetica, sans-serif",
};

const dropdownStyle = {
  padding: "3px",
  float: "left",
  marginRight: "5%"
};

const runTestTitle = {
  margin: "2% 10%",
  borderBottom: "1px solid black",
};

const backgroundaddCourse = {
  margin: "2% 10%",
  borderRadius: "5px",
};

const main = {
  margin: "5% 0% 0% 0%",
}
