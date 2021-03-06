import React, { Component } from "react";
import { Container, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";
import MarkdownCell from "./MarkdownCell.js";
import { codeMirrorThemes, codeMirrorKeyBinds } from "./codemirrorSettings";
import "../css/RunTutorial.css";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you
import { InlineMath, BlockMath } from "react-katex";

const ReactMarkdown = require("react-markdown");
const gfm = require("remark-gfm");
const math = require("remark-math");
const emoji = require("remark-emoji");

export default class RunTutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorialID: props.location.state.tutorial._id,
      courseID: props.location.state.tutorial.courseID,
      tutorialSelected: "",
      renderedHTML: undefined,
      userId: props.location.state.tutorial.userID,
      currentTheme: "eclipse",
      currentKeybinds: "default",
    };
    //console.log("Code in constructor", this.tutorialSelected)
    this.renderers = {
      inlineMath: ({ value }) => <InlineMath math={value} />,
      math: ({ value }) => <BlockMath math={value} />,
      code: ({ language, value, node }) => {
        return (
          <MarkdownCell
            theme={this.state.currentTheme || "eclipse"}
            keymap={this.state.currentKeybinds}
            code={value}
            iname={node.meta}
            lang={language}
            uid={this.state.userId}
            shouldRun={true}
          />
        );
      },
    };
    this.handleThemeSelect = this.handleThemeSelect.bind(this);
    this.handleKeybindSelect = this.handleKeybindSelect.bind(this);
  }

  componentDidMount() {
    // Get tutorial from server
    axios
      .get(`/tutorial/${this.state.courseID}/${this.state.tutorialID}`)
      .then((res) => {
        this.setState({ tutorialSelected: res.data.codeText });
        //console.log("tutorial selected returned", res.data.codeText)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleThemeSelect(theme) {
    this.setState({ currentTheme: theme });
  }

  handleKeybindSelect(keybind) {
    this.setState({ currentKeybinds: keybind });
  }

  render() {
    return (
      <div style={centerLayout}>
        <div id="codemirror-settings-group">
          <label>Select Code Cell Theme: </label>
          <DropdownButton
            title={this.state.currentTheme}
            id="dropdown-editor-theme"
            className="codemirror-select"
            variant="secondary"
            style={buttonStyle}
            onSelect={this.handleThemeSelect}
          >
            {codeMirrorThemes.map((themeName, index) => {
              return (
                <Dropdown.Item eventKey={themeName} key={index.toString()}>
                  {themeName}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
          <label> Select Code Cell Keybinds: </label>
          <DropdownButton
            title={this.state.currentKeybinds}
            id="dropdown-editor-keybinds"
            className="codemirror-select"
            onSelect={this.handleKeybindSelect}
            variant="secondary"
            style={buttonStyle}
          >
            {codeMirrorKeyBinds.map((keyBind, index) => {
              return (
                <Dropdown.Item eventKey={keyBind} key={index.toString()}>
                  {keyBind}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </div>
        <Container style={tutorialStyle}>
          <ReactMarkdown
            plugins={[gfm, math, emoji]}
            renderers={this.renderers}
            children={this.state.tutorialSelected}
            variant="secondary"
          />
        </Container>
      </div>
    );
  }
}

const tutorialStyle = {
  margin: "2% 2%",
};

const centerLayout = {
  margin: "2% 10%",
};

const buttonStyle = {
  padding: "3px",
  float: "right",
  fontFamily: "Arial, Helvetica, sans-serif",
};
