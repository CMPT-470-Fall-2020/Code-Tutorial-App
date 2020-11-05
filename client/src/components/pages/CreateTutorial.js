import React, { Component } from 'react'
import MarkdownEditor from '../MarkdownEditor'
import {Container} from 'react-bootstrap';
import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap';

export default class CreateTutorial extends Component {

    state = {
        title: "Course"
    }

    handleSelect= (e) => {
        this.setState({title:e})
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    <InputGroup className="mb-3" style={tutorialTitleStyle}>
                        <FormControl placeholder="Tutorial Title"></FormControl>
                        <DropdownButton
                            as={InputGroup.Append}
                            variant="outline-secondary"
                            title={this.state.title}
                            id="dropdown-basic-button"
                            onSelect={this.handleSelect}
                            >
                            <Dropdown.Item eventKey="CMPT128">CMPT128</Dropdown.Item>
                            <Dropdown.Item eventKey="CMPT310">CMPT310</Dropdown.Item>
                            <Dropdown.Item eventKey="CMPT470">CMPT470</Dropdown.Item>
                        </DropdownButton>
                    </InputGroup>
                    
                    <MarkdownEditor></MarkdownEditor>
                </Container>
            </React.Fragment>
        )
    }
}

const tutorialTitleStyle = {
    marginTop: '2%',
    paddingLeft: '0px'
}