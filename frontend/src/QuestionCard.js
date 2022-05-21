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
                <h3 style={{"marginBottom":"40px"}}>{this.state.qtext}</h3>
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
        this.state = { 
            questions: null,
            qCount: 0,
            currentPage: 1
        };
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
            this.setState({qCount: (res.data.qCount % 10 === 0) ? (res.data.qCount/10) : ((res.data.qCount/10) + 1)});
        })
        .catch(err => {
            console.log(err);
        })
    }

    _renderQuestions(question, index) {
        return (<QuestionCard key={question.id} qid={question.id} qname={question.title} qtext={question.text} qkeywords={question.keywords} dateCreated={question.dateCreated} numberOfAnswers={question.numberOfAnswers}/>)
    }

    _renderButtons() {

    }

    getPage(param) {
        if (this.state.currentPage === param) return;
        else this.setState({currentPage: param});
        const config = {
            method: 'POST',
            url: "https://ntua-thesis-browse-questions.herokuapp.com/show",
            headers: {'Content-Type': 'application/json'},
            data: {
                pageNumber: param
            }
        }
        axios(config)
        .then(res => {
            console.log(res.data)
            this.setState({questions: res.data.questions});
            this.setState({qCount: (res.data.qCount % 10 === 0) ? (res.data.qCount/10) : ((res.data.qCount/10) + 1)});
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        let buttons = [];
        for (let i = 1; i <= this.state.qCount; i++) {
            buttons.push(<button key={i} onClick={() => {this.getPage(i)}} className="paginationButton">{i}</button>)
        }
        return(
            <div className="BrowsePage">
                <div style={{"marginTop": "30px"}}>
                    {buttons}
                </div>
                <div className="QuestionCardList">{(this.state.questions != null) ? this.state.questions.sort((a, b) => a.id - b.id).map(this._renderQuestions) : []}</div>
                <div className="paginationButtons">
                    {buttons}
                </div>
            </div>
        )
    }

}


export default QuestionCardList;