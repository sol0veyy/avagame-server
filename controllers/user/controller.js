const ApiError = require('../../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../../models/User/model')
const uuid = require('uuid')
const path = require('path')
const { Op } = require('sequelize')
const { Sequelize } = require('../../db')

const generateJwt = (id, img, publications, login, email, role) => {
    return jwt.sign(
        { id, img, publications, login, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    async registration(req, res, next) {
        const { login, email, password, role } = req.body
        if (!login) {
            return next(ApiError.badRequest('Некорректный логин'))
        }
        const regularEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
        if (!email || !regularEmail.test(email)) {
            return next(ApiError.badRequest('Некорректный email'))
        }
        if (!password) {
            return next(ApiError.badRequest('Некорректный пароль'))
        }
        if (password.length < 8) {
            return next(ApiError.badRequest('Пароль должен быть не менее 8 символов'))
        }
        const candidateLogin = await User.findOne({ where: { login } })
        const candidateEmail = await User.findOne({ where: { email } })
        if (candidateLogin) {
            return next(ApiError.badRequest('Логин занят'))
        }
        if (candidateEmail) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ login, email, role, password: hashPassword })
        const token = generateJwt(user.id, user.img, user.publications, user.login, user.email, user.role)
        return res.json({ token, user })
    }

    async login(req, res, next) {
        const { login, password } = req.body
        const user = await User.findOne({ where: { login } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.img, user.publications, user.login, user.email, user.role)
        return res.json({ token })
    }

    async settings(req, res, next) {
        const { isImg, userId, login, password, email } = req.body;

        const isLogin = await User.findOne({ where: { login } });
        const isEmail = await User.findOne({ where: { email } });

        if (isLogin) {
            return next(ApiError.internal('Логин уже занят'));
        } else if (isEmail) {
            return next(ApiError.internal('Почта уже занята'));
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.findByPk(userId);

        if (isImg === "true") {
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));
            await user.update({ img: fileName });
        }
        if (login) {
            await user.update({ login: login });
        }
        if (password) {
            if (password.length < 8) {
                return next(ApiError.badRequest('Пароль должен быть не менее 8 символов'))
            }
            await user.update({ password: hashPassword });
        }
        if (email) {
            const regularEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
            if (!email || !regularEmail.test(email)) {
                return next(ApiError.badRequest('Некорректный email'))
            }
            await user.update({ email: email });
        }

        const token = generateJwt(user.id, user.img, user.publications, user.login, user.email, user.role)
        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.img, req.user.publications, req.user.login, req.user.email, req.user.role);
        return res.json({ token });
    }

    async update(req, res) {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        const token = generateJwt(user.id, user.img, user.publications, user.login, user.email, user.role);
        return res.json({ token });
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: {
                    include: [[Sequelize.literal(`(
                        SELECT COUNT(al.id) AS total_likes
                        FROM users u
                        LEFT JOIN avatars a ON u.id = a."userId"
                        LEFT JOIN avatar_likes al ON a.id = al."avatarId"
                        WHERE u.id = "user"."id" 
                        AND al."createdAt" >= CURRENT_DATE - INTERVAL '7 days'
                    )`), 'weekly_likes']]
                },
                order: [['weekly_likes', 'DESC']]
            });
            return res.json({ users })
        } catch {
            next(ApiError.badRequest('Не удалось получить пользователей'));
        }
    }

    async getAllByFilter(req, res, next) {
        const { findText } = req.params;

        try {
            const users = await User.findAll({
                where: {
                    login: {
                        [Op.iLike]: `${findText}%`
                    }
                }
            });

            return res.json({ users });
        } catch {
            next(ApiError.badRequest('Ошибка при получении пользователей'));
        }
    }

    async getUserByLogin(req, res, next) {
        const { login } = req.params;

        try {
            const user = await User.findOne({
                where: { login }
            });

            return res.json({ user });
        } catch {
            next(ApiError.badRequest('Не удалось получить пользователя'));
        }
    }
}

module.exports = new UserController()