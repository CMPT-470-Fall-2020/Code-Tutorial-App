import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import Login from "./components/Login";
import Header from "./components/layout/Header";
import CreateTutorial from "./components/pages/CreateTutorial";
import CourseDashboard from "./components/pages/CourseDashboard";
import Tutorials from "./components/pages/Tutorials";
import RunTutorial from "./components/pages/RunTutorial";
import ForumList from "./components/pages/ForumList";
import CreatePost from "./components/pages/CreatePost";
import Post from "./components/pages/Post";
import RunTest from "./components/pages/RunTest";
import CreateCourse from "./components/pages/CreateCourse";
import UploadTest from "./components/pages/UploadTest";

// This is how we get the base URL. Locally, it is localhost:4000.
// On the VM, it is the dynamic(ephemeral) IP given to use every time we start up the VM.
// NOTE: The IP of the VM changes every time we start it up so it cannot be hardcoded into a file.
//       The IP must be set while the deployment script is running.
//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

class App extends Component {
  render() {
    return (
      <main>
          <Route path="/" render={ ( props ) => ( props.location.pathname !== "/login") && <Header /> }></Route>
          <Switch>
            <Route exact path="/" component={() => <Redirect to="/login" />} />
            <Route exact path="/login" component={Login} />
            <Route path="/coursedashboard" component={CourseDashboard}></Route>
            <Route path="/tutorials" component={Tutorials}></Route>
            <Route path="/runtutorial" component={RunTutorial}></Route>
            <Route path="/createtutorial" component={CreateTutorial}></Route>
            <Route path="/forumList" component={ForumList}></Route>
            <Route path="/createPost" component={CreatePost}></Route>
            <Route path="/post" component={Post}></Route>
            <Route path="/runTest" component={RunTest}></Route>
            <Route path="/uploadtest" component={UploadTest}></Route>
            <Route path="/createcourse" component={CreateCourse}></Route>

            {/* Show blank page for users without the intended account
            Local Bug: Does not work without refreshing on first load. Need to look into.
            On production, accessing a restricted site will show a cannot get /url so maybe
            the code below is not needed at all. Note to use this code: http call will need to be made to access user account*/}
            {/* {console.log("App.js account: " + this.state.user.accountType)}
            {this.state.user.accountType === "Teacher"  && (
                <Route exact path="/createtutorial" component={CreateTutorial}></Route>
                <Route path="/createCourse" component={CreateCourse}></Route>
            )}
            {this.state.user.accountType === "Student" && (
                <Route exact path="/codeplayground" component={CodePlayground}></Route>
            )} */}
          </Switch>
      </main>
    );
  }
}

export default App;
