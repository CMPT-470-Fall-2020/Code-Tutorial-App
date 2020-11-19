import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import Login from "./components/Login";
import CreateTutorial from "./components/pages/CreateTutorial";
import CourseDashboard from "./components/pages/CourseDashboard";
import CodePlayground from "./components/pages/CodePlayground";
import Tutorials from "./components/pages/Tutorials";
import RunTutorial from "./components/pages/RunTutorial";
import ForumList from "./components/pages/ForumList";
import CreatePost from "./components/pages/CreatePost";
import Post from "./components/pages/Post";

// This is how we get the base URL. Locally, it is localhost:4000.
// On the VM, it is the dynamic(ephemeral) IP given to use every time we start up the VM.
// NOTE: The IP of the VM changes every time we start it up so it cannot be hardcoded into a file.
//       The IP must be set while the deployment script is running.
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={() => <Redirect to="/login" />} />
          <Route exact path="/login" component={Login} />
          <Route path="/createtutorial" component={CreateTutorial}></Route>
          <Route path="/coursedashboard" component={CourseDashboard}></Route>
          <Route path="/codeplayground" component={CodePlayground}></Route>
          <Route path="/tutorials" component={Tutorials}></Route>
          <Route path="/forumList" component={ForumList}></Route>
          <Route path="/createPost" component={CreatePost}></Route>
          <Route path="/post" component={Post}></Route>
          <Route path="/runtutorial" component={RunTutorial}></Route>
        </Switch>
      </main>
    );
  }
}

export default App;
