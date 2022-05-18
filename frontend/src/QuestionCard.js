import React, { Component } from "react";
import './QuestionCard.css';
const axios = require('axios');

class Keyword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: props.keyword
        }
    }

    render() {
        return(
            <p className="Keyword">{this.state.keyword}</p>
        )
    }
}

class QuestionCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            qname: props.qname,
            qtext: props.qtext,
            qkeywords: props.qkeywords
        }
    }

    _renderKeywords(keyword, index) {
        return (<Keyword key={index} keyword={keyword}/>)
    }

    render() {
        return(
            <div className="QuestionCard">
                <h2>{this.state.qname}</h2>
                <h3>{this.state.qtext}</h3>
                <div className="row">{this.state.qkeywords.map(this._renderKeywords)}</div>

                <button>Answer</button>
            </div>
        )
    }

}

class QuestionCardList extends Component {

    constructor(props) {
        super(props);
        this.state = { questions: null };
    }

    componentDidMount() {
        const config = {
            method: 'POST',
            url: "http://ntua-thesis-browse-questions.herokuapp.com/show",
            headers: {'Content-Type': 'application/json'},
            data: {
                pageNumber: 1
            }
        }
        axios(config)
        .then(res => {
            this.setState({questions: res.data.questions});
        })
        .catch(err => {
            console.log(err);
        })
    }

    _renderQuestions(question, index) {
        return (<QuestionCard key={index} qname={question.title} qtext={question.text} qkeywords={question.keywords}/>)
    }

    render() {
        return(
            <div className="QuestionCardList">{(this.state.questions != null) ? this.state.questions.map(this._renderQuestions) : []}</div>
        )
    }

}


export default QuestionCardList;