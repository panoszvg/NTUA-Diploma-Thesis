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
            dateCreated: null,
            keywords: [],
            answers: [],
            answerText: ''
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
            this.setState({title: res.data.question.title});
            this.setState({text: res.data.question.text});
            this.setState({dateCreated: res.data.question.dateCreated});
            this.setState({keywords: res.data.question.keywords[0]});
            this.setState({answers: (res.data.answers.length !== 0) ? res.data.answers : []});
        })
        .catch(err => {
            console.log(err);
        })
    }

    _renderKeywords(keyword, index) {
        return (<Keyword key={index} keyword={keyword}/>)
    }

    _renderAnswers(answer, index) {
        return (<Answer key={index} answer={answer.text}/>)
    }

    handleText = (event) => {
        this.setState({answerText: event.target.value})
    }

    handleSubmit = (event) => {

        if (this.state.answerText === '') return;

        event.preventDefault()

        const config = {
            method: 'POST',
            url: `https://ntua-thesis-answers.herokuapp.com/answers/${this.state.id}`,
            headers: {'Content-Type': 'application/json'},
            data: {
                answer: this.state.answerText
            }
        }

        axios(config)
        .then(res => {
            console.log(res)
            this.setState({answerText: ''});
            window.location.reload(false);
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        return(
            <div className="QuestionPage">
                <h1>{this.state.title}</h1>
                <h3>{this.state.text}</h3>
                <div>
                <p><b>Created at: </b>{new Date(this.state.dateCreated).toLocaleString() || ''}</p>
                </div>
                <div className="row">
                    {this.state.keywords.map(this._renderKeywords)}
                </div>
                <br /><hr />
                <h2>Answers</h2>
                <br />
                {/* <div className="AnswersContainer">{(answers.length !== 0) ? answers.map(this._renderAnswers) : <br />}</div> */}
                <div className="AnswersContainer">{this.state.answers.map(this._renderAnswers)}</div>
                    <br /><br />
                    <form onSubmit={this.handleSubmit}>
                        <textarea name="" id="" cols="70" rows="10" onChange={this.handleText}></textarea>
                        <br /><br /><br />
                        <button>Submit</button>
                    </form>
            </div>
        )
    }

}

export default QuestionPageWrapper;