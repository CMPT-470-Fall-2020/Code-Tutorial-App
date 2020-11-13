import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';
import {Controlled as CodeMirror} from 'react-codemirror2';
import Button from 'react-bootstrap/Button';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
//import './../scss/MarkdownEditor.scss';
import axios from 'axios';
import Header from './../layout/Header';
//import { v4 as uuid } from 'uuid'; //TODO: Why is this needed?
// Markdown rendering stuff

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {ghcolors} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {InlineMath, BlockMath} from 'react-katex'
import 'katex/dist/katex.min.css' // `react-katex` does not import the CSS for you
const ReactMarkdown = require('react-markdown')
const gfm = require('remark-gfm')
const math = require('remark-math')
const emoji = require('remark-emoji');

const renderers = {
  inlineMath: ({value}) => <InlineMath math={value} />,
  math: ({value}) => <BlockMath math={value} />,
  code: ({language, value, node}) => {
  	// Use a lighter code highlighter. The user does not need to edit the codecell.
    return <SyntaxHighlighter style={ghcolors} language={language} children={value || ""} />
  }
}

export default class CreateTutorial extends Component {

    state = {
        course: "Course",
        courseID: '',
        title: '',
        rawCode: '',
        htmlCode: '',
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

    // Save markup text to db
    saveDB() {
        axios({
            method: "POST",
            data: {
                tutorialName: this.state.title,
                userID: this.state.user._id,
                codeText: this.state.rawCode,
                htmlText: this.state.htmlCode
                
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
        this.setState({ htmlCode: ''});
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
                		mode="markdown"
                        onBeforeChange={(editor, data, value) => {
                            this.setState({rawCode: value});
                            //this.setState({htmlCode: marked(value)});
                        }}
                        onChange={(editor, data, value) => {
                            this.setState({rawCode: value});
                            //this.setState({htmlCode: marked(value)});
                        }}
                    />
                    <div>
                        <h1 style={headerStyle}>Markdown Preview</h1>

						<ReactMarkdown plugins={[gfm, math, emoji]}  renderers={renderers} children={this.state.rawCode}/>
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

/*
const previewStyle = {
    padding: '1%',
    resize: 'none',
    border: '1px solid black',
    minHeight: '100px'
}
*/
