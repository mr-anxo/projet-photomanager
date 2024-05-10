const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan')
const bodyParser = require('body-parser')



const { connectToDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données MongoDB
connectToDatabase();

const app = express();

const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/auth', authRoutes);
app.use('/photos', authMiddleware, photoRoutes);

// Middleware de gestion des erreurs
app.use(errorMiddleware);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

