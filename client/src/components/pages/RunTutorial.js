import React, { Component } from 'react'
import {Container} from 'react-bootstrap';
import Header from './../layout/Header';
import axios from 'axios';
import {marked} from './markdownParser';

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
            this.setState({renderedHTML : htmlOutput});
            console.log("Output html from marked", htmlOutput);
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
