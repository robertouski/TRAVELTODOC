const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

class GoogleService {
  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    // Cargar tokens existentes
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
    this.scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/spreadsheets' 
    ];
  }
  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent'
    });
  }

  // Método para refrescar tokens automáticamente
  async ensureAuth() {
    if (!this.oauth2Client.credentials.access_token) {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
    }
  }

  // Google Calendar
  async createCalendarEvent(eventData) {
    await this.ensureAuth();
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  
    const endDate = new Date(eventData.startDate);
    endDate.setHours(endDate.getHours() + 1); // Duración por defecto 1 hora
  
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: eventData.titulo,
        description: eventData.descripcion,
        start: {
          dateTime: eventData.startDate.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires' // Ajustar según tu zona horaria
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires'
        }
      }
    });
  
    return event.data;
  }

  // Google Sheets
  async appendToSheet(spreadsheetId, data) {
    await this.ensureAuth();
    const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
    
    return sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [data] }
    });
  }
}

module.exports = GoogleService;