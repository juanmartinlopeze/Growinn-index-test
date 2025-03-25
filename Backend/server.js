const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const Empresa = require("./models/empresa");

const app = express();
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos sin eliminar datos existentes
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Base de datos sincronizada");

});

app.post("/empresas", async (req, res) => {
  try{
    const {empleados, jerarquia1, jerarquia2, jerarquia3, jerarquia4, areas} = req.body;
    if(!empleados || !jerarquia1 || !jerarquia2 || !jerarquia3 || !jerarquia4 || !areas){
      return res.status(400).json({error: "Faltan datos requeridos"});
    }
    const empresa = await Empresa.create({empleados, jerarquia1, jerarquia2, jerarquia3, jerarquia4, areas});
    res.status(201).json(empresa);

  }
  catch(error){
    res.status(500).json({error: "Error al crear empresa"});

  }
});

app.get("/empresas", async (req, res) => {
  try{
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  }
  catch(error){
    res.status(500).json({error: "Error al obtener empresas"});

  }
});


app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
