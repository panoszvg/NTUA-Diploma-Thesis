// initialize database
const sequelize = require("./database");
const Sequelize = require('sequelize')
var initModels = require("./init-models");
var models = initModels(sequelize)

let messageKey = 0;

exports.getQuestion = (req, res, next) => {

    let questionId = req.params.id;

    models.Questions.findAll({
        where: {
            id: {
                [Sequelize.Op.eq]: questionId
            }
        }
    }).then(row => {
        console.log(row)
        if (row.length == 0) return res.status(404).json({ message: 'Question Not Found.', type: 'error' });
        else res.status(200).json(row[0]);
    })
}

exports.postAnswer = (req, res, next) => {

    const questionId = req.params.id;
    const answerText = req.body.answer;

    if (answerText === '') return res.status(400).json({ message: 'Answer body cannot be empty.', type: 'error' })

    models.Answers.create({
        text: answerText,
        dateCreated: Date.now(),
        QuestionsId: questionId
    }).then(insertedAnswer => {

        const { Kafka } = require('kafkajs');

        const kafka = new Kafka({
            clientId: "answers",
            brokers: ['panos-Inspiron-7570:9092'],
        })

        const producer = kafka.producer();

        let kafkaMessage = {
            answer: answerText,
            questionId: questionId,
            answerId: insertedAnswer.id
        }

        const run = async() => {
            await producer.connect();
            await producer.send({
                topic: "ANSWER",
                messages: [{ key: messageKey.toString(), value: JSON.stringify(kafkaMessage) }]
            })
            messageKey++;
        }

        run().catch(e => console.error(`[kafka-producer] ${e.message}`, e));
    })

    res.status(200).json({ message: 'OK', type: 'Success' });
}