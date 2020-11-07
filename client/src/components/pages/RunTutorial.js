import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import Header from './../layout/Header';
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
            tutorialSelected: "```python helpme\nprint(\"Hello world\")```",
            renderedHTML: undefined,
        };
    }

    componentDidMount() {
        console.log("Tutorial Mounted!")
		let htmlOutput = marked(this.state.tutorialSelected)
		console.log("HTML output", typeof(htmlOutput), htmlOutput)
		this.setState({renderedHTML : htmlOutput});
    }

    render() {
        return (
            <React.Fragment>
                {this.props.location.pathname !== '/login' && <Header />}
                <Container>
                <h1> Hello below is my tutorial </h1>
                {this.state.renderedHTML}
                <div dangerouslySetInnerHTML={{__html:this.state.renderedHTML}}>
                </div>
                </Container>
                
            </React.Fragment>
            
        )
    }
}

const headerStyle = {
    margin: '2% 0%',
    borderBottom: '1px solid black'
}

const tutorialStyle = {
    border: '1px solid black'
}

