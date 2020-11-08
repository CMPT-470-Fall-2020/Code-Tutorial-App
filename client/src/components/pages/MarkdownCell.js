import React, { Component } from 'react'
import axios from 'axios';

export default class MarkdownCell extends Component{
	constructor(props){
		super(props)
		//console.log("Cell init with", this.props.code);
		this.state = {
			code: this.props.code,
			lang: this.props.lang,
			interpName: this.props.iname,
			uid:this.props.userid,
			codeOutput: "",
		}
        this.buttonStyle = 'style={{font-size: 12px; float: right; border: solid 1px black; margin-top: 1%}}';
	  this.runCode= this.runCode.bind(this);
	}
	
	runCode(){
        axios({
            method: "POST",
            data: {
					uname: this.state.uid, //TODO: We need to store the username or user id of a person logged in.
					iname: this.state.interpName,
					code: this.state.code,
					lang: this.state.lang
            },
            url: `/run`,
          }).then( res => {
          	 let retMsg = res.data.message;
          	 console.log("Return message in markdown cell is", retMsg); 

          	 if(retMsg.type === "SUCCESS"){
          	 	if (retMsg.stdout.length !== 0){
					this.setState({codeOutput:retMsg.stdout})
          	 	}else{
					this.setState({codeOutput:retMsg.stderr})
          	 	}
          	 }else{
				this.setState({codeOutput:"There is some sort of error with running your request. :("})
          	 }
        })
	}

	render() {
			const divStyle = {width:"100%", height:"auto", border: "solid 1px #DFDFDF", background: "#F7F7F7", padding:"0.5%"};
			return(
            <code>
            	<pre>
            		<div style={divStyle}>{this.state.code}</div>
            		<button onClick={this.runCode}>Run code cell</button>
            		<div>{this.state.codeOutput}</div>
            	</pre>
            </code>
			)
	}
}

