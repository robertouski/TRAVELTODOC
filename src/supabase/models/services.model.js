// services.model.js
const supabase = require('../config/db');

class Services {
  // Leer todas las filas
  async getAll() {
    try {
      console.log('ENTRE A GETALL');
      const { data, error } = await supabase
        .from('servicios')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getAll:', error);
      return null;
    }
  }

  // Leer columnas específicas
  async getColumns(columns = []) {
    try {
      let { data, error } = await supabase
        .from('servicios')
        .select(columns.join(','));

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error en getColumns:', error);
      return null;
    }
  }

  // Leer con tablas relacionadas
  async getWithRelated(columns = [], relatedTables = {}) {
    try {
      const relatedQuery = Object.entries(relatedTables)
        .map(([table, fk]) => `${table}(${fk})`)
        .join(',');

      const query = `${columns.join(',')}${relatedQuery ? `,${relatedQuery}` : ''}`;

      const { data, error } = await supabase
        .from('servicios')
        .select(query);

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error en getWithRelated:', error);
      return null;
    }
  }

  // Paginación
  async getPaginated(start = 0, end = 9) {
    try {
      let { data, error } = await supabase
        .from('servicios')
        .select('*')
        .range(start, end);

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error en getPaginated:', error);
      return null;
    }
  }

  // Método personalizado para filtrar por país y servicios
  async getByCountryAndServices(country, services) {
    try {
      let { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('pais', country)
        .in('nombre_servicio', services);

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error en getByCountryAndServices:', error);
      return null;
    }
  }
}

module.exports = Services;