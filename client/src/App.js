import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component{
  // This is the component state which holds the text sent in by our express backend.
  state = {message:"no message"}
  componentDidMount(){
		fetch("/hello")
			.then(result => {
					console.log(result)
					return result.json()
			})
		  .then(jsonResp => this.setState({message:jsonResp.message}))
  	}

  render(){
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      	  <p>{this.state.message}</p>
    </div>
  );
  }
}

export default App;
