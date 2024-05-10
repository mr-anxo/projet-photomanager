const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur inattendue s\'est produite' });
  };
  
  module.exports = errorMiddleware;