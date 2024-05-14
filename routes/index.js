const Router = require('express')
const router = new Router()
const avatarRouter = require('./avatar/router')
const userRouter = require('./user/router')
const commentRouter = require('./comment/router');
const followerRouter = require('./follower/router')

router.use('/user', userRouter);
router.use('/follower', followerRouter);
router.use('/avatar', avatarRouter);
router.use('/comment', commentRouter);

module.exports = router