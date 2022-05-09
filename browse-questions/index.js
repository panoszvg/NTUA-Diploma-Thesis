const app = require('./app');

const port = Number(4003);

app.listen(port, () => {
    console.log(`Browse Questions Service running on port ${port}!`);
});