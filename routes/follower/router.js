const Router = require('express');
const router = new Router();
const followerController = require('../../controllers/follower/controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/follow', authMiddleware, followerController.follow);
router.delete('/unfollow/:userId', authMiddleware, followerController.unfollow);
router.get('/isUserFollow/:userId', authMiddleware, followerController.getIsUserFollow);
router.get('/userSubs/:followerId', followerController.getAllUserSubs);
router.get('/userSubsByFilter/:findText', authMiddleware, followerController.getSubsByFilter);

module.exports = router