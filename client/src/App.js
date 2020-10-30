import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Login} id="login-page"></Route>
          <Route path="/Dashboard" component={Dashboard}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
