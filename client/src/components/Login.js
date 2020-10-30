import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import "./Login.css";


export default class Login extends Component{
  // This is the component state which holds the text sent in by our express backend.
  constructor(props) {
    super(props);

    this.state = {
      message:"no message",
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

  onSubmit(e){
    e.preventDefault();

    const user = {
      name: this.state.name,
      password: this.state.password
    }

    // TODO: call to authentication
    // axios.get('http://localhost:3000/dashboard')
    //   .then(res => console.log(res.data));
  }

  render(){
  return (
    <body className="LoginPage">
        <h1>Welcome to The Learing Platform</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
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

            <Link to={{pathname: '/coursedashboard'}}> 
                <button>Log In</button>
            </Link>
        </form>     
    </body>
  );
  }
}
