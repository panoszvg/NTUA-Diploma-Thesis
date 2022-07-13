const express = require('express');
const browseQuestions = require('./browseQuestions');

const router = express.Router();

router.post('/show', browseQuestions.show);

module.exports = router;