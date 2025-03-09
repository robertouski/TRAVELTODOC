// app.js
const express = require("express");
const routes = require("./src/routes");
const supabase = require("./src/supabase/config/db"); // Cliente de Supabase
const cors = require("cors");
const app = express();

app.use(express.json());
const corsOptions = {
  origin: "*", // Permite cualquier origen (cámbialo al dominio de Uchat si es posible)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
// Verificar conexión con Supabase
supabase
  .from("servicios") // Reemplaza con el nombre de tu tabla
  .select("*")
  .limit(1)
  .then(({ error }) => {
    if (error) {
      console.error("❌ Error de conexión a Supabase:", error);
      process.exit(1);
    }
    console.log("✅ Conectado a Supabase");
  });
  
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  next();
});
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
