const Sequelize = require("sequelize")

const connection = new Sequelize('bd2','root','123456',{
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '-03:00'//dependendo do pais do servidor aonde o app vai ficar
})



module.exports = connection