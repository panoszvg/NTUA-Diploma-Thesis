// initialize database
const sequelize = require("./database");
var initModels = require("./init-models");
var models = initModels(sequelize)

let messageKey = 0;

exports.getQuestion = (req, res, next) => {
    res.status(200).json({ message: 'OK', type: 'Success' });
}

exports.postAnswer = (req, res, next) => {

    const questionId = req.params.id;
    const answerText = req.body.answer;

    if (answerText === '') return res.status(400).json({ message: 'Answer body cannot be empty.', type: 'error' })

    models.Answers.create({
        text: answerText,
        dateCreated: Date.now(),
        QuestionsId: questionId
    })

    const { Kafka } = require('kafkajs');

    const kafka = new Kafka({
        clientId: "answers",
        brokers: ['panos-Inspiron-7570:9092'],
    })

    const producer = kafka.producer();

    console.log(JSON.stringify(req.body))
    const run = async() => {
        await producer.connect();
        await producer.send({
            topic: "ANSWER",
            messages: [{ key: messageKey.toString(), value: JSON.stringify(req.body) }]
        })
        messageKey++;
    }

    run().catch(e => console.error(`[kafka-producer] ${e.message}`, e));

    res.status(200).json({ message: 'OK', type: 'Success' });
}