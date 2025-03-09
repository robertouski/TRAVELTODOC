// controllers/services.controller.js
const Services = require('../supabase/models/services.model');
const services = new Services();
class ServicesController {
  // Obtener todos los servicios (con filtros)
  async getServices(req, res) {
  try {
    console.log("✅ GET /api/services recibido");
    const { country, budget } = req.query;
    let servicios;

    // Debug: Verificar parámetros
    console.log("Query params:", { country, budget });

    if (country) {
      console.log(`Filtrando por país: ${country}`);
      servicios = await services.getByCountryAndServices(country, [
        'Cirugia Bariatrica',
        'Aumento Mamario', 
        'Levantamiento Mamaria',
        'Reduccion Mamaria'
      ]);
    } else {
      console.log("Obteniendo todos los servicios");
      servicios = await services.getAll();
    }

    // Debug: Verificar resultados de DB
    console.log("Servicios desde DB:", servicios);

    if (budget) {
      console.log(`Filtrando por presupuesto: ${budget}`);
      servicios = servicios.filter(s => s.presupuesto_de_servicio <= budget);
    }

    // Asegurar respuesta incluso si servicios es null/undefined
    res.json({ 
      success: true,
      count: servicios?.length || 0,
      servicios: servicios || []
    });

  } catch (error) {
    console.error("❌ Error en getServices:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

  // Obtener un servicio por ID
  async getServiceById(req, res) {
    try {
      const servicio = await Services.getById(req.params.id);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear nuevo servicio
  async createService(req, res) {
    try {
      const newService = await Services.create(req.body);
      res.status(201).json(newService);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ServicesController();