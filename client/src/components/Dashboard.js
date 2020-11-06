import React, { Component } from 'react';
import axios from 'axios';
import Course from './Course';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          courses: []
        }
      }
    
    componentDidMount() {
        axios.get('http://localhost:3000/dashboard')
          .then(res => {
            this.setState({courses: res.data});
          })
          .catch((error) => {
            console.log(error);
          })
      }

    render(){
        return (
          <div className="Dashboard">
            {this.state.courses.map(course => (
                <Course key={course.id} name={course.name} description={course.description}/>
            ))}
          </div>
        );
    }
}
