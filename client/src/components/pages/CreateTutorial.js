import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';
import {Controlled as CodeMirror} from 'react-codemirror2';
import Button from 'react-bootstrap/Button';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import './../scss/MarkdownEditor.scss';
import axios from 'axios';
import Header from './../layout/Header';
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;


let marked = require('marked')

// Override function for parsing code blocks
const renderer = {
    code(code, info, escaped) {
        var divStyle = 'style="width:100%; height:auto; border: solid 1px #DFDFDF; background: #F7F7F7; padding:0.5%"';
        var buttonStyle = 'style="font-size: 12px; float: right; border: solid 1px black; margin-top: 1%"';
        
        return (
            `<code><pre><div ${divStyle}>${code}</div><button ${buttonStyle}>Run Code Cell</button></pre></code>`
        )
    }
};

marked.use({ renderer });

export default class CreateTutorial extends Component {

    state = {
        course: "Course",
        courseID: '',
        title: '',
        rawCode: '',
        markdownCode: '',
        user: '',
        courses: []
    }

    componentDidMount() {
        axios({
            method: "GET",
            withCredentials: true,
            url:  "/user",
          }).then((res) => {
              this.setState({user: res.data}); // get user object containing: _id, userName, accountType

              // get courses for the user
            axios.get(`/dashboard/${this.state.user._id}`)
            .then(res => {
                this.setState({courses: res.data});
            })
            .catch((error) => {
                console.log(error);
            });
        });
    }

    handleSelect= (e) => {
        for (let idx in this.state.courses){
            if (this.state.courses[idx].courseCode.toUpperCase() === e){
                this.setState({courseID: this.state.courses[idx]._id});
            }
        }
        this.setState({course:e})
    }

    onChangeTitle(e) {
        this.setState({
          title: e.target.value
        });
    }

    // Create preview of tutorial
    getPreview() {
        return {__html: marked(this.state.rawCode)};
    }

    // Save markup text to db
    saveDB() {
        axios({
            method: "POST",
            data: {
                tutorialName: this.state.title,
                userID: this.state.user._id,
                codeText: this.state.rawCode
            },
            withCredentials: true,
            url: `/tutorial/${this.state.courseID}/add`,
          }).then((res)=> {
              console.log(res);
              this.clearStates();
        })
    }

    clearStates() {
        this.setState({ course: "Course"});
        this.setState({ courseID: ''});
        this.setState({ title: ''});
        this.setState({ rawCode: ''});
        this.setState({ markdownCode: ''});
        this.setState({ user: ''});
        this.setState({ courses: []});
    }
    
    render() {
        const coursesDropdown = [];
        for (let idx in this.state.courses){
            const courseCode = this.state.courses[idx].courseCode;
            coursesDropdown.push(<Dropdown.Item eventKey={courseCode} key={courseCode}>{courseCode}</Dropdown.Item>)
        }

        return (
            <React.Fragment>
                {this.props.location.pathname !== '/login' && <Header />}
                <Container>
                    <InputGroup className="mb-3" style={tutorialTitleStyle}>
                        <FormControl 
                            placeholder="Tutorial Title"
                            value = {this.state.title}
                            onChange={this.onChangeTitle.bind(this)}
                        >
                        </FormControl>
                        <DropdownButton
                            as={InputGroup.Append}
                            variant="outline-secondary"
                            title={this.state.course}
                            id="dropdown-basic-button"
                            onSelect={this.handleSelect}
                        >
                        {coursesDropdown}
                        </DropdownButton>
                    </InputGroup>
                    
                    <section style={sectionStyle}>
                        <h1 style={headerStyle}>Markdown Editor</h1>
                        <Button variant="primary" style={buttonStyle} onClick={this.saveDB.bind(this)}>Save</Button>
                    </section>
                    <CodeMirror
                        value={this.state.rawCode}
                        options={options}
                        onBeforeChange={(editor, data, value) => {
                            this.setState({rawCode: value});
                            this.setState({markdownCode: marked(value)});
                        }}
                        onChange={(editor, data, value) => {
                            this.setState({rawCode: value});
                            this.setState({markdownCode: marked(value)});
                        }}
                    />
                    <div>
                        <h1 style={headerStyle}>Markdown Preview</h1>
                        <div 
                            style={previewStyle} 
                            dangerouslySetInnerHTML = {this.getPreview()}
                        > 
                        </div>
                    </div>
                </Container>
            </React.Fragment>
        )
    }
}

const tutorialTitleStyle = {
    marginTop: '2%',
    paddingLeft: '0px'
}

const sectionStyle = {
    marginBottom: '0.5%'
}

const headerStyle = {
    fontSize: '20px',
    marginTop:'2%',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'inline-block'
}

const buttonStyle = {
    padding: '3px',
    float: 'right',
    margin:'2% 0% 0% 1%',
    fontFamily: 'Arial, Helvetica, sans-serif',
    backgroundColor: '#343a40'
}

const options = {
    mode: 'markdown',
    lineNumbers: true
}

const previewStyle = {
    padding: '1%',
    resize: 'none',
    border: '1px solid black',
    minHeight: '100px'
}
