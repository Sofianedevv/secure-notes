const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('title', DOMPurify.sanitize(value));
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        set(value) {
            this.setDataValue('content', DOMPurify.sanitize(value));
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const value = this.getDataValue('tags');
            return value ? value : [];
        }
    }
}, {
    tableName: 'Notes',
    timestamps: true
});

module.exports = Note; 