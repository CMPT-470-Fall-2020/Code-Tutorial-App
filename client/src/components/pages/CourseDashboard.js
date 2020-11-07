import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import axios from 'axios';
import Header from './../layout/Header';
const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class CourseDashboard extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          courses: [],
          user: ''
        }
    }
    
    componentDidMount() {
        // get user object from server
        axios({
            method: "GET",
            withCredentials: true,
            url: BASE_API_URL + "/user",
          }).then((res) => {
            this.setState({user: res.data}); // get user object containing: _id, userName, accountType

            // get courses for the user
            axios.get(`${BASE_API_URL}/dashboard/${this.state.user._id}`)
            .then(res => {
                this.setState({courses: res.data});
            })
            .catch((error) => {
                console.log(error);
            });
        });       
    }

    createCourseContainers() {
        return this.state.courses.map((course, key)=>
            <Link key={key} to={
                {
                    pathname: "./tutorials",
                    state:{course}
                }
            }>
                <div style={background}>
                    <div style={courseCard}>
                            <div style={courseCode}> 
                                {course.courseCode} 
                            </div>
                            <div style={courseName}>
                                {course.courseName}
                            </div>
                    </div>
                </div>
            </Link>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.props.location.pathname !== '/login' && <Header />}
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

const courseCode = {
    color: '#343a40',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center'
}

const courseName = {
    color: '#343a40',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center'
}
