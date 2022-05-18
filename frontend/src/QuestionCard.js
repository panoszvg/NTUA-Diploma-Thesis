import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './QuestionCard.css';
const axios = require('axios');

class Keyword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: props.keyword,
            qid: 0
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
            qid: props.qid,
            qname: props.qname,
            qtext: props.qtext,
            qkeywords: props.qkeywords,
            dateCreated: props.dateCreated,
            numberOfAnswers: props.numberOfAnswers
        }
    }

    _renderKeywords(keyword, index) {
        return (<Keyword key={index} keyword={keyword}/>)
    }

    render() {
        let linkToQuestion = `/question/${this.state.qid}`;
        return(
            <div className="QuestionCard">
                <h2>{this.state.qname}</h2>
                <h3>{this.state.qtext}</h3>
                <div className="row">{this.state.qkeywords.map(this._renderKeywords)}</div>
                <div className="row">
                    <div className="colDate">
                        <p className="dateCreated">{this.state.dateCreated}</p>
                    </div>
                    <div className="colButton">
                    <Link to={linkToQuestion}>
                        <button>Answer <label className="answerLabel">{this.state.numberOfAnswers}</label> </button>
                    </Link>
                    </div>
                </div>
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
            url: "https://ntua-thesis-browse-questions.herokuapp.com/show",
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
        return (<QuestionCard key={index} qid={question.id} qname={question.title} qtext={question.text} qkeywords={question.keywords} dateCreated={question.dateCreated} numberOfAnswers={question.numberOfAnswers}/>)
    }

    render() {
        return(
            <div className="QuestionCardList">{(this.state.questions != null) ? this.state.questions.sort((a, b) => a.id - b.id).map(this._renderQuestions) : []}</div>
        )
    }

}


export default QuestionCardList;