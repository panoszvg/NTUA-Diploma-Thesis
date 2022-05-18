import React, { Component } from "react";
import { useParams } from "react-router";
import './QuestionPage.css';
const axios = require('axios');

class Keyword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: props.keyword,
        }
    }

    render() {
        return(
            <p className="Keyword">{this.state.keyword}</p>
        )
    }
}

class Answer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            answer: props.answer,
        }
    }

    render() {
        return(
            <li className="Answer">{this.state.answer}</li>
        )
    }
}

const QuestionPageWrapper = () => {
    const { id } = useParams();
    return <QuestionPage id={id}/>;
}

class QuestionPage extends Component {

    constructor(props) {
        super();
        this.state = {
            id: props.id,
            title: '',
            text: '',
            dateCreated: '',
            keywords: [],
            answers: []
        }
    }

    componentDidMount() {
        const config = {
            method: 'GET',
            url: `https://ntua-thesis-answers.herokuapp.com/question/${this.state.id}`,
            headers: {'Content-Type': 'application/json'}
        }
        axios(config)
        .then(res => {
            console.log(res.data)
            this.setState({title: res.data.question.title});
            this.setState({text: res.data.question.text});
            this.setState({dateCreated: res.data.question.dateCreated});
            this.setState({keywords: res.data.question.keywords[0]});
            this.setState({answers: (res.data.answers.length != 0) ? res.data.question.answers : []});
        })
        .catch(err => {
            console.log(err);
        })
    }

    _renderKeywords(keyword, index) {
        return (<Keyword key={index} keyword={keyword}/>)
    }

    _renderAnswers(answer, index) {
        return (<Answer key={index} answer={answer}/>)
    }

    render() {
        console.log(this.state.keywords)
        return(
            <div className="QuestionPage">
                <h1>{this.state.title}</h1>
                <h3>{this.state.text}</h3>
                <div className="row">{this.state.keywords.map(this._renderKeywords)}</div>
                <br /><hr />
                <h2>Answers</h2>
                <br />
                <div className="AnswersContainer">{(this.state.answers != []) ? this.state.answers.map(this._renderAnswers) : <br />}</div>
                    <br /><br />
                    <textarea name="" id="" cols="70" rows="10"></textarea>
                    <br /><br /><br />
                    <button>Submit</button>
            </div>
        )
    }

}

export default QuestionPageWrapper;