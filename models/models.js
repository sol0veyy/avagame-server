const { User, UserFollower } = require('./User/model')
const { Avatar, AvatarLikes, AvatarPublished, AvatarTag } = require('./Avatar/model')
const { Comment } = require('./Comment/model')

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

User.hasMany(Comment)
Comment.belongsTo(User, { as: 'user'})

Avatar.hasMany(Comment, {as: 'comments'})
Comment.belongsTo(Avatar)

User.hasMany(Avatar)
Avatar.belongsTo(User, {as: 'user'})

Avatar.hasMany(AvatarLikes, {as: 'likes'})
AvatarLikes.belongsTo(Avatar)

Avatar.hasMany(AvatarTag, {as: 'tags'})
AvatarTag.belongsTo(Avatar)

Avatar.hasOne(AvatarPublished)
AvatarPublished.belongsTo(Avatar)
