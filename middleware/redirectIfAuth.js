const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.path === '/notes') {
        return next();
    }

    try {
        const token = req.cookies.token;
        
        if (!token) {
            console.log('Pas de token, continuer vers la page publique');
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && req.path !== '/notes') {
                console.log('Token valide, redirection vers /notes');
                return res.redirect('/notes');
            }
            next();
        } catch (error) {
            console.log('Token invalide, suppression du cookie');
            res.clearCookie('token');
            next();
        }
    } catch (error) {
        console.error('Erreur dans redirectIfAuth:', error);
        next(error);
    }
}; 