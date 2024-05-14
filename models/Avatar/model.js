const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const Avatar = sequelize.define('avatar', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  img: {type: DataTypes.STRING},
  date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
  
})

const AvatarLikes = sequelize.define('avatar_likes', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  avatarId: {type: DataTypes.INTEGER},
  userId: {type: DataTypes.INTEGER}
})

const AvatarTag = sequelize.define('avatar_tag', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
  // avatar_id
})

const AvatarPublished = sequelize.define('avatar_published', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
  rate: {type: DataTypes.INTEGER, defaultValue: 0}
  // avatar_id
})

module.exports = {
  Avatar,
  AvatarLikes,
  AvatarTag,
  AvatarPublished
}