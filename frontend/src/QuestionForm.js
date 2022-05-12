import React, { Component } from "react";
import './QuestionForm.css';

class QuestionForm extends Component {

    render() {
        return (
            <div className="QuestionForm">
                <h1>Ask a Question:</h1>
                <h3 className="titles">Title</h3>
                <input type="text" name="qtitle" className="input" />
                <h3 className="titles">Text</h3>
                <textarea name="qtext" id="" cols="30" rows="5" style={{"font-size": "17px"}}></textarea>
                <h3 className="titles">Keywords</h3>
                <input type="text" name="qkeywords" className="input" />
                <br /><br /><br />
                <button type="submit" className="submitButton">Submit</button>
                <br />
            </div>
        )
    }

}

export default QuestionForm;