let messageKey = 0;

module.exports = (req, res, next) => {

    console.log(req.body)

    let qname = req.body.qname;
    let qtext = req.body.qtext;

    let validationError = false,
        errors = [];

    if (!qname) {
        validationError = true;
        errors.push({ message: 'Question Name is undefined', type: 'error' });
    }

    if (!qtext) {
        validationError = true;
        errors.push({ message: 'Question Text is undefined', type: 'error' });
    }

    if (validationError) return res.status(400).json({ message: 'Validation Error:', errors: errors });

    // const { Kafka } = require('kafkajs');

    // const kafka = new Kafka({
    //     clientId: "ask-questions",
    //     brokers: ['panos-Inspiron-7570:9092'],
    // })

    // const producer = kafka.producer();

    // console.log(JSON.stringify(req.body))
    // const run = async() => {
    //     await producer.connect();
    //     await producer.send({
    //         topic: "QUESTION",
    //         messages: [{ key: messageKey.toString(), value: JSON.stringify(req.body) }]
    //     })
    //     messageKey++;
    // }

    // run().catch(e => console.error(`[kafka-producer] ${e.message}`, e));

    res.status(200).json({ message: 'OK', type: 'success' })
}