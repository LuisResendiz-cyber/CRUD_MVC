const { default: axios } = require("axios");
const dopplerData = require("../config/dopplerConfig.json");
const correosJson = require("../public/json/correos.json");
const actMailer = require("../model/model-mailer");
const { actionsMysql } = require("../model/model-mysql");

const path = require("path");
const csv = require("csv-parser");
const fs = require("fs");
const {
  oraExcProc,
  oraExcProcNoCursor,
  createConnObj,
  oraExcProc2,
} = require("../model/model-oracle");
const { throwErr } = require("oracledb/lib/errors");

const actMail = {
  testCredenciales: async (req, res) => {
    try {
      const rspta = await axios.get(dopplerData.liga);
      console.log(rspta);
      res.json(rspta.status);
    } catch (error) {
      console.log("Error --", error);
      res.send(error);
    }
  },
  testEmailSend: async (req, res) => {
    try {
      const htmlPath = path.join(__dirname, "../public/html/layout.html");
      let htmlContent = undefined;
      try {
        htmlContent = fs.readFileSync(htmlPath, "utf-8");
        dopplerData.config.html = htmlContent;
        for (let i = 0; i < 1; i++) {
          const response = await axios.post(
            dopplerData.endPointSendMail,
            dopplerData.config,
            {
              params: { api_key: dopplerData.apikey },
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log("Rspta Doppler ---- ", response.status);
        }

        // res.json({ rspta: response.status });
        res.json({ rspta: "Correos enviados" });

        // res.json('Prueba')
      } catch (error) {
        console.log();
        res.send("Error al leer archivo", error);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },
  upLayout: async (req, res) => {
    res.json({ rspta: "Archivo subido con exito" });
  },
  upCsv: async (req, res) => {
    const csvData = req.file;

    if (!csvData) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ningún archivo CSV" });
    }

    const csvFilePath = csvData.path;
    const jsonData = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        jsonData.push(row);
      })
      .on("end", () => {

        const jsonFilePath = "src/public/json/correos.json";

        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error("Error al escribir el archivo JSON:", err);
          } else {
            console.log("Archivo JSON creado exitosamente");
            const porcionEmail = jsonData.slice(0, 2);
            res.json({ rspta: "Correos cargados correctamente", details: porcionEmail });
          }
        });

        fs.unlink(csvFilePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo CSV:", err);
          } else {
            console.log("Archivo CSV eliminado exitosamente");
          }
        });
      })
      .on("error", (err) => {
        console.error("Error al procesar el archivo CSV:", err);
        res.status(500).json({ error: "Error al procesar el archivo CSV" });
      });
  },
  sendMailing: async (req, res) => {

    const { idTemplate } = req.body;

    const url = dopplerData.urlSendMailTemplate + idTemplate + "/message";
    try {
      let countMail = 0;
      for (const destinatario of correosJson) {
        const { CORREO_ELECTRONICO, NOMBRE_ASEGURADO } = destinatario;

        dopplerData.sendMailTemplate.recipients[0].email =
          CORREO_ELECTRONICO.trim();
        // dopplerData.sendMailTemplate.recipients[0].name = NOMBRE_ASEGURADO;

        try {
          await axios.post(url, dopplerData.sendMailTemplate, {
            params: { api_key: dopplerData.apikey },
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.log(`Error con el correo ${CORREO_ELECTRONICO}`);
        }
        countMail++;

        console.log(`Correos enviados: ${countMail}`);
      }

      res.json({
        rspta: "Success",
        mensaje: "Correos enviados exitosamente",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  createTemplate: async (req, res) => {
    const {
      nombrePlantilla,
      correoRemitente,
      nombreRemitente,
      asunto,
      contenidoPlantilla,
    } = req.body;

    try {
      const htmlPath = path.join(
        __dirname,
        `../public/html/${contenidoPlantilla}`
      );
      let htmlContent = undefined;
      htmlContent = fs.readFileSync(htmlPath, "utf-8");

      dopplerData.createTemplate.from_name = nombreRemitente;
      dopplerData.createTemplate.from_email = correoRemitente;
      dopplerData.createTemplate.name = nombrePlantilla;
      dopplerData.createTemplate.subject = asunto;
      dopplerData.createTemplate.body = htmlContent;

      const response = await axios.post(
        dopplerData.urlCreateTemplate,
        dopplerData.createTemplate,
        {
          params: { api_key: dopplerData.apikey },
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Rspta Doppler ---- ", response.status);

      //EDITAR EL IDTEMPLATE PARA QUE SEA DINAMICO
      dopplerData.idTemplateMailing = response.data.createdResourceId;
      fs.writeFileSync(
        "src/config/dopplerConfig.json",
        JSON.stringify(dopplerData, null, 2)
      );

      res.json({
        rspta: response.status,
        idPlantilla: response.data.createdResourceId,
        mensaje: response.data.message,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },
  sendMaillMass: async (req, res) => {
    const { correoRemitente, idTemplate, nombreRemitente } = req.body;

    const url = dopplerData.urlSendMailTemplate + idTemplate + "/message";

    dopplerData.sendMailTemplate.recipients[0].email = correoRemitente;
    dopplerData.sendMailTemplate.recipients[0].name = nombreRemitente;

    try {
      const response = await axios.post(url, dopplerData.sendMailTemplate, {
        params: { api_key: dopplerData.apikey },
        headers: { "Content-Type": "application/json" },
      });
      console.log("Rspta Doppler ---- ", response.status);

      res.json({
        rspta: response.status,
        idPlantilla: response.data.createdResourceId,
        mensaje: response.data.message,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },
  sendMail: async (req, res) => {
    const { email, subject, content } = req.body;
    try {
      const mailOptions = {
        to: email,
        subject: `${subject}`,
        html: content,
      };
      let nObjMailer = await actMailer.createObjMailer(mailOptions);
      if (nObjMailer == 200) {
        await actionsMysql.saveLogCron(subject, 1);

        res.json({ status: 200, rspta: "MAILS SENT" });
      } else {
        await actionsMysql.saveLogCron(subject, 0);
        res.send("Error al enviar correo");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  checkEmailRecipients: async (req, res) => {
    // console.log(correosJson)
    const emailsCorto = correosJson.slice(0, 2);
    res.json({ rspta: `Total de correos cargados ${correosJson.length}`, details: emailsCorto })

  },
  repAsistencia: async (req, res) => {
    const opcion = 2;
    const campaign = 0;
    const nameProcedure = "SPS_ASISTENCIA";
    let parameters = { option: opcion };
    objConnOracle = await createConnObj(campaign, nameProcedure, parameters);

    if (objConnOracle == null || objConnOracle == undefined) {
      console.log("NO CREDENTIALS FOR THIS CAMPAIGN");
      res.json({ status: 402, rspta: "NO CREDENTIALS FOR THIS CAMPAIGN" });
    } else {
      try {
        const oraRspta = await oraExcProc2(objConnOracle);

        if (oraRspta.length == 0) {
          console.log("NO DATA IN ORACLE");
          res.json({ status: 402, rspta: "NO DATA IN ORACLE" });
        } else {
          const filePath = path.join(__dirname, "../public/csv/asistencia.csv");
          // const filePath = 'asistencia.csv'
          const csvData =
            Object.keys(oraRspta[0]).join(",") +
            "\n" +
            oraRspta.map((obj) => Object.values(obj).join(",")).join("\n");

          const writeFileAsync = async () => {
            try {
              await fs.promises.writeFile(filePath, csvData);
              console.log(
                "El archivo CSV ha sido creado exitosamente:",
                filePath
              );

              const csvContent = fs.readFileSync(filePath, "utf-8");

              const sendMail = await senMailAsistencia(csvContent);
              // console.log(sendMail)
              return sendMail;
            } catch (err) {
              console.error("Error al escribir el archivo:", err);
            }
          };

          // Llamar a la función asíncrona para escribir el archivo CSV
          const asistencia = await writeFileAsync();
          console.log(asistencia);
          res.send(asistencia);
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  downloadRepAsistencia: (req, res) => {
    const filePath = path.join(__dirname, "../public/csv/asistencia.csv");

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo CSV:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      // Establece las cabeceras para la descarga del archivo
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=asistencia.csv"
      );

      // Envía el contenido del archivo CSV como respuesta HTTP
      res.send(data);
    });
  },
  massEmailHsbc: async (req, res) => {
    const campaign = 998;
    const nameProcedure = "XSP_GET_SMS_EMAIL";

    const url = `${dopplerData.urlSendMailTemplate}de7326ea-523f-402f-972b-62eb710dcb4b/message`;
    objConnOracle = await createConnObj(campaign, nameProcedure);

    try {
      const objConnOracle = await createConnObj(campaign, nameProcedure);

      if (!objConnOracle) {
        console.log("NO CREDENTIALS FOR THIS CAMPAIGN");
        return res.status(402).json({ rspta: "NO CREDENTIALS FOR THIS CAMPAIGN" });
      }

      const msjMasivos = await oraExcProc(objConnOracle);

      if (!msjMasivos.length) {
        return res.json({
          rspta: "Error",
          mensaje: "Sin correos para envio masivo"
        });
      }

      const emails = msjMasivos
        .map((subArray) => subArray[5])
        .filter((email) => email !== "NO_EMAIL");

      let countMail = 0;

      for (const email of emails) {
        const trimmedEmail = email.trim();
        dopplerData.sendMailTemplate.recipients[0].email = trimmedEmail;
        dopplerData.sendMailTemplate.from_name = 'HSBC_PRUEBA_5';
        dopplerData.sendMailTemplate.from_email = 'reportes@impulse-telecom.com';

        try {
          await axios.post(url, dopplerData.sendMailTemplate, {
            params: { api_key: dopplerData.apikey },
            headers: { "Content-Type": "application/json" },
          });
          countMail++;
        } catch (error) {
          console.log(`Error con el correo ${trimmedEmail}: ${error.message}`);
        }
      }

      res.json({
        rspta: "Success",
        mensaje: "Correos enviados exitosamente",
        total: countMail,
      });

    } catch (error) {
      console.log("Error en massEmailHsbc:", error);
      res.status(500).json({ rspta: "Error", mensaje: "Error interno del servidor" });
    }
  },

  EmailRetardos: async (req, res) => {
    const { procedure, subject } = req.body;
    const campaign = 1;
    const nameProcedure = procedure;
    const objConnOracle = await createConnObj(campaign, nameProcedure);

    try {
      // Mando a mi base a traer los correos
      const email_base = await oraExcProc(objConnOracle);

      if (!objConnOracle) {
        console.log("NO CREDENTIALS FOR THIS CAMPAIGN");
        return res.status(402).json({ rspta: "NO CREDENTIALS FOR THIS CAMPAIGN" });
      }

      if (!email_base.length) {
        return res.json({
          rspta: "Error",
          mensaje: "Sin correos para envio masivo"
        });
      }

      const hoy = new Date();
      const dia = String(hoy.getDate()).padStart(2, '0');
      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
      const anio = hoy.getFullYear();
      const fechaActual = `${dia}/${mes}/${anio}`;


      // ACCEDE A LOS DATOS DEL CORREO PARA ENVIAR
      const datosToSend = email_base.map((subArray) => ({
        NOMINA_USUARIO: subArray[0],
        NOMBRE_USUARIO: subArray[1],
        CENTRO: subArray[2],
        CORREO_USUARIO: subArray[3],
        NOMBRE_JDIRECTO: subArray[5],
        CORREO_JDIRECTO: subArray[6],
        MES_ACTUAL: subArray[7],
        MES_1: subArray[8],
        MES_2: subArray[9],
        MES_3: subArray[10],
        ACUMULADO: (subArray[7] + subArray[8] + subArray[9] + subArray[10]),
        ULT_FECHA: subArray[11].split(' ')[0],
      }));


      for (const {
        NOMINA_USUARIO,
        NOMBRE_USUARIO,
        CENTRO,
        CORREO_USUARIO,
        NOMBRE_JDIRECTO,
        CORREO_JDIRECTO,
        MES_ACTUAL,
        MES_1,
        MES_2,
        MES_3,
        ACUMULADO,
        ULT_FECHA
      } of datosToSend) {
        
        const mailsLaborales = await actionsMysql.mailsRetardos(CENTRO, 9);

        let mensaje_texto = '';

        if ((MES_ACTUAL == 6 || MES_ACTUAL == 12 || MES_ACTUAL == 18 || MES_ACTUAL == 24) && ULT_FECHA == fechaActual) {
          if (MES_ACTUAL == 6) {
            mensaje_texto = `Correo de aviso de 6to retardo acumulado de: ${NOMINA_USUARIO} - ${NOMBRE_USUARIO}, se debe aplicar medida disciplinaria en sistema (RP-1)`;
          } else if (MES_ACTUAL == 12) {
            mensaje_texto = `Correo de aviso de 12° retardo acumulado de: ${NOMINA_USUARIO} - ${NOMBRE_USUARIO}, se debe aplicar medida disciplinaria en sistema (RP-1)`;
          } else if (MES_ACTUAL == 18) {
            mensaje_texto = `Correo de aviso de 18° retardo acumulado de: ${NOMINA_USUARIO} - ${NOMBRE_USUARIO}, se debe aplicar medida disciplinaria en sistema (RP-1)`;
          } else if (MES_ACTUAL == 24) {
            mensaje_texto = `Correo de aviso de 24° retardo acumulado de: ${NOMINA_USUARIO} - ${NOMBRE_USUARIO}, se debe aplicar medida disciplinaria en sistema (RP-1)`;
          }
        
        let html =
          `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Retardos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
      
        .banner {
            background: linear-gradient(135deg, #006fcf 0%, #004a8f 100%);
            color: white;
            padding: 30px 40px;
            position: relative;
            overflow: hidden;
            min-height: 150px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 111, 207, 0.2);
            margin-bottom: 20px;
        }
      
        .banner-content {
            z-index: 2;
            position: relative;
        }
      
        .banner h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      
        .banner p {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
        }
      
        .banner-decoration {
            position: absolute;
            width: 200px;
            height: 200px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            right: -50px;
            top: -50px;
        }
      
        .banner-decoration:nth-child(2) {
            width: 300px;
            height: 300px;
            right: -100px;
            top: auto;
            bottom: -100px;
            background-color: rgba(255, 255, 255, 0.05);
        }
      
        .message {
            font-size: 1rem;
            color: #333;
            margin: 20px 0;
            line-height: 1.5;
            text-align: center;
        }
      
        .table-container {
            display: flex;
            justify-content: center;
            padding: 20px;
        }
      
        table {
            border-collapse: collapse;
            width: 90%;
            max-width: 1000px;
            background-color: #f9f9f9;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
      
        th, td {
            padding: 12px 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
      
        th {
            background-color: #004a8f;
            color: white;
            font-weight: 600;
        }
      
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
      
        tr:hover {
            background-color: #e9f0fb;
        }
    </style>
</head>
<body>
    <div class="banner">
        <div class="banner-content">
            <h1>Reporte de Retardos</h1>
        </div>
        <div class="banner-decoration"></div>
        <div class="banner-decoration"></div>
    </div>
      
    <div class="message">
        <p>${mensaje_texto}</p>
    </div>      
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Nómina</th>
                    <th>Nombre</th>
                    <th>Retardo mes actual</th>
                    <th>Hace 1 mes</th>
                    <th>Hace 2 mes</th>
                    <th>Hace 3 mes</th>
                    <th>Acumulado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${NOMINA_USUARIO}</td>
                    <td>${NOMBRE_USUARIO}</td>
                    <td>${MES_ACTUAL}</td>
                    <td>${MES_1}</td>
                    <td>${MES_2}</td>
                    <td>${MES_3}</td>
                    <td>${ACUMULADO}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>`;

        const ccList = [
          { MAILS: CORREO_USUARIO },
          ...mailsLaborales
        ];
        
        const cc = ccList.map(obj => obj.MAILS);
        
        const mailOptions = {
          to: CORREO_JDIRECTO,
          cc,
          subject: `${subject} - ${fechaActual}`,
          html,
        };
        
        

        console.log(mailOptions);


        const mailResult = await actMailer.createObjMailerRetardos(mailOptions);

        if (mailResult !== 200) {
          console.error(`Error al enviar rep ASISTENCIA`, mailResult);
        }
        res.json({
          rspta: "Success",
          mensaje: "Correos enviados exitosamente"
        });
      }else{
        res.json({
          rspta: "Success",
          mensaje: "Sin correos para Enviar"
        });
      }
    }
    } catch (error) {
      console.error("Error interno del servidor:", error);
      res.status(500).json({ rspta: "Error", mensaje: "Error interno del servidor" });
    }
  },

};

async function senMailAsistencia(data) {
  const htmlPath = path.join(
    __dirname,
    `../public/html/reporteAsistencia.html`
  );
  let htmlContent = undefined;
  htmlContent = fs.readFileSync(htmlPath, "utf-8");

  try {
    dopplerData.ASISTENCIA_IMPULSE.attachments[0].base64_content =
      Buffer.from(data).toString("base64");
    dopplerData.ASISTENCIA_IMPULSE.html = htmlContent;
    const response = await axios.post(
      dopplerData.endPointSendMail,
      dopplerData.ASISTENCIA_IMPULSE,
      {
        params: { api_key: dopplerData.apikey },
        headers: { "Content-Type": "application/json" },
      }
    );
    const rspta =
      response.status == 201 ? { rspta: "Exito" } : { rspta: "Error" };
    console.log(rspta);
    return rspta;
  } catch (error) {
    // console.log(error)
    return error;
  }
}

module.exports = { actMail };

