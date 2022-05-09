const app = require('./app');

const port = Number(4001);

app.listen(port, () => {
    console.log(`Ask Questions Service running on port ${port}!`)
});