const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    publications: { type: DataTypes.INTEGER, defaultValue: 0 },
    subscribers: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, defaultValue: 'nonAvatar.jpg' },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
})

const UserFollower = sequelize.define('user_followers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = {
    User,
    UserFollower
}