let { Sequelize } = require('sequelize')

const db = new Sequelize('articles', 'admin', 'admin', {
    host: 'db.sqlite3',
    dialect: 'sqlite'
})

module.exports = db