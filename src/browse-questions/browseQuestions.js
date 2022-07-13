const sequelize = require('./database');
const Sequelize = require('sequelize');
var initModels = require("./init-models");
var models = initModels(sequelize);

const answersPerPage = 10;

exports.show = (req, res, next) => {

    const pageNumber = req.body.pageNumber - 1;
    let questionsArray = [];
    let allQuestions;

    models.Questions.count().then(res => { allQuestions = res; })

    models.Questions.findAll({
        where: {
            id: {
                [Sequelize.Op.gte]: pageNumber * answersPerPage,
                [Sequelize.Op.lt]: (pageNumber + 1) * answersPerPage
            }
        }
    }).then(rows => {
        // if (!rows) return resolve();
        rows.forEach((row, index) => {

            let question = {}
            dateOptions = { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };

            question.id = row.id;
            question.title = row.title;
            question.text = row.text;
            question.dateCreated = new Intl.DateTimeFormat('en-US', dateOptions).format(row.dateCreated);
            let [
                [...tempKeywords]
            ] = row.keywords;
            question.keywords = tempKeywords;
            question.numberOfAnswers = (row.answers !== null) ? row.answers.length : 0;

            questionsArray.push(question);
            console.log(questionsArray)
        })
        const returnMessage = {
            questions: questionsArray,
            qCount: allQuestions
        }
        return res.status(200).json(returnMessage);
    }).catch(err => res.status(500).json({ message: 'Internal server error.', type: 'error' }))

}