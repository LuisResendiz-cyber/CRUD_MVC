const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {automatic} = require('../controller/controller-aut-process')

router.use(bodyParser.json())

router.get('/', automatic)





//  Manejar excepciones
router.use((req, res, next) => {
  res.status(404).json({ "rspta": "Ruta no encontrada" });
});  
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ "rspta": "Error interno" });
});

module.exports = router