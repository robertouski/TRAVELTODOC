require('dotenv').config();
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
    endDate.setHours(endDate.getHours() + 1); 
  
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: eventData.titulo,
        description: eventData.descripcion,
        start: {
          dateTime: eventData.startDate.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires' 
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
    console.log('Appending to sheet:', spreadsheetId, data);
    return sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [data] }
    });
  }
  async upsertByPhone(spreadsheetId, data) {
    await this.ensureAuth();
    const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
  
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:Z',
    });
  
    const rows = response.data.values || [];
    console.log('Rows:', rows);
  
    const headers = rows[0].map((header) => header.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase());
    console.log('Headers:', headers);
    const phoneColumnIndex = headers.indexOf('telefono');
    console.log('Phone Column Index:', phoneColumnIndex);
  
    if (phoneColumnIndex === -1) {
      throw new Error('Columna "Telefono" no encontrada en el sheet');
    }
  
    const targetPhone = data.telefonoLead.toString().replace(/[^\d]/g, '');
    console.log('Target Phone:', targetPhone);
  
    const rowIndex = rows.findIndex((row, index) => index > 0 && row[phoneColumnIndex].toString().replace(/[^0-9+]/g, '') === targetPhone.replace(/[^0-9+]/g, ''));
    console.log("rowIndex", rowIndex)
    const rowData = [
      new Date().toISOString(),
      data.fechaHora,
      data.cirugiaSeleccionada || '',
      data.fuente || 'No Meta',
      data.nombreLead,
      data.emailLead,
      targetPhone,
      data.etapaFunnel
    ];
  
    if (rowIndex !== -1) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `A${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] }
      });
      return { operation: 'update', row: rowIndex + 1 };
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] }
      });
      return { operation: 'insert' };
    }
  }
}

module.exports = GoogleService;