const sequelize = require('../db')
const {DataTypes, Sequelize} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    publications: {type: DataTypes.INTEGER, defaultValue: 0},
    subscribers: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, defaultValue: 'nonAvatar.jpg'},
    role: {type: DataTypes.STRING, defaultValue: 'USER'}
})

const UserFollower = sequelize.define('user_followers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const UserComment = sequelize.define('user_comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    comment: {type: DataTypes.STRING},
    date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
    // user_id, avatar_id
})

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

User.belongsToMany(User, {
    as: 'Followers',
    foreignKey: 'userId',
    through: UserFollower
})

User.belongsToMany(User, {
    as: 'Following',
    foreignKey: 'followerId',
    through: UserFollower
})

User.hasMany(UserComment)
UserComment.belongsTo(User)

Avatar.hasMany(UserComment)
UserComment.belongsTo(Avatar)

User.hasMany(Avatar)
Avatar.belongsTo(User)

Avatar.hasMany(AvatarLikes, {as: 'likes'})
AvatarLikes.belongsTo(Avatar)

Avatar.hasMany(AvatarTag, {as: 'tags'})
AvatarTag.belongsTo(Avatar)

Avatar.hasOne(AvatarPublished)
AvatarPublished.belongsTo(Avatar)

module.exports = {
    User,
    UserFollower,
    UserComment,
    Avatar,
    AvatarLikes,
    AvatarTag,
    AvatarPublished
}
