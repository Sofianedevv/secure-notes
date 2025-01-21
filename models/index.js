const User = require('./User');
const Note = require('./Note');
const Session = require('./Session');

User.hasMany(Note, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'notes'
});

Note.belongsTo(User, { 
    foreignKey: 'userId',
    as: 'User',
    targetKey: 'id'
});

User.hasMany(Session, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'sessions'
});

Session.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

const syncModels = async () => {
    try {
        await User.sync();
        await Note.sync();
        await Session.sync();
        console.log('Modèles synchronisés avec succès');
    } catch (error) {
        console.error('Erreur lors de la synchronisation des modèles:', error);
        throw error;
    }
};

module.exports = {
    User,
    Note,
    Session,
    syncModels
}; 