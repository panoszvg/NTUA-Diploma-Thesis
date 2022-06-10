const app = require('./app');
const graphsContract = require('./wallet');

const subscribe = () => {
    const { Kafka } = require("kafkajs")

    const kafka = new Kafka({
        clientId: "consumer",
        brokers: ['83.212.78.171:9092'],
    })

    const consumer = kafka.consumer({ groupId: "test-3" })

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
                date = (date.getTime() / 1000);

                // contract.methods.addToDay(key, elem.keywords, elem.questions, elem.answers, elem.noKeywords).send({ from: currentAccount })
                if (topic === 'QUESTION') {
                    let result;
                    if (jsonMessage.qkeywords === "") {
                        result = await graphsContract.methods.addToDay(date, '', 1, 0, 1).send({ from: process.env.ACCOUNT_ADDRESS });
                    } else {
                        result = await graphsContract.methods.addToDay(date, jsonMessage.qkeywords, 1, 0, 0).send({ from: process.env.ACCOUNT_ADDRESS });
                    }
                    //console.log(result);
                } else {
                    let result = await graphsContract.methods.addToDay(date, '', 0, 1, 0).send({ from: process.env.ACCOUNT_ADDRESS });
                    //console.log(result);
                }

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