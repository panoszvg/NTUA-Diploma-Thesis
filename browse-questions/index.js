const app = require('./app');
const subscribe = () => {
    const { Kafka } = require("kafkajs")

    const kafka = new Kafka({
        clientId: "consumer",
        brokers: ['panos-Inspiron-7570:9092'],
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
            }
        })
    }

    run().catch(e => console.error(`[kafka-consumer] ${e.message}`, e))
}

subscribe();

const port = Number(4003);

app.listen(port, () => {
    console.log(`Browse Questions Service running on port ${port}!`);
});