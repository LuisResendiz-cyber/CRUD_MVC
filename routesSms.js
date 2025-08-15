const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {actSms} = require('../controller/controller-sms')


router.use(bodyParser.json())

router.get('/bulk-sms-banamex-seguros', actSms.bulkbanamexSeguros)





//  Manejar excepciones
router.use((req, res, next) => {
  res.status(404).json({ "rspta": "Ruta no encontrada" });
});  
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ "rspta": "Error interno" });
});

module.exports = router