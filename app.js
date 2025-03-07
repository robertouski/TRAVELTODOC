const express = require('express')
const routes = require('./src/routes')
const sql = require('./src/supabase/config/db') // Importa la conexión

const app = express()
app.use(express.json())

// Verificar conexión al iniciar
sql`SELECT 1`
  .then(() => console.log('✅ Base de datos conectada'))
  .catch(error => {
    console.error('❌ Error de conexión a DB:', error)
    process.exit(1)
  })

app.use('/api', routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})