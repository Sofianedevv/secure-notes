const checkRole = (roles) => {
    return (req, res, next) => {
        console.log('Vérification des rôles :', {
            userRole: req.user?.role,
            requiredRoles: roles,
            user: req.user
        });

        if (!req.user) {
            console.log('Utilisateur non authentifié');
            return res.status(401).redirect('/auth/login');
        }

        if (!roles.includes(req.user.role)) {
            console.log('Rôle non autorisé');
            return res.status(403).render('error', {
                error: 'Accès non autorisé',
                message: 'Vous n\'avez pas les droits nécessaires pour accéder à cette page'
            });
        }

        console.log('Accès autorisé');
        next();
    };
};

module.exports = checkRole; 