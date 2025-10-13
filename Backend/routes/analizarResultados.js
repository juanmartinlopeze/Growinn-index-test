const express = require('express');
const router = express.Router();
const supabase = require('../supabase/supabase');
const categorizeResponses = require('../constants/categorizeAnswer');
const calculateScore = require('../constants/calculateScore');

// POST /api/analizar-resultados
router.post('/analizar-resultados', async (req, res) => {
  const { empresa_id } = req.body;
  if (!empresa_id) {
    return res.status(400).json({ error: 'Falta empresa_id' });
  }

  // Obtener respuestas de la empresa
  const { data: respuestas, error } = await supabase
    .from('respuestas')
    .select('questionId:pregunta_id, answer:respuesta, jerarquia')
    .eq('empresa_id', empresa_id);

  if (error) {
    return res.status(500).json({ error: 'Error obteniendo respuestas', details: error });
  }

  // Procesar respuestas
  const categorizado = categorizeResponses(respuestas || []);
  const resultados = calculateScore(categorizado);

  return res.json({ resultados });
});

module.exports = router;
