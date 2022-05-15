// initialize database
const sequelize = require("./database");
var initModels = require("./init-models");
var models = initModels(sequelize)

const app = require('./app');

const subscribe = () => {
    const { Kafka } = require("kafkajs")

    const kafka = new Kafka({
        clientId: "consumer",
        brokers: ['node-0:9092'],
    })

    const consumer = kafka.consumer({ groupId: "browse-questions-group" })

    const run = async() => {
        await consumer.connect()
        await consumer.subscribe({ topic: "QUESTION", fromBeginning: true })
        await consumer.subscribe({ topic: "ANSWER", fromBeginning: true })
        await consumer.run({
            eachMessage: async({ topic, partition, message }) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                const payload = `- ${prefix} ${message.key}#${message.value}`
                console.log(payload)
                let jsonMessage = JSON.parse(message.value);
                if (topic == "QUESTION") {
                    models.Questions.create({
                        title: jsonMessage.qname,
                        text: jsonMessage.qtext,
                        keywords: [jsonMessage.qkeywords.replace(/\s/g, "").split(",")],
                        dateCreated: Date.now(),
                        answers: null
                    })
                } else if (topic == "ANSWER") {
                    models.Questions.update({ 'answers': sequelize.fn('array_append', sequelize.col('answers'), jsonMessage.answerId) }, { where: { id: jsonMessage.questionId } })
                }
            }
        })

    }

    run().catch(e => console.error(`[kafka-consumer] ${e.message}`, e))
}

subscribe();

// sequelize.sync({ force: true })

const port = Number(4003);

app.listen(port, () => {
    console.log(`Browse Questions Service running on port ${port}!`);
});