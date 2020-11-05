import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom"; 


export default class CourseDashboard extends Component {
    courses = ["CMPT470", "CMPT310", "CMPT354"];

    createCourseContainers() {
        return this.courses.map((course)=>
            <Link to={
                {
                    pathname: "./tutorials",
                    state:{course}
                }
            }>
                <div style={background}>
                    <div key={course} style={courseCard}>
                            <div style={name}> 
                                {course}
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
                    <h3 style={dashboardTitle}>Dashboard - Courses</h3>
                    <main>{this.createCourseContainers()}</main>
                </div>
            </React.Fragment>
        )
    }
}

const dashboardTitle = {
    margin: '2% 10%',
    borderBottom: '1px solid black'
}

const background = {
    border: '1px solid black',
    margin: '2% 10%',
    paddingTop: '5%',
    borderRadius: '5px',
    background: '#343a40',
}

const courseCard = {
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
