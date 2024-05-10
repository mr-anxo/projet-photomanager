const express = require('express');
const router = express.Router();

const photoController = require('../controllers/photoController');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/auth');

// Route pour récupérer toutes les photos
router.get('/', photoController.getAllPhotos);

// Route pour récupérer les détails d'une photo
router.get('/:photoId', photoController.getPhotoDetails);

// Route pour ajouter une nouvelle photo
router.post('/', authMiddleware, upload.single('image'), photoController.createPhoto);

// Route pour mettre à jour le titre d'une photo
router.put('/:photoId', authMiddleware, photoController.updatePhotoTitle);

// Route pour supprimer une photo
router.delete('/:photoId', authMiddleware, photoController.deletePhoto);

// Route pour liker une photo
router.put('/:photoId/like', authMiddleware, photoController.likePhoto);

// Route pour disliker une photo
router.put('/:photoId/dislike', authMiddleware, photoController.dislikePhoto);

// Route pour commenter une photo
router.post('/:photoId/comments', authMiddleware, photoController.addComment);

module.exports = router;