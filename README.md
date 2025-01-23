# SecureNotes Platform

Une application web de gestion de notes sécurisée construite avec Node.js et Express, mettant l'accent sur la sécurité et l'expérience utilisateur.

## 🚀 Caractéristiques

- Authentification JWT sécurisée et session
- Système de rôles (étudiants/professeurs)
- Gestion des notes avec tags et recherche
- Protection contre les attaques XSS et CSRF
- Sauvegarde automatique des brouillons
- support CORS

## 🛠️ Technologies

- Node.js & Express
- MySQL & Sequelize
- JWT & Bcrypt
- EJS Templates
- CSS moderne

## 🔒 Sécurité

Implémente les meilleures pratiques de sécurité web incluant le chiffrement des mots de passe, la protection contre les injections SQL et la validation des entrées.




2. Cloner le projet
git clone https://github.com/your-username/secure-notes-platform.git
cd secure-notes-platform
npm install
npm start


3. Configurer l'environnement
Créer un fichier `.env` à la racine du projet :

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=secure_notes
JWT_SECRET=votre_secret_jwt_securise
SSL_KEY_PATH=ssl/key.pem
SSL_CERT_PATH=ssl/cert.pem


4. Générer les certificats SSL pour le développement

mkdir ssl
cd ssl
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes


5. Initialiser la base de données

npm run fixtures
L'application sera accessible à l'adresse : `https://localhost:3000`

## Comptes de test
- Professeur : professeur@test.com / password123
- Étudiant : etudiant1@test.com / password123

## Structure du projet

- `server.js` : Point d'entrée de l'application
- `routes/` : Routes de l'application
- `models/` : Modèles Sequelize
- `views/` : Templates EJS
- `public/` : Fichiers statiques
- `middleware/` : Middleware d'authentification et de gestion des sessions
- `config/` : Configuration de l'application
- `utils/` : Fonctions utilitaires

secure-notes-platform/
├── config/ # Configuration (DB, cookies...)
├── middleware/ # Middlewares Express
├── models/ # Modèles Sequelize
├── public/ # Fichiers statiques
│ ├── css/ # Styles
│ └── js/ # Scripts client
├── routes/ # Routes Express
├── ssl/ # Certificats SSL
├── utils/ # Utilitaires
└── views/ # Templates EJS


## Sécurité
- Authentification JWT
- Protection CSRF
- Sanitization des entrées
- Validation des données
- Sessions sécurisées
- Cookies HttpOnly
- Protection XSS
- HTTPS
- CORS

## Technologies utilisées
- Backend : Node.js, Express
- Base de données : MySQL, Sequelize
- Frontend : JavaScript, EJS
- Sécurité : JWT, bcrypt
- Style : CSS personnalisé

## Fonctionnalités de sécurité
- Tokens JWT pour l'authentification
- Hachage des mots de passe avec bcrypt
- Protection contre les injections SQL
- Validation et sanitization des entrées
- Sessions sécurisées avec expiration
- Protection CSRF
- En-têtes de sécurité HTTP



## Auteur
Sofiane Chadili