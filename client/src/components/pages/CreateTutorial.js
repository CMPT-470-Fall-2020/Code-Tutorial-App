import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';
import {Controlled as CodeMirror} from 'react-codemirror2';
import Button from 'react-bootstrap/Button';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import './../scss/MarkdownEditor.scss';

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
        title: '',
        rawCode: '',
        markdownCode: '',
    }

    handleSelect= (e) => {
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

    // TO DO: Make server call to save data
    saveDB() {
        console.log("save to db here");
    }
    
    render() {
        return (
            <React.Fragment>
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
                            <Dropdown.Item eventKey="CMPT128">CMPT128</Dropdown.Item>
                            <Dropdown.Item eventKey="CMPT310">CMPT310</Dropdown.Item>
                            <Dropdown.Item eventKey="CMPT470">CMPT470</Dropdown.Item>
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
