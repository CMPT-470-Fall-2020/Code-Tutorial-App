import React, { Component } from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/lib/codemirror.css';
import './scss/MarkdownEditor.scss';

export default class MarkupEditor extends Component {
    render() {
        return (
            <React.Fragment>
                <h1 style={headerStyle}>Markdown Editor</h1>
<               CodeMirror
                    value=''
                    options={{
                        mode: 'markdown',
                        lineNumbers: true
                    }}
                    onChange={(editor, data, value) => {
                    }}
                />
            </React.Fragment>
        )
    }
}

const headerStyle = {
    fontSize: '20px',
    margin:'2% 1% 1% 1%',
    fontFamily: 'Arial, Helvetica, sans-serif'
}
