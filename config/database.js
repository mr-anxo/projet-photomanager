const mongoose = require('mongoose');

// Fonction pour se connecter à la base de données
const connectToDatabase = async () => {

 // URL de connexion MongoDB
mongoose.connect('mongodb://localhost:27017/gestionPhoto')
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Connexion à la base de données établie!')
})
};

// Fonction pour déconnecter de la base de données
const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Failed to disconnect from MongoDB', err);
    process.exit(1);
  }
};

module.exports = { connectToDatabase, disconnectFromDatabase };