const app = require('./app');
const { kafkaMessages } = require('./data');

const subscribe = () => {
    const { Kafka } = require("kafkajs")

    const kafka = new Kafka({
        clientId: "consumer",
        brokers: ['83.212.78.171:9092'],
    })

    const consumer = kafka.consumer({ groupId: "blockchain" })

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
                let date = new Date(parseInt(message.timestamp));
                date.setHours(0, 0, 0, 0);
                date = date.getTime() / 1000;
                kafkaMessages.push({
                    date: date,
                    topic: topic,
                    keywords: jsonMessage.qkeywords || "",
                    noKeywords: (jsonMessage.qkeywords === "" && topic === "QUESTION") ? 1 : 0
                })
            }
        })
    }

    run().catch(e => console.error(`[kafka-consumer] ${e.message}`, e))
}

subscribe();

const port = Number(4004);
const PORT = process.env.PORT || port;

app.listen(PORT, () => {
    console.log(`Blockchain backend service running on port ${PORT}!`)
});