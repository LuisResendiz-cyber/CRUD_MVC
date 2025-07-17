const fs = require("fs");
const actMailer = require("../model/model-mailer");
const path = require("path");
const { actionsMysql } = require("../model/model-mysql");
const { createConnObj, oraExcProc2 } = require("../model/model-oracle");
const { createObjectCsvStringifier } = require('csv-writer');
const archiver = require("archiver");
const { head } = require("../routes/routes");
const { title } = require("process");

// /home/dtrejo/Downloads/apis_97/apiServices/src/public/csv/asistencia.csv
const dirPath = path.join(__dirname, "../public", "/mapa_calor");
const csvFilePath = path.join(dirPath, "/MAPA_CALOR");
const zipFilePath = path.join(__dirname,"../public","/mapa_calor/MAPA_CALOR");



const autReports = {
  repAsistencia: async (req, res) => {
    const opcion = 99;
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
          const csvData =
            Object.keys(oraRspta[0]).join(",") +
            "\n" +
            oraRspta.map((obj) => Object.values(obj).join(",")).join("\n");

          const createCsv = await writeFileAsync(filePath, csvData);
          if (createCsv) {
            const mails = await actionsMysql.mailsAsistencia(1);
            if (mails.length == 0) {
              res.json({
                status: 200,
                rspta:
                  "Reporte de asistencia no enviado, sin remitentes para este correo",
              });
            } else {
              const emailAddresses = mails.map((emailObj) => emailObj.MAILS);
              const emailString = emailAddresses.join(",");

              const htmlPath = path.join(
                __dirname,
                `../public/html/reporteAsistencia.html`
              );
              htmlContent = fs.readFileSync(htmlPath, "utf-8");

              const mailOptions = {
                to: emailString,
                subject: "Reporte de Asistencia ITM",
                html: htmlContent,
                attachments: [
                  {
                    filename: "Asistencia.csv",
                    path: filePath,
                  },
                ],
              };
              let nObjMailer = await actMailer.createObjMailer(mailOptions);

              if (nObjMailer == 200) {
                console.log("Reporte de asistencia enviado: ", nObjMailer);
                await actionsMysql.saveLogCron("REPORTE DE ASISTENCIA", 1);

                res.json({ status: 200, rspta: "MAILS SENT" });
              } else {
                await actionsMysql.saveLogCron("REPORTE DE ASISTENCIA", 0);
                console.log(
                  "Error al enviar reporte de asistencia: ",
                  nObjMailer
                );
                res.send("Error al enviar reporte de asistencia");
              }
            }
          } else {
            res.json({ status: 402, rspta: "ERROR CSV CREATE" });
          }
        } // fin else
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    } //fin else
  },

repMapaCalorCitibanco: async (req, res) => {
  const startTime = new Date();
  console.log(`GENERANDO CSV MAPA CALOR: ${startTime}`);
  const { opcion, campaign, nameProcedure } = req.body;

  try {
    const objConnOracle = await createConnObj(campaign, nameProcedure, { opcion });

    if (!objConnOracle) {
      console.log("NO CREDENTIALS FOR THIS CAMPAIGN");
      return res.status(402).json({ status: 402, rspta: "NO CREDENTIALS FOR THIS CAMPAIGN" });
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const csvFullPath = csvFilePath + `_${objConnOracle.scheme}.csv`;
    if (fs.existsSync(csvFullPath)) {
      console.log(`El archivo CSV ya existe, se reemplazará: ${csvFullPath}`);
      fs.unlinkSync(csvFullPath);
    }

    const csvStream = fs.createWriteStream(csvFullPath);
    
    await oraExcProc2(objConnOracle, csvStream);

    csvStream.end();

    csvStream.on('finish', () => {
      const endTime = new Date();
      console.log(`CSV COMPLETADO --- ${endTime}`);
      return res.json({ status: 200, message: "Proceso completado con éxito" });
    });

    csvStream.on('error', (err) => {
      console.error("Error al escribir CSV:", err);
      return res.status(500).json({ status: 500, error: "Error al escribir CSV" });
    });

  } catch (error) {
    console.error("Error en repMapaCalorCitibanco:", error.message);
    return res.status(500).json({ status: 500, error: error.message });
  }
},
  downloadMapaCalorCitibanco: async (req, res) => {
    try {
      // Verificar si el archivo existe antes de intentar descargarlo
      if (!fs.existsSync(zipFilePath + `_${req.query.campana}.zip`)) {
        return res.status(404).send("Archivo no encontrado");
      }

      // Establece las cabeceras para la descarga del archivo ZIP
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=MAPA_CALOR.zip"
      );

      // Crear un stream de lectura desde el archivo ZIP
      const fileStream = fs.createReadStream(zipFilePath + `_${req.query.campana}.zip`);

      // En caso de error en el stream, manejarlo adecuadamente
      fileStream.on("error", (error) => {
        console.error("Error al leer el archivo ZIP:", error);
        res.status(500).send("Error interno del servidor");
      });

      // Enviar el archivo en chunks para permitir la descarga sin problemas
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error en downloadMapaCalorCitibanco:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  },
};

// Función para crear un flujo CSV
function writeCSVStream(stream,data) { 
  // console.log('aqui-----',data.length)
  
  
    const objLength = data.length
  
    const header = Object.keys(data[0])
    const newHeaders = header.map(key => (
      {
      id:key,
      title: key
    }))
  
    const csvStringifier = createObjectCsvStringifier({
      header: newHeaders
    });
  
  
    const chunkSize = 10000;  // Procesar en fragmentos de 10,000 filas
    return new Promise((resolve, reject) => {
      let currentRow = 0;
      const header = csvStringifier.getHeaderString();
      stream.write(header);
  
      function writeNextChunk() {
        while (currentRow < objLength) {
          const chunk = [];
  
  
          for (let i = 0; i < chunkSize && currentRow < objLength; i++, currentRow++) {
            const row = data[currentRow];
            const chunkItem = {};        
  
            Object.keys(row).forEach((key) => {
              chunkItem[key] = row[key] || '';
            });
          
            chunk.push(chunkItem);
          }
  
          const csvContent = csvStringifier.stringifyRecords(chunk);
  
          if (!stream.write(csvContent)) {
            stream.once('drain', writeNextChunk);
            return;
          }
        }
  
        // Cierra el stream cuando se complete
        // if (currentRow >= data.length) {
        if (currentRow >= objLength) {
          stream.end();
          resolve();
        }
      }
  
      writeNextChunk();
    });
  }
  
// Función para comprimir el CSV a ZIP usando flujos
function createZipStream(outputZipPath, inputCsvStreamPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }  // Nivel máximo de compresión
    });

    output.on('close', () => {
      console.log(`ZIP file has been created. Total size: ${archive.pointer()} bytes`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Añade el archivo CSV al ZIP
    archive.file(inputCsvStreamPath, { name: 'MAPA_CALOR.csv' });

    archive.finalize();
  });
}


//*Esta funcion es para el proceso del reporte de asistencia
const writeFileAsync = async (filePath, csvData) => {
  try {
    await fs.promises.writeFile(filePath, csvData);
    // console.log('El archivo CSV ha sido creado exitosamente:', filePath);

    return true;
  } catch (err) {
    console.error("Error al escribir el archivo:", err);
    return false;
  }
};

module.exports = { autReports };
