// En tu controlador (ej: schedule.controller.js)
require('dotenv').config();
const GoogleService = require('../services/google.service');
const googleService = new GoogleService();

async function upsertSheetData(req, res) {
  try {
    console.log('upsertSheetData', req.body);
    const spreadsheetId  = process.env.GOOGLE_SHEET_ID; // O pasarlo por parámetro
    const result = await googleService.upsertByPhone(spreadsheetId, req.body);
    console.log('result', result);
    res.status(200).json({
      success: true,
      operation: result.operation,
      message: `Datos ${result.operation === 'update' ? 'actualizados' : 'insert'}`
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

module.exports = { upsertSheetData };