const { Router } = require('express');
const CommentController = require('../../controllers/comment/controller');
const authMiddleware = require('../../middleware/authMiddleware');

const router = new Router();

router.get('/:avatarId', CommentController.getAll);
router.post('/', authMiddleware, CommentController.create);
router.delete('/:commentId', authMiddleware, CommentController.remove);

module.exports = router;