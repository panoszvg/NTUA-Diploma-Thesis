const express = require('express');
const answers = require('./answers');

const router = express.Router();

router.get('/question/:id', answers.getQuestion);
router.post('/answers/:id', answers.postAnswer);

module.exports = router;