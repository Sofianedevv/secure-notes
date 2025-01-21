const cookieConfig = {
    httpOnly: true,          // Empêche l'accès aux cookies via JavaScript
    secure: process.env.NODE_ENV === 'production', // Cookies uniquement en HTTPS en production
    sameSite: 'strict',      // Protection contre les attaques CSRF
    maxAge: 24 * 60 * 60 * 1000, // Expiration après 24 heures
    path: '/',               // Cookie disponible sur tout le site
    domain: process.env.DOMAIN || undefined, // Domaine du cookie
    signed: true,            // Signe les cookies pour détecter les modifications
};

module.exports = cookieConfig; 