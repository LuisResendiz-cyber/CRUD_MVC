const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {actGral,oraProcedure} = require("../controller/controller-gral")
const { actMail } = require('../controller/controller-doppler')
const { autReports } = require('../controller/controller-aut-reports')
const { autRfc } = require('../controller/controller-aut-rfc')
const actions= require('../controller/controller-impulse')
// const { repCortoCPC } = require('../controller/controller_rep_corto_cpc')
// const { repCortoCLI } = require('../controller/controller_rep_corto_cli')
const { reporteCorto } = require('../controller/controller-reporte-corto')
const { reporteKpis } = require('../controller/controller-reporte-kpis')
const { actSms } = require('../controller/controller-sms')
const check = require('../controller/controller-check')
const uploads = require('../controller/controller-multer') 
const {sendMailSmtp}= require('../controller/controller-mailer')
const { reporteCortoSofom } = require('../controller/controller-reporte-corto-sofom')
const {digital,bau} = require('../controller/controller-digital')

const ENVIRONMENT = process.env.NODE_ENV || "development";
// console.log(ENVIRONMENT)
if (ENVIRONMENT === "development") {
  console.log("Developer mode");
  router.use((req, res, next) => {
    let horaEjecucion = new Date().toLocaleString(); // Mover la declaración aquí
    console.log(
      `DEV => Tipo: ${req.method} Ruta: ${req.url} IP: ${req.ip} Hora: ${horaEjecucion}`
    );
    console.log("Parameters:", req.body);

    console.log("_".repeat(50));
    const memoryUsage = process.memoryUsage();
    console.log("\x1b[31m%s\x1b[0m", `Uso de memoria:`);

    console.log({
      rss: memoryUsage.rss / 1024 / 1024 + " MB", //Memoria total asignada al proceso.
      heapTotal: memoryUsage.heapTotal / 1024 / 1024 + " MB", //Memoria total del heap
      heapUsed: memoryUsage.heapUsed / 1024 / 1024 + " MB", //Memoria V8 realmente usada.
      external: memoryUsage.external / 1024 / 1024 + " MB", //Memoria usada por buffers fuera de V8
    });
    console.log("_".repeat(50));

    next();
  });

  router.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
      let horaEjecucion = new Date().toLocaleString(); // Mover la declaración aquí
      console.log(`Hora: ${horaEjecucion}`)
      console.log("Respuesta enviada:", body);
      console.log("_".repeat(50));
      return originalJson.call(this, body);
    };
    
    next();
  });
}

router.use(bodyParser.json())

router.get('/testApi', actGral.testApi)
router.get('/testConnMysql', actGral.testConnMysql)
/**Probar conn produccion no quitar!! */
router.post('/testOraProcedure',oraProcedure.testProcedure)
router.post('/testOraQuery',oraProcedure.testQuery)
 
/**------------------------------------------------------------- */

router.get('/testEmail', actMail.testEmailSend)

router.post('/uploadTemplateEmailMailing',uploads.html.single('layout'),actMail.upLayout) //subir html a la api
router.post('/createTemplateEmailMailing',check.validarTemplateMail, actMail.createTemplate) //crear template en doppler
router.post('/uploadCsv',uploads.csv.single('data'),actMail.upCsv) //subir base de correos a enviar
router.post('/checkEmailRecipients',actMail.checkEmailRecipients) //subir base de correos a enviar
router.post('/SendMailing',actMail.sendMailing) //envio masivo



router.post('/sendEmailMassTess',check.checkSendMailTemplate,actMail.sendMaillMass)

router.get('/sendMail',check.checkSendMail,actMail.sendMail)




// *Rutas para mandar sms voices
router.post('/testSms',check.validarSms, actSms.test)
router.post('/sendSms', check.validarSms, actSms.sendSms)
router.get('/sendSmsMasivoDigital',actSms.sendSmsMasivoDigital) //! LA EJECUTA UN CRON
router.get('/sendSmsMasivoScotiabank',check.smsScotia,actSms.sendSmsMasivoScotiabank) //! LA EJECUTA UN CRON
router.get('/assistanceImpulse',autReports.repAsistencia)  //! LA EJECUTA UN CRON



//* --------------------SMS/EMAIL HSBC MASIVOS-------------------------------------------------
router.get('/sendSmsMasivoHsbc',actSms.sendSmsMasivoHsbc)
router.get('/sendEmailMasivoHsbc',actMail.massEmailHsbc)
//* --------------------SMS/EMAIL HSBC MASIVOS-------------------------------------------------

//! Esta ruta es para descargar un reporte de asistencia
router.get('/downloadAssistance',actMail.downloadRepAsistencia)   




//* --------------------REPORTE COTO CITIBANCO-------------------------------------------------
//router.post('/reporteCortoCitiCNC',repCortoCNC.reporteCortoCitiCNC)
// router.post('/reporteCortoCitiCPC',repCortoCPC.reporteCortoCitiCPC)
// router.post('/reporteCortoCitiCLI',repCortoCLI.reporteCortoCitiCLI)
router.post('/reporteCortoCitiBanco',reporteCorto.reporteCortoCitiBanco) // todos los productos
router.post('/reporteKpisCitiBanco',reporteKpis.reporteKpisCitiBanco) // todos los productos
//* --------------------REPORTE COTO CITIBANCO-------------------------------------------------

//  --------------------REPORTE COTO CITISOFOM-------------------------------------------------
router.post('/reporteCortoCitiSofom',reporteCortoSofom.reporteCortoCitiSofom) // por centro
//  --------------------REPORTE COTO CITISOFOM-------------------------------------------------

//* --------------------ENVIO CORREO AUTO-------------------------------------------------
router.post('/sendMailDigital',check.checkSendMail,sendMailSmtp.sendMailDigital)
//* --------------------ENVIO CORREO AUTO-------------------------------------------------

//* --------------------MAPA CALOR CITIBANCO-------------------------------------------------
router.post('/mapaCalorCitibanco',autReports.repMapaCalorCitibanco)  //! LA EJECUTA UN CRON
router.get('/downloadMapaCalorCitibanco',autReports.downloadMapaCalorCitibanco)  //! LA EJECUTA UN CRON

/* GENERAR RFC*/
router.get('/generaRfc',check.validarDataRfc,autRfc.generaRfc)

//* --------------------Conteo registros digital carga automatica-------------------------------------------------
router.post('/conteoLeadsDigital', digital.conteoLeadsAut)

//* --------------------Envio de asistencia para amex digital-------------------------------------------------
router.post('/asistenciaDigital', digital.asistencia)
//* --------------------Envio de asistencia para amex bau-------------------------------------------------
router.post('/asistenciaBau', bau.asistencia)


//* --------------------Obtener asistencia desde web-------------------------------------------------
router.post('/getAsistenciaImpulse', actions.asistencia)

//* --------------------ENVIAR CORREOS DE RETARDOS-------------------------------------------------
router.get('/sendEmailRetardos',actMail.EmailRetardos)


//-------------------GET PROVEDORES--------------------------------
router.get('/getProvedores',actSms.ProveedoresSms)

router.get('/sendEmailRetardos',actMail.EmailRetardos)





//  // Manejar excepciones
// router.use((req, res, next) => {
//   res.status(404).json({ "rspta": "Ruta no encontrada" });
// });  
// router.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ "rspta": "Error interno" });
// });

module.exports = router
