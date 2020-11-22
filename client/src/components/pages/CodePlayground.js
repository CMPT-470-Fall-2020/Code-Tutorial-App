import React, { Component } from 'react'
import Header from './../layout/Header';

export default class CodePlayground extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.location.pathname !== '/login' && <Header />}
                <div>
                    <br></br>
                    This is the code playground page
                </div>
            </React.Fragment>
            
        )
    }
}
