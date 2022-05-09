const express = require('express');
const browseQuestions = require('./browseQuestions');

const router = express.Router();

router.post('/show', browseQuestions.show);
router.post('/questions/user/:id', browseQuestions.getUserQuestions);

module.exports = router;