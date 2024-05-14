const ApiError = require('../../error/ApiError');
const { Avatar } = require('../../models/Avatar/model');
const { Comment } = require('../../models/Comment/model');
const { User } = require('../../models/User/model');

const commentModelsInclude = [{
    model: User,
    as: 'user'
}]

class CommentController {
    async create(req, res, next) {
        try {
            const { avatarId, comment } = req.body;
            const user = req.user

            const avatar = await Avatar.findByPk(avatarId);
    
            if (!avatar) {
                return next(ApiError.badRequest(`Не удалось найти аватарку с id ${avatarId}`));
            }
            if (comment.trim() == '') {
                return next(ApiError.badRequest('Комментарий не должен быть пустым'));
            }

            const userComment = await Comment.create({ comment, userId: user.id, avatarId });
            const commentWithUser = await Comment.findOne({
                where: { id: userComment.id },
                include: commentModelsInclude
            })

            return res.json({ comment: commentWithUser });
        } catch (err) {
            return next(ApiError.badRequest(`Ошибка при создании комментария \n ${err}`));
        }
    }

    async remove(req, res, next) {
        try {
            const { commentId } = req.body;
            const user = req.user;

            const comment = await Comment.findByPk(commentId);

            if (!comment) {
                return next(ApiError.badRequest(`Не удалось найти комментарий с id ${commentId}`));
            }
            if (comment.userId !== user.id) {
                return next(ApiError.badRequest('Вы не создатель данного комментария, поэтому вы не можете его удалить'));
            }

            comment.destroy();

            return res.json({ message: 'Комментарий удалён' });
        } catch (err) {
            return next(ApiError.badRequest(`Ошибка при удалении комментария \n ${err}`));
        }
    }

    async getAll(req, res, next) {
        try {
            const { avatarId } = req.params;

            const avatar = await Avatar.findByPk(avatarId);

            if (!avatar) {
                return next(ApiError.badRequest(`Не удалось найти аватарку с id ${avatarId}`));
            }

            const comments = await Comment.findAll({
                where: { avatarId },
                include: commentModelsInclude
            });

            return res.json({ comments });
        } catch (err) {
            return next(ApiError.badRequest(`Ошибка при получении комментариев аватарки \n ${err}`))
        }
    }
}

module.exports = new CommentController();