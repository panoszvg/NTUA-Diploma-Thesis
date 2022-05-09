const express = require('express');
const browseQuestions = require('./routes');
const app = express();

app.use(express.json());
app.use('/', browseQuestions);
app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found!' }); })

module.exports = app;