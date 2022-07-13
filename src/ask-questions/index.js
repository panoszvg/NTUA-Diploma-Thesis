const app = require('./app');

const port = Number(4001);
const PORT = process.env.PORT || port;

app.listen(PORT, () => {
    console.log(`Ask Questions Service running on port ${PORT}!`)
});