import React, { Component } from "react";
import './Navbar.css';

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            askQuestion: true,
        };
    }

    clickAskQuestion = () => {
        this.setState({ askQuestion: true });
    }

    clickBrowseQuestions = () => {
        this.setState({ askQuestion: false });
    }

    render () {
        return (
        <div className="topnav">
            <a href="/" onClick={this.clickAskQuestion}>Ask a Question</a>
            <a href="/browse" onClick={this.clickBrowseQuestions}>Browse Questions</a>
        </div>   
        )
    }
}

export default Navbar;