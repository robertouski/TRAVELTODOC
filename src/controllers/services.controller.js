// controllers/services.controller.js
const Services = require("../supabase/models/services.model");
const services = new Services();
class ServicesController {
  // Obtener todos los servicios (con filtros)
  async getServices(req, res) {
    try {
      console.log("✅ GET /api/services recibido");
      const { country, budget } = req.query;
      let servicios;

      if (country) {
        console.log(`Filtrando por país: ${country}`);
        servicios = await services.getByCountryAndServices(country, [
          "Cirugia Bariatrica",
          "Aumento Mamario",
          "Levantamiento Mamaria",
          "Reduccion Mamaria",
        ]);
      } else {
        console.log("Obteniendo todos los servicios");
        servicios = await services.getAll();
      }

      if (budget) {
        console.log(`Filtrando por presupuesto: ${budget}`);
        servicios = servicios.filter(
          (s) => s.presupuesto_de_servicio <= budget
        );
      }

      res.json({
        success: true,
        count: servicios?.length || 0,
        servicios: servicios || [],
      });
    } catch (error) {
      console.error("❌ Error en getServices:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new ServicesController();
