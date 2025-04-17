const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const auth = require('../middleware/auth');

// Public
router.get('/', ideaController.getIdeas);

// Auth required
router.post('/', auth, ideaController.createIdea);
router.get('/:id', auth, ideaController.getIdeaById);
router.put('/:id', auth, ideaController.updateIdea);
router.delete('/:id', auth, ideaController.deleteIdea);
router.get('/search', ideaController.searchIdeas);

router.post('/:id/upvote', auth, ideaController.upvoteIdea);
router.post('/:id/downvote', auth, ideaController.downvoteIdea);
router.post('/:id/comments', auth, ideaController.addComment);

module.exports = router;
