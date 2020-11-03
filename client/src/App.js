import React, { Component } from 'react';
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
    );
  }
}

export default App;
