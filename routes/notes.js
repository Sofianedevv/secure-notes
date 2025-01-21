const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { User, Note } = require('../models');
const { body, validationResult } = require('express-validator');
const viewHelpers = require('../utils/viewHelpers');
const { noteValidationRules } = require('../middleware/inputValidation');

router.use(auth);

router.get('/all', [auth, checkRole(['professor'])], async (req, res) => {
    console.log('Accès à la route /notes/all');
    console.log('Utilisateur:', req.user);
    
    try {
        const notes = await Note.findAll({
            include: [{
                model: User,
                as: 'User',
                attributes: ['email']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        console.log('Notes trouvées:', notes.length);
        res.render('notes/all', { notes, helpers: viewHelpers });
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        res.status(500).render('error', { 
            error: 'Erreur serveur',
            message: 'Impossible de récupérer les notes'
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.findAll({
            where: { userId: req.user.userId },
            attributes: ['id', 'title', 'content', 'tags', 'createdAt', 'updatedAt']
        });
        res.render('notes/list', { notes, helpers: viewHelpers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/', [
    auth, 
    checkRole(['user', 'professor']),
    ...noteValidationRules.create
], async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const note = await Note.create({
            title,
            content,
            userId: req.user.userId
        });

        res.json({ success: true, noteId: note.id });
    } catch (error) {
        console.error('Erreur lors de la création de la note:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.put('/:id', [
    auth, 
    checkRole(['user', 'professor']),
    ...noteValidationRules.update
], async (req, res) => {
    try {
        const note = await Note.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.userId 
            }
        });

        if (!note) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }

        await note.update(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/:id', [auth, checkRole(['user', 'professor'])], async (req, res) => {
    try {
        const note = await Note.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.userId 
            }
        });

        if (!note) {
            return res.status(404).json({ 
                message: 'Note non trouvée ou vous n\'avez pas les droits pour la supprimer' 
            });
        }

        await note.destroy();
        res.json({ 
            success: true, 
            message: 'Note supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la suppression de la note' 
        });
    }
});

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.userId
            }
        });

        if (!note) {
            return res.status(404).render('error', {
                error: 'Note non trouvée',
                message: 'La note demandée n\'existe pas ou vous n\'avez pas les droits pour y accéder'
            });
        }

        res.render('notes/edit', { note });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            error: 'Erreur serveur',
            message: 'Impossible de récupérer la note'
        });
    }
});

router.get('/create', auth, (req, res) => {
    res.render('notes/create');
});

router.post('/:id/tags', auth, async (req, res) => {
    try {
        const note = await Note.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.userId 
            }
        });

        if (!note) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }

        const { tag } = req.body;
        const currentTags = note.tags || [];
        
        if (!currentTags.includes(tag)) {
            await note.update({
                tags: [...currentTags, tag]
            });
        }

        res.json({ success: true, tags: note.tags });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/:id/tags/:tag', auth, async (req, res) => {
    try {
        const note = await Note.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.userId 
            }
        });

        if (!note) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }

        const tagToRemove = decodeURIComponent(req.params.tag);
        const currentTags = note.tags || [];
        
        await note.update({
            tags: currentTags.filter(tag => tag !== tagToRemove)
        });

        res.json({ success: true, tags: note.tags });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router; 