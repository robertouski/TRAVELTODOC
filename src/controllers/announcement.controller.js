const Services = require("../supabase/models/services.model");
const services = new Services();

class AnnouncementController {
  async getAnnouncement(req, res) {
    try {
      const { source_id } = req.query;

      // Validar parámetro obligatorio
      if (!source_id) {
        return res.status(400).json({
          success: false,
          error: "Parámetro faltante: source_id"
        });
      }

      // Obtener anuncio desde Supabase
      const announcementData = await services.getAnnouncementById(source_id);

      // Validar si existe el anuncio
      if (!announcementData || announcementData.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Anuncio no encontrado"
        });
      }

      // Extraer datos relevantes
      const anuncio = announcementData[0];
      
      // Respuesta exitosa
      res.json({
        success: true,
        servicio: anuncio.servicio,
        pais: anuncio.pais
      });

    } catch (error) {
      console.error("❌ Error en getAnnouncement:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}


module.exports = new AnnouncementController();