import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component{
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  	this.state = {uname:"",
  	iname:"",
  	lang:"",
  	code:""}
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("app state is:", this.state);
    fetch('/run', {
      method: 'POST',
	 headers: {
   	 "Content-Type": "application/json"
  	},      
      body: JSON.stringify(this.state)
    }).then(result => {
    		return result.json()
    }).then((resp) => {
		console.log("resp", resp)	
    });
  }

myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
  // This is the component state which holds the text sent in by our express backend.
  /*
  componentDidMount(){
		fetch("/hello")
			.then(result => {
					console.log(result)
					return result.json()
			})
		  .then(jsonResp => this.setState({message:jsonResp.message}))
  	}
  	*/

  render(){
  return (
      <form onSubmit={this.handleSubmit}>
      	  <fieldset>
        <label htmlFor="uname">Enter username</label>
        <input id="uname" name="uname" onChange={this.myChangeHandler} type="text" />
      	  </fieldset>

      	  <fieldset>
        <label htmlFor="iname">Enter the interpreter name</label>
        <input id="iname" name="iname" onChange={this.myChangeHandler} type="text" />
      	  </fieldset>

      	  <fieldset>
        <label htmlFor="lang">Enter the language to run</label>
        <input id="lang" name="lang" onChange={this.myChangeHandler} type="text" />
      	  </fieldset>

      	 <fieldset>
        <label htmlFor="code">Enter the code you want to run</label>
		<textarea name="code" onChange={this.myChangeHandler} cols="40" rows="5"></textarea>
      	 </fieldset>

        <button>Send data!</button>
        <div>{this.state.code}</div>
      </form>
    );
  }
}

export default App;
