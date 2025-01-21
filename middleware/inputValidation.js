const { body, param, query } = require('express-validator');

const noteValidationRules = {
    create: [
        body('title')
            .trim()
            .isLength({ min: 1, max: 200 })
            .withMessage('Le titre doit contenir entre 1 et 200 caractères')
            .escape(),
        body('content')
            .trim()
            .isLength({ min: 1, max: 10000 })
            .withMessage('Le contenu doit contenir entre 1 et 10000 caractères')
            .escape()
    ],
    update: [
        param('id').isInt().withMessage('ID invalide'),
        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 200 })
            .withMessage('Le titre doit contenir entre 1 et 200 caractères')
            .escape(),
        body('content')
            .optional()
            .trim()
            .isLength({ min: 1, max: 10000 })
            .withMessage('Le contenu doit contenir entre 1 et 10000 caractères')
            .escape()
    ]
};

const userValidationRules = {
    register: [
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Email invalide'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Le mot de passe doit contenir au moins 8 caractères')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),
        body('role')
            .isIn(['user', 'professor'])
            .withMessage('Rôle invalide')
    ]
};

module.exports = {
    noteValidationRules,
    userValidationRules
}; 