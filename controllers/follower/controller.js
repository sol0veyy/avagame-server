const { Op } = require("sequelize")
const ApiError = require("../../error/ApiError")
const { UserFollower, User } = require("../../models/User/model");

class FollowerController {
    async follow(req, res, next) {
        const { userId } = req.body

        try {
            const user = req.user;
            const follower = await UserFollower.create({followerId: user.id, userId})

            return res.json({follower})
        } catch {
            return next(ApiError.badRequest('Ошибка при подписке'))
        }

    }

    async unfollow(req, res, next) {
        const { userId } = req.params

        try {
            const user = req.user;
            const follower = await UserFollower.findOne({where: {followerId: user.id, userId}})
            await follower.destroy()
    
            return res.json({follower})
        } catch {
            return next(ApiError.badRequest('Ошибка при отписке'))
        }
    }

    async getIsUserFollow(req, res, next) {
        const { userId } = req.params;

        try {
            const user = req.user;
            const isFollow = await UserFollower.findOne({where: {followerId: user.id, userId}})

            return res.json({isFollow: Boolean(isFollow)})
        } catch {
            next(ApiError.badRequest('Не удалось получить подписку на пользователя'));
        }
    }

    async getAllUserSubs(req, res, next) {
        const {followerId} = req.params

        try {
            const userSubs = await UserFollower.findAll({where: {followerId}});

            const usersId = userSubs.map((userSub) => userSub.userId);

            const users = await User.findAll({
                where: {id: usersId}
            });

            return res.json({users})
        } catch {
            next(ApiError.badRequest('Ошибка при получении подписок'))
        }
    }

    async getSubsByFilter(req, res, next) {
        const { findText } = req.params;
        const user = req.user;

        try {
            const userSubs = await UserFollower.findAll({
                where: {
                    followerId: user.id,
                }
            });

            const userSubsID = userSubs.map(sub => sub.userId);

            const users = await User.findAll({
                where: {
                    id: userSubsID,
                    login: {
                        [Op.iLike]: `${findText}%`
                    }
                }
            });

            return res.json({ users });
        } catch {
            next(ApiError.badRequest('Ошибка при получении подписок'));
        }
    }
}

module.exports = new FollowerController()