require('dotenv').config();
const { User, Note } = require('../models');
const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'professeur',
        email: 'professeur@test.com',
        password: 'password123',
        role: 'professor'
    },
    {
        username: 'etudiant1',
        email: 'etudiant1@test.com',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'etudiant2',
        email: 'etudiant2@test.com',
        password: 'password123',
        role: 'user'
    }
];

const createNotes = (userIds) => [
    {
        title: 'Introduction à JavaScript',
        content: 'JavaScript est un langage de programmation qui permet d\'ajouter de l\'interactivité aux pages web. Voici les concepts de base :\n\n1. Variables et types de données\n2. Fonctions et portée\n3. Objets et tableaux\n4. Événements et DOM',
        tags: ['javascript', 'web', 'cours'],
        userId: userIds[0] // professeur
    },
    {
        title: 'Les bases de Node.js',
        content: 'Node.js est un environnement d\'exécution JavaScript côté serveur. Points importants :\n\n- Installation et configuration\n- NPM et gestion des packages\n- Création d\'un serveur HTTP\n- Gestion des fichiers',
        tags: ['nodejs', 'backend', 'javascript'],
        userId: userIds[0] // professeur
    },
    {
        title: 'Sécurité Web',
        content: 'Les bonnes pratiques de sécurité pour le développement web :\n\n1. Protection contre les injections SQL\n2. Prévention des attaques XSS\n3. Gestion sécurisée des sessions\n4. HTTPS et certificats SSL',
        tags: ['securite', 'web', 'important'],
        userId: userIds[1] // etudiant1
    },
    {
        title: 'Mes notes de cours',
        content: 'À faire :\n- Réviser JavaScript\n- Préparer le projet Node.js\n- Questions sur la sécurité\n- Exercices sur Express',
        tags: ['todo', 'cours', 'personnel'],
        userId: userIds[1] // etudiant1
    },
    {
        title: 'Projet final - Idées',
        content: 'Idées pour le projet final :\n\n1. Application de gestion de notes sécurisée\n2. Système de chat en temps réel\n3. API REST avec authentification\n4. Dashboard d\'analytics',
        tags: ['projet', 'idees', 'important'],
        userId: userIds[2] // etudiant2
    }
];

async function loadFixtures() {
    try {
        console.log('Début du chargement des fixtures...');
        
        console.log('Configuration DB:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        });

        console.log('Création des utilisateurs...');
        const createdUsers = [];
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await User.create({
                ...userData,
                password: hashedPassword
            });
            createdUsers.push(user);
            console.log(`Utilisateur créé: ${userData.email}`);
        }

        console.log('Création des notes...');
        const notes = createNotes(createdUsers.map(user => user.id));
        const createdNotes = await Note.bulkCreate(notes);
        console.log(`${createdNotes.length} notes créées`);

        console.log('\nComptes de test créés :');
        console.log('------------------------');
        for (const user of users) {
            console.log(`Email: ${user.email}`);
            console.log(`Mot de passe: ${user.password}`);
            console.log(`Rôle: ${user.role}`);
            console.log('------------------------');
        }

        console.log('Fixtures chargées avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors du chargement des fixtures:', error);
        process.exit(1);
    }
}

loadFixtures(); 