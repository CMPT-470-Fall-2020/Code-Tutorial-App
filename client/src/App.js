import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Login from './components/Login';
import "./App.css";
import CreateTutorial from './components/pages/CreateTutorial';
import CourseDashboard from './components/pages/CourseDashboard';
import CodePlayground from './components/pages/CodePlayground';
import Tutorials from './components/pages/Tutorials';
import RunTutorial from './components/pages/RunTutorial';

// This is how we get the base URL. Locally, it is localhost:4000. 
// On the VM, it is the dynamic(ephemeral) IP given to use every time we start up the VM.
// NOTE: The IP of the VM changes every time we start it up so it cannot be hardcoded into a file.
//       The IP must be set while the deployment script is running.
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

class App extends Component {
  render() {
    return (
      <Router>
            <div className="App">
              <Route exact path="/" component={() => (<Redirect to='/login' />)} />
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
