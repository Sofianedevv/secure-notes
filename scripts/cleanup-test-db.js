const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanupTestDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root'
        });

        // Supprime la base de données de test
        await connection.query(`DROP DATABASE IF EXISTS secure_notes_test`);
        
        console.log('Base de données de test supprimée avec succès');
        await connection.end();
    } catch (error) {
        console.error('Erreur lors de la suppression de la base de données de test:', error);
        process.exit(1);
    }
}

cleanupTestDatabase(); 