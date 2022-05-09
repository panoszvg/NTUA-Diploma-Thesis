const express = require('express');
const createQuestion = require('./createQuestion')
const app = express();

app.use(express.json());

app.use('/', createQuestion);
app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found!' }); })
module.exports = app;