import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './components/layout/Header';
import Tutorial from './components/pages/Tutorial';
import CodePlayground from './components/pages/CodePlayground';
import MarkdownEditor from './components/MarkdownEditor';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header></Header>
          <div className="container">
            <Route path="/tutorial" component={Tutorial}></Route>
            <Route path="/codeplayground" component={CodePlayground}></Route>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
