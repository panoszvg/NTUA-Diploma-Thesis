const Sequelize = require('sequelize')

// require('custom-env').env('')

let sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    timezone: process.env.DB_TIMEZONE
});

sequelize.authenticate()
    .then(() => {
        console.log("Success connecting to database!");
    })
    .catch(err => {
        console.error("Unable to connect to the database", err);
    })

module.exports = sequelize;