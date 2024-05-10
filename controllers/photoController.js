const Photo = require('../models/photo');
const User = require('../models/user');
const Comment = require('../models/comment');

// Récupérer toutes les photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().populate('author', 'username');
    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les détails d'une photo
exports.getPhotoDetails = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId)
      .populate('author', 'username')
      .populate('comments', 'text author')
      .populate('comments.author', 'username');
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une nouvelle photo
exports.createPhoto = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    const { title, description } = req.body;
    const imagePath = req.file.path;
    const newPhoto = new Photo({ title, description, imagePath, author: userId });
    await newPhoto.save();
    user.photos.push(newPhoto._id);
    await user.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour le titre d'une photo
exports.updatePhotoTitle = async (req, res) => {
  try {
    const userId = req.userId;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    if (photo.author.toString() !== userId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette photo' });
    }
    photo.title = req.body.title;
    await photo.save();
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une photo
exports.deletePhoto = async (req, res) => {
  try {
    const userId = req.userId;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    if (photo.author.toString() !== userId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cette photo' });
    }
    await Photo.findByIdAndDelete(req.params.photoId);
    const user = await User.findById(userId);
    user.photos = user.photos.filter(photoId => photoId.toString() !== req.params.photoId);
    await user.save();
    res.status(200).json({ message: 'Photo supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liker une photo
exports.likePhoto = async (req, res) => {
  try {
    const userId = req.userId;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    if (photo.likes.includes(userId)) {
      return res.status(400).json({ error: 'Vous avez déjà liké cette photo' });
    }
    photo.likes.push(userId);
    photo.dislikes = photo.dislikes.filter(id => id.toString() !== userId);
    await photo.save();
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Disliker une photo
exports.dislikePhoto = async (req, res) => {
  try {
    const userId = req.userId;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    if (photo.dislikes.includes(userId)) {
      return res.status(400).json({ error: 'Vous avez déjà disliké cette photo' });
    }
    photo.dislikes.push(userId);
    photo.likes = photo.likes.filter(id => id.toString() !== userId);
    await photo.save();
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un commentaire à une photo
exports.addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { text } = req.body;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    const newComment = new Comment({ text, author: userId, photo: photo._id });
    await newComment.save();
    photo.comments.push(newComment._id);
    await photo.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};