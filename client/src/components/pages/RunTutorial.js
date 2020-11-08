import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import Header from './../layout/Header';
import {marked} from './markdownParser';
import JsxParser from 'react-jsx-parser'
import axios from 'axios';
import MarkdownCell from "./MarkdownCell.js"


export default class RunTutorial extends Component {

    constructor(props){
        super(props);
        this.state = {
            tutorialID:  props.location.state.tutorial._id,
            courseID: props.location.state.tutorial.courseID,
            tutorialSelected: '',
            renderedHTML: undefined,
            userId: props.location.state.tutorial.userID,
        };
    }

    componentDidMount() {
        // Get tutorial from server
        axios.get(`http://localhost:4000/tutorial/${this.state.courseID}/${this.state.tutorialID}`)
          .then((res) => {
                this.setState({tutorialSelected: res.data.codeText}); 
                //console.log("tutorial selected returned", res.data.codeText)
            })
            .catch((error) => {
                console.log(error);
        }).then((res) => {
            let htmlOutput = marked(this.state.tutorialSelected)
            this.setState({renderedHTML : htmlOutput});
            //console.log("Output html from marked", htmlOutput);
        });
    }

    clickBtn(){
    	//console.log("activated")
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
				 	bindings={{
						userId: this.state.userId,
						shouldRunCells: true,
					}}
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
