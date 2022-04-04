let { DataTypes } = require('sequelize')
let db = require('./database')

let Article = db.define('articles', {
    id : {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'articles'
})


module.exports = Article