const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    comment: {type: DataTypes.STRING},
    date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
})

module.exports = {
    Comment
}