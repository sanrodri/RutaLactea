// 1. Traer Express
const express = require("express");

// 2. Crear la aplicación
const app = express();

// 3. Puerto: el que nos dé Render, o 3000 en tu PC
const PORT = process.env.PORT || 3000;

// 4. Compartir la carpeta "public" (tu página)
app.use(express.static("public"));

// 5. Encender el servidor
app.listen(PORT, function () {
    console.log("Servidor funcionando en http://localhost:" + PORT);
});