import React, { Component } from 'react'
import {Button, Spinner} from "react-bootstrap";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import { FcHighPriority, FcOk} from "react-icons/fc";
import {Controlled as CodeMirror} from 'react-codemirror2'
import axios from 'axios';

export default class MarkdownCell extends Component{
	constructor(props){
		super(props)
		this.state = {
			orignalCodeVal: this.props.code,
			modifiedCodeVal: this.props.code,
			lang: this.props.lang,
			interpName: this.props.iname,
			uid:this.props.userid,
			shouldRunCells: this.props.shouldRun,  // Used to disable running cells while tutorial is being written.
			codeOutput: "", // Stores the output returned by API
			isWaiting: false, // Used to hide/show progress spinner
			respCodeStatus: undefined,
		}
        this.buttonStyle = 'style={{font-size: 12px; float: right; border: solid 1px black; margin-top: 1%}}';
	  this.runCode= this.runCode.bind(this);
	}
	
	runCode(){
		if (this.state.shouldRunCells !== true){
			this.setState({codeOutput:"Cells cannot be ran while in editing mode!"})
		}else{
		// Display Spinner while waiting
		this.setState({respCodeStatus: undefined})
		this.setState({isWaiting: true})
        axios({
            method: "POST",
            data: {
					uname: this.state.uid, //TODO: We need to store the username or user id of a person logged in.
					iname: this.state.interpName,
					code: this.state.modifiedCodeVal,
					lang: this.state.lang
            },
            url: `/run`,
          }).then( res => {
          	 let retMsg = res.data.message;
          	 // Stop spinner
			 this.setState({isWaiting: false})
          	 console.log("Return message in markdown cell is", retMsg); 

          	 if(retMsg.type === "SUCCESS"){
			 	this.setState({respCodeStatus: true})
          	 	// Hide spinner
          	 	if (retMsg.stdout.length !== 0){
					this.setState({codeOutput:retMsg.stdout})
          	 	}else{
					this.setState({codeOutput:retMsg.stderr})
          	 	}
          	 }else{
			 	this.setState({respCodeStatus: false})
				this.setState({codeOutput:"There is some sort of error with running your request. :("})
          	 }
        })
		}
	}

	render() {
			const divStyle = {width:"100%", height:"auto", border: "solid 1px #DFDFDF", background: "#F7F7F7", padding:"0.5%"};
			return(
            <code>
            	<pre>
					{this.state.isWaiting && <Spinner id="loading-spinner" animation="border" variant="primary"/>}
					{this.state.respCodeStatus == false && <FcHighPriority/>}
					{this.state.respCodeStatus == true && <FcOk/>}
            		<div style={divStyle}>{this.state.modifiedCodeVal}</div>
            		<ButtonToolbar>
            		<Button variant="primary" className="mr-2" onClick={this.runCode}>Run code</Button>
            		<Button variant="primary" className="mr-2">Restore Original</Button>
            		<Button variant="primary" className="mr-2">Stop</Button>
            		</ButtonToolbar>
            		<div>{this.state.codeOutput}</div>
            	</pre>
            </code>
			)
	}
}

