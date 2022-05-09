const app = require('./app');

const port = Number(4002);

app.listen(port, () => {
    console.log(`Answers Service running on port ${port}!`)
});