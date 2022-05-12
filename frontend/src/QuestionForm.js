import React, { Component } from "react";
import './QuestionForm.css';
const axios = require('axios')

class QuestionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            qname: '',
            qtext: '',
            qkeywords: '',
        };
    }

    handleSubmit = (event) => {

        event.preventDefault()

        const config = {
            method: 'POST',
            url: "http://localhost:4001/",
            headers: {'Content-Type': 'application/json'},
            data: {
                qname: this.state.qname,
                qtext: this.state.qtext,
                qkeywords: this.state.qkeywords
            }
        }

        axios(config)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    handleTitle = (event) => {
        this.setState({qname: event.target.value})
    }

    handleText = (event) => {
        this.setState({qtext: event.target.value})
    }

    handleKeywords = (event) => {
        this.setState({qkeywords: event.target.value})
    }

    render() {
        return (
            <div className="QuestionForm">
                <h1>Ask a Question:</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3 className="titles">Title</h3>
                    <input type="text" name="qtitle" onChange={this.handleTitle} className="input" />
                    <h3 className="titles">Text</h3>
                    <textarea name="qtext" onChange={this.handleText} cols="30" rows="5" style={{"fontSize": "17px"}} />
                    <h3 className="titles">Keywords</h3>
                    <input type="text" name="qkeywords" onChange={this.handleKeywords} className="input" />
                    <br /><br /><br />
                    <button type="submit" className="submitButton">Submit</button>
                    <br />
                </form>
            </div>
        )
    }

}

export default QuestionForm;