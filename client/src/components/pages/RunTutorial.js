import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import Header from './../layout/Header';
import axios from 'axios';

const marked = require('marked')

const renderer2 = {
    code(code, info, escaped) {
        let divStyle = 'style="width:100%; height:auto; border: solid 1px #DFDFDF; background: #F7F7F7; padding:0.5%"';
        let buttonStyle = 'style="font-size: 12px; float: right; border: solid 1px black; margin-top: 1%"';
            
        return (
            `<code><pre><div ${divStyle}>HELLO ${code} extra</div><button ${buttonStyle}>Run Code Cell</button></pre></code>`
        )
    }
};

marked.use({ renderer2 });

export default class RunTutorial extends Component {

    constructor(props){
        super(props);
        this.state = {
            tutorialID:  props.location.state.tutorial._id,
            courseID: props.location.state.tutorial.courseID,
            tutorialSelected: '',
            renderedHTML: undefined,
        };
    }

    componentDidMount() {
        // Get tutorial from server
        axios.get(`http://localhost:4000/tutorial/${this.state.courseID}/${this.state.tutorialID}`)
          .then((res) => {
                this.setState({tutorialSelected: res.data.codeText}); 
                console.log("tutorial selected returned", res.data.codeText)
            })
            .catch((error) => {
                console.log(error);
        }).then((res) => {
            let htmlOutput = marked(this.state.tutorialSelected)
            console.log("HTML output", typeof(htmlOutput), htmlOutput)
            this.setState({renderedHTML : htmlOutput});
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.props.location.pathname !== '/login' && <Header />}
                <Container style={tutorialStyle}>
                    <div dangerouslySetInnerHTML={{__html:this.state.renderedHTML}}></div>
                </Container>
            </React.Fragment>
        )
    }
}

const tutorialStyle = {
    margin: '2% 2%',
}
