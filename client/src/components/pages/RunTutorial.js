import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import Header from './../layout/Header';
import {marked} from './markdownParser';
import JsxParser from 'react-jsx-parser'
import axios from 'axios';


class MarkdownCell extends Component{
	constructor(props){
		super(props)
		console.log("Cell init with", this.props.code);
		this.state = {
			code: this.props.code,
			lang: this.props.lang,
			interpName: this.props.iname,
			codeOutput: "",
		}
        this.buttonStyle = 'style={{font-size: 12px; float: right; border: solid 1px black; margin-top: 1%}}';
        console.log("This state", this.state);
	  this.runCode= this.runCode.bind(this);
	}
	
	runCode(){
        axios({
            method: "POST",
            data: {
					uname: "someuser", //TODO: We need to store the username or user id of a person logged in.
					iname: this.interpName,
					code: this.code,
					lang: this.lang
            },
            url: `/run`,
          }).then( res => {
          	 let retMsg = res.data.message;
          	 console.log(retMsg, "and this", this);

          	 if(retMsg.type == "SUCCESS"){
          	 	if (retMsg.stdout.length != 0){
					this.setState({codeOutput:retMsg.stdout})
          	 	}else{
					this.setState({codeOutput:retMsg.stderr})
          	 	}
          	 }
        })
	}

	render() {
			console.log("from top of render", this.runCode);
			const divStyle = {width:"100%", height:"auto", border: "solid 1px #DFDFDF", background: "#F7F7F7", padding:"0.5%"};
			return(
            <code>
            	<pre>
            		<div style={divStyle}>{this.state.code}</div>
            		<button onClick={this.runCode}>Run code cell</button>
            		<div>{this.state.codeOutput}</div>
            	</pre>
            </code>
			)
	}
}

class ExtendedComponent extends JsxParser{
	constructor(props){
		super(props);
		console.log("Extended class state", this)
	}
}

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
    	console.log("from tutorail", axios);
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
            this.setState({renderedHTML : htmlOutput});
            console.log("Output html from marked", htmlOutput);
        });
    }

    clickBtn(){
    	console.log("activated")
        console.log(this.state.renderedHTML)
    }

    //<div dangerouslySetInnerHTML={{__html:this.state.renderedHTML}}></div>
    render() {
        return (
        	<div>
            <React.Fragment>
                {this.props.location.pathname !== '/login' && <Header />}
                <Container style={tutorialStyle}>
                    Random Text
				   <JsxParser
				    components={{MarkdownCell}}
					jsx={this.state.renderedHTML}
				    blacklistedAttrs={[]}
					/>
                </Container>
            </React.Fragment>
            </div>
        )
    }
}

const tutorialStyle = {
    margin: '2% 2%',
}
