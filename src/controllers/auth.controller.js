const GoogleService = require('../services/google.service');
const googleService = new GoogleService();

const getAuthUrl = (req, res) => {
  try {
    const authUrl = googleService.getAuthUrl();
    console.log('Autoriza aquí:', authUrl);
    res.redirect(authUrl);
  } catch (error) {
    // ¡Asegúrate de que 'res' esté disponible aquí!
    res.status(500).json({ 
      success: false,
      error: "Error al generar la URL de autenticación: " + error.message 
    });
  }
};

module.exports = { getAuthUrl };