require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const corsMiddleware = require('./middleware/cors');
const path = require('path');
const sequelize = require('./config/database');
const auth = require('./middleware/auth');
const { syncModels } = require('./models');
const sanitize = require('./middleware/sanitize');
const viewHelpers = require('./utils/viewHelpers');
const https = require('https');
const fs = require('fs');
const http = require('http');
const redirectIfAuth = require('./middleware/redirectIfAuth');

const app = express();

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

// Configuration CORS sécurisée
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://votredomaine.com']  // Domaines autorisés en production
        : ['https://localhost:3000'],     // Domaine local pour le développement
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Permet l'envoi de cookies
    maxAge: 86400,     // Cache preflight pour 24h
    optionsSuccessStatus: 200
};

app.use(corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || process.env.JWT_SECRET));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Nécessaire pour nos scripts inline
            styleSrc: ["'self'", "'unsafe-inline'"], // Nécessaire pour nos styles inline
            imgSrc: ["'self'", "data:", "https:"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            fontSrc: ["'self'", "https:"],
            connectSrc: ["'self'"],
            mediaSrc: ["'none'"],
            sandbox: [
                'allow-forms',
                'allow-scripts',
                'allow-same-origin',
                'allow-popups'
            ]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    expectCt: {
        maxAge: 30,
        enforce: true
    },
    frameguard: {
        action: "deny"
    },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
}));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res.setHeader('X-Frame-Options', 'DENY');

    res.setHeader('X-XSS-Protection', '1; mode=block');

    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader('Permissions-Policy', 
        'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');

    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

    next();
});

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.helpers = viewHelpers;
    next();
});

app.use(sanitize);

app.get('/', redirectIfAuth, (req, res) => {
    res.render('index');
});

app.use('/auth', require('./routes/auth'));

app.use('/notes', require('./routes/notes'));

app.use((req, res, next) => {
    const err = new Error('Page non trouvée');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error('Erreur détaillée:', {
        message: err.message,
        stack: err.stack,
        status: err.status || 500,
        path: req.path,
        method: req.method
    });

    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).render('error', {
        error: isDevelopment ? err.message : 'Une erreur est survenue!',
        message: isDevelopment ? err.stack : 'Une erreur inattendue s\'est produite',
        isDevelopment
    });
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).render('error', {
            error: 'Non autorisé',
            message: 'Accès non autorisé'
        });
    } else {
        next(err);
    }
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');
        
        await syncModels();
        await sequelize.sync({ force: false });
        console.log('Modèles synchronisés avec la base de données');
        
        const PORT = 3000;
        
        if (process.env.NODE_ENV === 'development') {
            app.listen(PORT, () => {
                console.log(`Serveur HTTP démarré sur le port ${PORT}`);
            });
        } else {
            https.createServer(httpsOptions, app).listen(PORT, () => {
                console.log(`Serveur HTTPS démarré sur le port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
        process.exit(1);
    }
};

startServer(); 