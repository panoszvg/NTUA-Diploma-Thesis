import React, { Component } from "react";
import './QuestionCard.css';

class Keyword extends Component {

    render() {
        return(
            <p className="Keyword">Keyword</p>
        )
    }
}

class QuestionCard extends Component {

    render() {
        return(
            <div className="QuestionCard">
                <h2>This is a question</h2>
                <h3>This is the text of the question. What seems to be the best way to make it appear good?</h3>
                <div className="row">
                    <Keyword/>
                    <Keyword/>
                </div>

                <button>Answer</button>
            </div>
        )
    }

}

class QuestionCardList extends Component {

    render() {
        return(
            <div className="QuestionCardList">
                <QuestionCard/>
                <QuestionCard/>
                <QuestionCard/>

            </div>
        )
    }

}


export default QuestionCardList;