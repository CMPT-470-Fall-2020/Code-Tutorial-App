import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import Button from 'react-bootstrap/Button';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import './scss/MarkdownEditor.scss';

let marked = require('marked')

export default class MarkupEditor extends Component {
    
    state = {
        value:''
    }

    render() {
        return (
            <React.Fragment>
                <section>
                    <h1 style={headerStyle}>Markdown Editor</h1>
                    <Button variant="primary" style={saveStyle}>Save</Button>

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
                    <div style={previewStyle} dangerouslySetInnerHTML = {{__html: marked(this.state.value)}}>                               
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const headerStyle = {
    fontSize: '20px',
    margin:'2% 1% 0% 1%',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'inline-block'
}

const saveStyle = {
    padding: '3px',
    float: 'right',
    margin:'2% 1% 0% 1%',
    fontFamily: 'Arial, Helvetica, sans-serif',
    backgroundColor: '#343a40'
}

const options = {
    mode: 'markdown',
    lineNumbers: true
}

const previewStyle = {
    resize: 'none',
    margin: '1%',
    padding: '1%',
    border: '1px solid black',
    minHeight: '100px'
}
