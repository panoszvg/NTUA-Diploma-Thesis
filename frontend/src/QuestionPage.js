import React, { Component } from "react";
import './QuestionPage.css';

class Keyword extends Component {

    render() {
        return(
            <p className="Keyword">Keyword</p>
        )
    }
}

class Answer extends Component {

    render () {
        return(
            <li className="Answer">This is an answer</li>
        )
    }
}

class QuestionPage extends Component {

    render() {
        return(
            <div className="QuestionPage">
                <h1>This is a question</h1>
                <h3>This is the text of the question. What seems to be the best way to make it appear good?</h3>
                <div className="row">
                    <Keyword/>
                    <Keyword/>
                </div>
                <br /><hr />
                <h2>Answers</h2>
                <br />
                <div className="AnswersContainer">
                    <Answer/>
                    <Answer/>
                </div>
                    <br /><br />
                    <textarea name="" id="" cols="70" rows="10"></textarea>
                    <br /><br /><br />
                    <button>Submit</button>
            </div>
        )
    }

}

export default QuestionPage;