import React, { Component } from "react";
import { Button, Spinner } from "react-bootstrap";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { Controlled as CodeMirror } from "react-codemirror2";
import axios from "axios";
import "../css/MarkdownCodeCell.css";

// Codemirror code highlighting
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/julia/julia.js";
import "codemirror/mode/ruby/ruby.js";
// Codemirror Themes
import "codemirror/theme/monokai.css";
import "codemirror/theme/eclipse.css";
// Codemirror Keymaps
import "codemirror/keymap/vim";
import "codemirror/keymap/emacs";
import "codemirror/keymap/sublime";

export default class MarkdownCell extends Component {
  constructor(props) {
    super(props);
    this.codeMirrorEditConfig = {
      viewportMargin: 10,
      readOnly: false,
      lineWrapping: true,
      lineNumbers: true,
      mode: "shell",
      direction: "ltr",
      indentUnit: 2,
      tabSize: 4,
    };

    this.codeMirrorReadOnlyConfig = {
      viewportMargin: 10,
      readOnly: "nocursor",
      lineWrapping: true,
      lineNumbers: false,
      mode: "shell",
      direction: "ltr",
      indentUnit: 2,
      tabSize: 4,
    };

    this.state = {
      orignalCodeVal: this.props.code, // Original text incell. Used to restore cell to original text.
      modifiedCodeVal: this.props.code, // Current text in cell.
      lang: this.props.lang,
      interpName: this.props.iname,
      uid: this.props.userid,

      writeMode: this.props.shouldRun, // Used to disable running cells while tutorial is being written.
      codeOutput: "", // Stores the output returned by API
      isWaiting: false, // Used to hide/show progress spinner
      respCodeStatus: undefined,

      // Config for code mirror
      codeMirrorConfig: this.codeMirrorReadOnlyConfig,
      currentTheme: this.props.theme || "eclipse",
      currentKeymap: this.props.keymap || "default",
    };
    //this.buttonStyle = 'style={{font-size: 12px; float: right; border: solid 1px black; margin-top: 1%}}';
    console.log(this.props.keymap);

    // Bind functions so they are accessible from the "render" method.
    this.runCode = this.runCode.bind(this);
    this.resetCellContents = this.resetCellContents.bind(this);
    this.setEditorReadOnly = this.setEditorReadOnly.bind(this);
    this.setEditorEditMode = this.setEditorEditMode.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      this.setState({ currentTheme: this.props.theme });
    }
    if (prevProps.keymap !== this.props.keymap) {
      this.setState({ currentKeymap: this.props.keymap });
    }
  }

  resetCellContents() {
    this.setEditorReadOnly();

    this.setState({ modifiedCodeVal: this.state.orignalCodeVal });
  }

  setEditorReadOnly() {
    this.setState({ codeMirrorConfig: this.codeMirrorReadOnlyConfig });
  }
  setEditorEditMode() {
    this.setState({ codeMirrorConfig: this.codeMirrorEditConfig });
  }

  runCode() {
    if (this.state.writeMode === false) {
      this.setState({
        codeOutput: "Cells cannot be ran while in editing mode!",
      });
    } else {
      // Display Spinner while waiting
      this.setEditorReadOnly();
      this.setState({ respCodeStatus: undefined });
      this.setState({ isWaiting: true });
      axios({
        method: "POST",
        data: {
          uname: this.state.uid, //TODO: We need to store the username or user id of a person logged in.
          iname: this.state.interpName,
          code: this.state.modifiedCodeVal,
          lang: this.state.lang,
        },
        url: `/run`,
      }).then((res) => {
        let retMsg = res.data.message;
        // Stop spinner
        this.setState({ isWaiting: false });
        console.log("Return message in markdown cell is", retMsg);

        if (retMsg.type === "SUCCESS") {
          this.setState({ respCodeStatus: true });
          // Hide spinner
          if (retMsg.stdout.length !== 0) {
            this.setState({ codeOutput: retMsg.stdout });
          } else {
            this.setState({ codeOutput: retMsg.stderr });
          }
        } else {
          this.setState({ respCodeStatus: false });
          this.setState({
            codeOutput:
              "There is some sort of error with running your request. :(",
          });
        }
      });
    }
  }

  render() {
    //const divStyle = {width:"100%", height:"auto", border: "solid 1px #DFDFDF", background: "#F7F7F7", padding:"0.5%"};
    return (
      <code>
        <pre>
          <CodeMirror
            value={this.state.modifiedCodeVal}
            options={Object.assign({}, this.state.codeMirrorConfig, {
              theme: this.state.currentTheme,
              keyMap: this.state.currentKeymap,
            })}
            onBeforeChange={(editor, data, value) => {
              this.setState({ modifiedCodeVal: value });
            }}
            onChange={(editor, data, value) => {
              this.setState({ modifiedCodeVal: value });
            }}
            onDblClick={(editor, ev) => {
              //console.log("Write!", this.state.writeMode)
              if (this.state.writeMode === true) {
                this.setState({ codeMirrorConfig: this.codeMirrorEditConfig });
              }
            }}
          />
          <div className="code-cell-footer">
            {this.state.isWaiting && (
              <Spinner
                id="loading-spinner"
                animation="border"
                variant="primary"
              />
            )}
            {this.state.respCodeStatus === false && <FcHighPriority />}
            {this.state.respCodeStatus === true && <FcOk />}
            <ButtonToolbar bsPrefix="cell-btns">
              <Button variant="primary" className="mr-2" onClick={this.runCode}>
                Run code
              </Button>
              <Button
                variant="primary"
                className="mr-2"
                onClick={this.resetCellContents}
              >
                Restore Original
              </Button>
              <Button variant="primary" className="mr-2">
                Stop
              </Button>
            </ButtonToolbar>
          </div>
          <div className="code-cell-output">{this.state.codeOutput}</div>
        </pre>
      </code>
    );
  }
}
