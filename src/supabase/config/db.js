const postgres = require('postgres') 

// Conexión con Transaction Pooler (recomendado)
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, // Necesario para Supabase
  max: 20, // Conexiones máximas en el pool
  idle_timeout: 30 // Segundos
})

module.exports = sql