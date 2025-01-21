const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            if (req.xhr || req.path.startsWith('/api/') || req.get('accept')?.includes('application/json')) {
                return res.status(401).json({ message: 'Non authentifié' });
            }
            return res.redirect('/auth/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.exp < Date.now() / 1000) {
            if (req.xhr || req.path.startsWith('/api/')) {
                return res.status(401).json({ message: 'Token expiré' });
            }
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }
        
        req.user = decoded;
        
        res.locals.user = decoded;
        
        next();
    } catch (error) {
        if (req.xhr || req.path.startsWith('/api/') || req.get('accept')?.includes('application/json')) {
            return res.status(401).json({ message: 'Session invalide' });
        }
        res.redirect('/auth/login');
    }
}; 