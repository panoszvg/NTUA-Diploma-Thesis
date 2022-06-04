const express = require('express');
const data = require('./data');

const router = express.Router();

router.get('/data', data.getKafkaMessages);

module.exports = router;