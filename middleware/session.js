const jwt = require('jsonwebtoken');
const { Session, User } = require('../models');

const session = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return next();
        }

        const session = await Session.findOne({
            where: { 
                token,
                isValid: true
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'role']
            }]
        });

        if (!session) {
            res.clearCookie('token');
            return next();
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            await session.update({ isValid: false });
            res.clearCookie('token');
            return next();
        }

        await session.update({ lastActivity: new Date() });

        req.user = session.user;
        req.session = session;
        res.locals.user = session.user;

        next();
    } catch (error) {
        console.error('Erreur de session:', error);
        next(error);
    }
};

module.exports = session; 