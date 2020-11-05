import React, { Component} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import Button from 'react-bootstrap/Button';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import './scss/MarkdownEditor.scss';

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

export default class MarkupEditor extends Component {
    
    state = {
        value:''
    }

    // Create preview of tutorial
    getPreview() {
        return {__html: marked(this.state.value)};
    }

    // Save to DB
    saveDB() {
        console.log("save to db here");
    }
    
    render() {
        return (
            <React.Fragment>
                <section style={sectionStyle}>
                    <h1 style={headerStyle}>Markdown Editor</h1>
                    <Button variant="primary" style={buttonStyle} onClick={this.saveDB.bind(this)}>Save</Button>
                </section>
                <CodeMirror
                    value={this.state.value}
                    options={options}
                    onBeforeChange={(editor, data, value) => {
                      this.setState({value});
                    }}
                    onChange={(editor, data, value) => {
                      this.setState({value});
                    }}
                />
                <div>
                    <h1 style={headerStyle}>Markdown Preview</h1>
                    <div style={previewStyle} dangerouslySetInnerHTML = {this.getPreview()}>                               
                    </div>
                </div>
            </React.Fragment>
        )
    }
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
