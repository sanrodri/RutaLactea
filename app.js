// 1. dotenv: lee el archivo .env y guarda sus datos (como la contraseña de la base) en process.env, para no escribirlos en el código
require("dotenv").config();

// 2. Traer los paquetes
const express = require("express"); // servidor web
const { Pool } = require("pg");     // conexión con PostgreSQL (Neon)

// 3. Crear la aplicación
const app = express();

// 4. Configuración
app.use(express.json());              // permite leer los datos que llegan en formato JSON (reemplaza a body-parser)
app.use(express.static("public"));    // compartir la carpeta "public" (tu página)

// 5. Conexión a la base de datos (Neon)
// Pool = varias conexiones listas para usar; no se cierran después de cada consulta
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // la cadena está en .env (en Render se pone en sus variables)
    ssl: { rejectUnauthorized: false }
});

// 6. Rutas
// Ver todas las entregas guardadas: http://localhost:3000/api/entregas
app.get("/api/entregas", async function (req, res) {
    try {
        const resultado = await pool.query("SELECT * FROM entregas_ruta");
        res.json(resultado.rows); // envía las filas al navegador
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "No se pudo leer la base de datos" });
    }
});


// Guardar una entrega nueva (la llama el botón "Registrar entrega")
app.post("/api/entregas", async function (req, res) {
    try {
        // 1. Sacar los datos que mandó la página
        const { cliente, ruta, litros, precio, fecha } = req.body;

        // 2. Calcular el total aquí, en el servidor ( es mejor no confiarse  en el que manda la página)
        const total = litros * precio;

        // 3. Guardar en la base. $1, $2... son espacios que pg llena con los datos de forma segura
        const resultado = await pool.query(
            "INSERT INTO entregas_ruta (cliente, ruta, litros, precio, fecha, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [cliente, ruta, litros, precio, fecha, total]
        );

        // 4. Responder a la página con la fila guardada
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "No se pudo guardar la entrega" });
    }
});


// 7. Puerto: el que nos dé Render, o 3000 en tu PC
const PORT = process.env.PORT || 3000;

// 8. Encender el servidor (siempre al final)
app.listen(PORT, function () {
    console.log("Servidor funcionando en http://localhost:" + PORT);
});
