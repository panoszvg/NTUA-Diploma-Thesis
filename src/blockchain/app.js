const express = require('express');
const data = require('./routes')
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors());
app.use('/', data);
app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found!' }); })

module.exports = app;