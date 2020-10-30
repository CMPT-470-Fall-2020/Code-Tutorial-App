import React, { Component } from 'react'
import {Container} from 'react-bootstrap';

export default class RunTutorial extends Component {
    constructor(props){
        super(props);
        this.state = {
            tutorialSelected: localStorage.getItem('tutorialSelected')
        };
    }

    componentDidMount() {
        console.log(this)
        if(this.props.location.state !== undefined){
            localStorage.setItem('tutorialSelected', JSON.stringify(this.props.location.state.tutorial))
            this.setState({tutorialSelected:this.props.location.state.tutorial})
        } 
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    <div>
                        <h3 style={headerStyle}>{this.state.tutorialSelected}</h3>
                        
                        {/* Get Tutorial From DB */}
                        <div style={tutorialStyle}>
                            The tutorial will be fetched from the db and displayed here<br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                        </div>
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

