const {
    Avatar,
    AvatarTag,
    AvatarLikes,
} = require('../../models/Avatar/model');
const ApiError = require('../../error/ApiError');
const path = require('path');
const uuid = require('uuid');
const { User } = require('../../models/User/model');

const avatarModelsIncludes = [
    {
        model: AvatarTag,
        as: 'tags',
    },
    {
        model: AvatarLikes,
        as: 'likes',
    },
    {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
    }
]

class AvatarController {
    async create(req, res, next) {
        try {
            let { userId, tags } = req.body;
            const { img } = req.files;
            const fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const avatar = await Avatar.create({ userId, img: fileName });
            const userAvatars = await Avatar.findAll({
                where: {userId},
                order: [['id', 'DESC']],
                include: avatarModelsIncludes,
            });
            const user = await User.findByPk(userId);
            await user.update({ publications: user.publications + 1 });

            if (tags) {
                tags = JSON.parse(tags);
                tags.forEach((i) => {
                    AvatarTag.create({
                        avatarId: avatar.id,
                        name: i,
                    });
                });
            }

            return res.json(userAvatars);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delAvatar(req, res) {
        const { avatarId, userId } = req.body;
        await Avatar.destroy({
            where: {
                id: avatarId,
                userId: userId,
            },
        });
        const user = await User.findByPk(userId);
        await user.update({ publications: user.publications - 1 });
        const userAvatars = await Avatar.findAll({
            where: {userId},
            order: [['id', 'DESC']],
            include: avatarModelsIncludes,
        });
        return res.json(userAvatars);
    }

    async setLikes(req, res) {
        const { avatarId, userId } = req.body;

        await AvatarLikes.create({ avatarId, userId });

        const avatar = await Avatar.findByPk(avatarId, {
            order: [['id', 'DESC']],
            include: avatarModelsIncludes,
        });

        return res.json(avatar);
    }

    async delLike(req, res) {
        const { avatarId, userId } = req.body;

        await AvatarLikes.destroy({
            where: { avatarId, userId },
        });

        const avatar = await Avatar.findByPk(avatarId, {
            order: [['id', 'DESC']],
            include: avatarModelsIncludes,
        });

        return res.json(avatar);
    }

    async getLike(req, res) {
        const { avatarId, userId } = req.params;
        const avatarLike = await AvatarLikes.findOne({
            where: { avatarId, userId },
        });

        return res.json(avatarLike);
    }

    async getUserAvatars(req, res) {
        const { userId } = req.params;
        const avatars = await Avatar.findAll({
            where: { userId },
            order: [['id', 'DESC']],
            include: avatarModelsIncludes,
        });
        return res.json(avatars);
    }

    async getAll(req, res, next) {
        try {
            const avatars = await Avatar.findAll({
                order: [['id', 'DESC']],
                include: avatarModelsIncludes
            });
            const colAvatars = await Avatar.count();
            return res.json({avatars, colAvatars});
        } catch (err) {
            return next(ApiError.internal(`Не удалось получить аватарки ${err}`));
        }
    }

    async getByTag(req, res) {
        const { tag } = req.params;
        const avatars = await Avatar.findAll({
            order: [['id', 'DESC']],
            include: avatarModelsIncludes,
        });
        return res.json(avatars);
    }
}

module.exports = new AvatarController();
