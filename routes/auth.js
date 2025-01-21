const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const redirectIfAuth = require('../middleware/redirectIfAuth');

router.use((req, res, next) => {
    if (req.method === 'GET') {
        return redirectIfAuth(req, res, next);
    }
    next();
});

router.get('/login', (req, res) => {
    console.log('Tentative d\'accès à la page de connexion');
    res.render('auth/login');
});

router.get('/register', (req, res) => {
    console.log('Tentative d\'accès à la page d\'inscription');
    res.render('auth/register');
});

router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['user', 'professor'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        await User.createWithPassword({ email, password, role });

        res.json({ success: true, message: 'Inscription réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        try {
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            await Session.create({
                userId: user.id,
                token,
                userAgent: req.headers['user-agent'],
                lastActivity: new Date()
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, 
                sameSite: 'strict',          
                path: '/',                   
                domain: process.env.NODE_ENV === 'production' ? 'votredomaine.com' : 'localhost'
            });

            res.json({ success: true, redirect: '/notes' });
        } catch (error) {
            console.error('Erreur lors de la création de la session:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        if (req.session) {
            await req.session.update({ isValid: false });
        }
        res.clearCookie('token');
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/sessions', auth, async (req, res) => {
    try {
        const sessions = await Session.findAll({
            where: { 
                userId: req.user.id,
                isValid: true
            },
            order: [['lastActivity', 'DESC']]
        });

        res.render('auth/sessions', { sessions });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            error: 'Erreur serveur',
            message: 'Impossible de récupérer les sessions'
        });
    }
});

router.get('/check', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ authenticated: true });
    } catch (error) {
        res.status(401).json({ authenticated: false });
    }
});

router.get('/test-token', auth, (req, res) => {
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept?.includes('application/json')) {
        res.json({
            message: 'Token valide',
            user: {
                id: req.user.userId,
                email: req.user.email,
                role: req.user.role
            },
            tokenInfo: {
                exp: req.user.exp,
                iat: req.user.iat
            }
        });
    } else {
        res.redirect('/notes');
    }
});

module.exports = router; 