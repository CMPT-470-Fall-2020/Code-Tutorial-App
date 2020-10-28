import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './components/layout/Header';
import Tutorial from './components/pages/Tutorial';
import TutorialDashboard from './components/pages/TutorialDashboard';
import CodePlayground from './components/pages/CodePlayground';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header></Header>
            <Route path="/tutorial" component={Tutorial}></Route>
            <Route path="/tutorialdashboard" component={TutorialDashboard}></Route>
            <Route path="/codeplayground" component={CodePlayground}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
