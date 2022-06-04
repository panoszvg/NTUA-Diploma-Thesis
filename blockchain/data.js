exports.kafkaMessages = [];

exports.getKafkaMessages = (req, res, next) => {
    let returnArray = []
    for (let i = 0; i <= this.kafkaMessages.length; i++) {
        returnArray.push(this.kafkaMessages.shift());
    }
    return res.status(200).json(returnArray);
}