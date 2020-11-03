import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Login from './components/Login';
import "./App.css";
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
              <Redirect from='/' to='/login' />
              <Route exact path="/login" component={Login}/>
              <Route path="/createtutorial" component={CreateTutorial}></Route>
              <Route path="/coursedashboard" component={CourseDashboard}></Route>
              <Route path="/codeplayground" component={CodePlayground}></Route>
              <Route path="/tutorials" component={Tutorials}></Route>
              <Route path="/runtutorial" component={RunTutorial}></Route>
            </div>
      </Router>
    );
  }
}

export default App;
