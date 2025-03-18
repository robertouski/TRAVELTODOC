const GoogleService = require('../services/google.service');
const googleService = new GoogleService();
const calendarController = {
  createEvent: async (req, res) => {
    try {
      const nowDate = new Date().toISOString();
      const {
        fechaHora,   
        titulo,   
        descripcion,    // Fecha de creación del lead (puede venir del front)
        cirugiaSeleccionada,  // Valor de la cirugía seleccionada
        fuente,               // 'Meta' o 'No Meta'
        nombreLead,           // Nombre del lead
        emailLead,            // Email del lead
        etapaFunnel           // Etapa actual del funnel
      } = req.body;
      
      const [fecha, hora] = fechaHora.split('T');
      const rowData = [
        nowDate, // Si no viene fecha, usamos actual
        fechaHora,               // Fecha última actualización (ahora)
        cirugiaSeleccionada || '',              // Cirugía puede ser opcional
        fuente || 'No Meta',                   // Default a 'No Meta'
        nombreLead,
        emailLead,
        etapaFunnel
      ];
      // Validación
      if (!fechaHora || !titulo || !nombreLead || !emailLead) {
        return res.status(400).json({ error: "Datos incompletos" });
      }
      const startDate = new Date(fechaHora);
      if (isNaN(startDate)) {
        return res.status(400).json({ error: "Formato de fecha inválido" });
      }

      // Crear evento en Calendar
      const event = await googleService.createCalendarEvent({
        startDate,
        titulo,
        descripcion: descripcion || ''
      });
      console.log('Evento creado:', event);
      
      // Registrar en Sheets
      const sheetResponse = await googleService.appendToSheet(
        process.env.GOOGLE_SHEET_ID,
        rowData
      );
      console.log('Evento registrado en Sheets',sheetResponse );
      res.json({
        success: true,
        event: {
          id: event.id,
          link: event.htmlLink,
          fechaHora,
          titulo
        }
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = calendarController;