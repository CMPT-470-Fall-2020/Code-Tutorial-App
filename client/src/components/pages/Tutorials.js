import React, { Component } from 'react'
import { Link } from "react-router-dom"; 

export default class Tutorials extends Component {
    tutorials = ["Tutorial1 - 10/18/2020", "Tutorial2 - 10/28/2020", "Tutorial3 - 11/18/2020"];
    
    constructor(props){
        super(props);
        this.state = {
            tutorialSelected: localStorage.getItem('tutorialSelected')
        };
    }

    componentDidMount() {
        console.log(this)
        if(this.props.location.state !== undefined){
            localStorage.setItem('tutorialSelected', JSON.stringify(this.props.location.state.course))
            this.setState({tutorialSelected:this.props.location.state.course})
        } 
    }

    createTutorialList() {
        return this.tutorials.map((tutorial)=>
            <Link to={
                {
                    pathname: "./RunTutorial",
                    state:{tutorial}
                }
            }>
                <div style={background}>
                    <div key={tutorial} style={tutorialCard}>
                            <div style={name}> 
                                {tutorial}
                            </div>
                    </div>
                </div>
            </Link>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <h3 style={tutorialTitle}>{this.state.tutorialSelected} Tutorials</h3>
                    <main>{this.createTutorialList()}</main>
                </div>
            </React.Fragment>

        )
    }
}

const background = {
    border: '1px solid black',
    margin: '2% 10%',
    paddingTop: '5%',
    borderRadius: '5px',
    background: '#343a40',
}

const tutorialTitle = {
    margin: '2% 10%',
    borderBottom: '1px solid black'
}

const tutorialCard = {
    padding: '1%',
    border: '1px solid black',
    background: 'white',
}

const name = {
    color: '#343a40',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center'
}

