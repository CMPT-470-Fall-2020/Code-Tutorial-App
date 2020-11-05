import React, { Component } from 'react';
<<<<<<< HEAD
import axios from 'axios';
import './App.css';

class App extends Component {
  // This is the component state which holds the text sent in by our express backend.
  constructor(props) {
    super(props);

    this.state = {
      message: "no message",
      name: '',
      password: ''
    }
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      name: this.state.name,
      password: this.state.password
    }

    axios.get('http://localhost:3000/dashboard')
      .then(res => console.log(res.data));
  }

  render() {
    return (
      <div className="App">
        <p>{this.state.message}</p>
        <form onSubmit={this.onSubmit.bind(this)}>
          <h1>Input User</h1>
          <p>Username: </p>
          <input
            type="text"
            value={this.state.name}
            onChange={this.onChangeName.bind(this)}
            placeholder="username@sfu.ca">
          </input>
          <p>Password: </p>
          <input
            type="text"
            value={this.state.password}
            onChange={this.onChangePassword.bind(this)}
            placeholder="password123">
          </input>
          <button>Log In</button>
        </form>
      </div>
=======
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css";
import Header from './components/layout/Header';
import CreateTutorial from './components/pages/CreateTutorial';
import CourseDashboard from './components/pages/CourseDashboard';
import CodePlayground from './components/pages/CodePlayground';
import Tutorials from './components/pages/Tutorials';
import RunTutorial from './components/pages/RunTutorial';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header></Header>
            <Route exact path="/" component={Login} id="login-page"></Route>
            <Route path="/Dashboard" component={Dashboard}></Route>
            <Route path="/createtutorial" component={CreateTutorial}></Route>
            <Route path="/coursedashboard" component={CourseDashboard}></Route>
            <Route path="/codeplayground" component={CodePlayground}></Route>
            <Route path="/tutorials" component={Tutorials}></Route>
            <Route path="/runtutorial" component={RunTutorial}></Route>

        </div>
      </Router>
>>>>>>> routing
    );
  }
}

export default App;
