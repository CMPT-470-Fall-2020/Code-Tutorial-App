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
      testResult: '',
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
        this.setState({testResult: res.data});
        //let output = document.createElement("p");
        //output.innerHTML = res.data;
        //document.getElementById("output").appendChild(output);
      });
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
            <input type="file" name="file" onChange={this.onChangeHandler}/>
            <Button
                  variant="secondary"
                  style={buttonStyle}
                  onClick={this.runTest.bind(this)}>
                  Run Test
            </Button>

          </InputGroup>

		  <div id='container' style={containerStyle}>
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
          	<p>Output:</p>
            <div id="output"> {this.state.testResult} </div>
		  </div> 
    		</div>
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

const containerStyle = {
}

const buttonStyle = {
    padding: "3px",
    float: "right",
    //margin: "2% 0% 0% 1%",
    fontFamily: "Arial, Helvetica, sans-serif",
};
