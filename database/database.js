const Sequelize = require("sequelize")

const connection = new Sequelize('bd2','root','@@hh1983',{
    host: '127.0.0.1',
    dialect: 'mysql'
})



module.exports = connection