// controllers/services.controller.js
const Services = require("../supabase/models/services.model");
const services = new Services();
class ServicesController {
  // Obtener todos los servicios (con filtros)
  async getServices(req, res) {
    try {
      const { country, service, pdfType } = req.query;
      
      // Validar parámetros obligatorios
      if (!country || !service || !pdfType) {
        return res.status(400).json({
          success: false,
          error: "Parámetros faltantes: country, service, pdfType (propuesta/presupuesto)"
        });
      }
  
      // Obtener servicios filtrados
      const servicios = await services.getByCountryAndService(country, service);
  
      // Validar si existe el servicio
      if (!servicios || servicios.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Servicio no encontrado"
        });
      }
  
      // Extraer PDF según tipo
      const pdfKey = `${pdfType}_pdf`; // propuesta_de_servicio_pdf o presupuesto_pdf
      const pdfUrl = servicios[0][pdfKey];
      console.log("pdfUrl", pdfUrl);
  
      if (!pdfUrl) {
        return res.status(400).json({
          success: false,
          error: "Tipo de PDF inválido. Opciones: propuesta, presupuesto"
        });
      }
  
      // Respuesta optimizada
      res.json({
        success: true,
        pdf: pdfUrl,
        servicio: servicios[0].servicio,
        pais: servicios[0].pais
      });
  
    } catch (error) {
      console.error("❌ Error en getServices:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ServicesController();
