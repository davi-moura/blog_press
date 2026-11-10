const Sequelize = require("sequelize")

const connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: process.env.DB_DIALECT || "mysql",
        timezone: process.env.DB_TIMEZONE || "-03:00",
    }
)

module.exports = connection