require('dotenv').config(); // Cargar variables de entorno
const { OAuth2Client } = require('google-auth-library');

// Configurar cliente OAuth
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generar URL de autenticación
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar.events'],
  redirect_uri: process.env.GOOGLE_REDIRECT_URI
});

console.log('Autoriza aquí:', authUrl);