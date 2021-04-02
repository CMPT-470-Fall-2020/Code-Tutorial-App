import React, { Component } from "react";
import axios from "axios";

//const BASE_API_URL = process.env.REACT_APP_PROD_BASE_URL || process.env.REACT_APP_DEV_BASE_URL;

export default class Login extends Component {
  // This is the component state which holds the text sent in by our express backend.
  constructor(props) {
    super(props);
    this.state = {
      message: "no message",
      registerName: "",
      registerPassword: "",
      name: "",
      password: "",
      account: "",
      isAuth: false,
    };
  }

  onChangeRegisterName(e) {
    this.setState({
      registerName: e.target.value,
    });
  }

  onChangeRegisterPassword(e) {
    this.setState({
      registerPassword: e.target.value,
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onChangeAccount(e) {
    this.setState({
      account: e.target.value,
    });
  }

  onRegister(e) {
    e.preventDefault();

    const user = {
      name: this.state.registerName,
      password: this.state.registerPassword,
      account: this.state.account,
    };

    // Make request to register
    axios({
      method: "POST",
      data: {
        user,
      },
      withCredentials: true,
      url: "/register",
    }).then((res) => {
      if (res.data === "User Created") {
        // Login
        axios({
          method: "POST",
          data: {
            name: user.name,
            password: user.password,
          },
          withCredentials: true,
          url: "/login",
        }).then((res) => {
          if (res.data === "Authentication: Success") {
            this.props.history.push("/coursedashboard");
          }
        });
      }
    });
  }

  onLogin(e) {
    e.preventDefault();

    // Make request to login
    axios({
      method: "POST",
      data: {
        name: this.state.name,
        password: this.state.password,
      },
      withCredentials: true,
      url: "/login",
    }).then((res) => {
      if (res.data === "Authentication: Success") {
        // If the login is successful, we redirect
        //window.location.href="./CourseDashboard";
        //this.setState({isAuth: true})
        this.props.history.push("/coursedashboard");
      }
    });
  }

  render() {
    return (
      <div className="LoginPage" style={loginStyle}>
        <h1 style={headingStyle}>Welcome to The Learning Platform</h1>
        <form onSubmit={this.onRegister.bind(this)}>
          <h3>Register as New User</h3>
          <label style={labelStyle}>Username: </label>
          <input
            type="text"
            value={this.state.registerName}
            onChange={this.onChangeRegisterName.bind(this)}
            placeholder="username@sfu.ca"
          ></input>
          <label style={labelStyle}>Password: </label>
          <input
            type="text"
            value={this.state.registerPassword}
            onChange={this.onChangeRegisterPassword.bind(this)}
            placeholder="password123"
          ></input>
          <label style={labelStyle}>
            <input
              type="radio"
              value="Student"
              onChange={this.onChangeAccount.bind(this)}
              checked={this.state.account === "Student"}
            ></input>
            Student
          </label>
          <label>
            <input
              type="radio"
              value="Teacher"
              onChange={this.onChangeAccount.bind(this)}
              checked={this.state.account === "Teacher"}
            ></input>
            Teacher
          </label>

          <button style={buttonStyle}>Register</button>
        </form>
        <form onSubmit={this.onLogin.bind(this)} style={formStyle}>
          <h3>Already Have an Account? Login Ahead.</h3>
          <label style={labelStyle}>Username: </label>
          <input
            type="text"
            value={this.state.name}
            onChange={this.onChangeName.bind(this)}
            placeholder="username@sfu.ca"
          ></input>
          <label style={labelStyle}>Password: </label>
          <input
            type="text"
            value={this.state.password}
            onChange={this.onChangePassword.bind(this)}
            placeholder="password123"
          ></input>
          <button style={buttonStyle}>Login</button>
        </form>
      </div>
    );
  }
}

const headingStyle = {
  margin: "5%",
};

const formStyle = {
  margin: "5%",
};

const loginStyle = {
  padding: "1%",
  textAlign: "center",
  border: "2px solid black",
  background: "#343a40",
  color: "white",
  width: "1000px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const labelStyle = {
  margin: "1%",
};

const buttonStyle = {
  display: "inline",
  margin: "2%",
};
