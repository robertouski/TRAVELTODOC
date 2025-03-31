http://localhost:3000/auth/callback?code=4/0AQSTgQGAC-tPBbvlvlrCTqDlnnr5Efm5maY-QjRivWPju30qhh2jnRRQcK_8lIm_yAyurw&scope=https://www.googleapis.com/auth/spreadsheets%20https://www.googleapis.com/auth/calendar.events// get-tokens.js
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Usa el código recibido en la URL
const code = 'code=4/0AQSTgQFTBJ-8kz-IMTMl7pFrUVUNJq-4PuzzzDt913LOhGMUAGV7az51LiUCfcGVc9oLPg';

async function getTokens() {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens obtenidos:', tokens);
    console.log('Refresh Token:', tokens.refresh_token); // ¡Guarda este valor en .env!
  } catch (error) {
    console.error('Error al obtener tokens:', error.message);
  }
}

getTokens();