<?php
include('includes/openConnection.php');

require 'includes/PHPMailer/class.phpmailer.php';

// var_dump('hi');die();
$result = get_control_retardos($db);
// var_dump($result);
$dia  = date('d/m/Y');


if (empty($result->fields)) {
    echo json_encode(array('estado' => 'false', 'mensaje' => 'el store no trae valores'));
    return;
    die();
    exit();
}


$mail = new PHPMailer;
$mail->isSMTP();
//Enable SMTP debugging
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail->SMTPDebug = 2;
$mail->Debugoutput = 'html';
$mail->Host = "mail.impulse-telecom.com.mx";
$mail->Port = 587;
$mail->SMTPAuth = true;
//$mail->Username = "aruiz@impulse-telecom.com";//user_prueba
$mail->Username = "reportes@impulse-telecom.com";
$mail->Password = "R3p0rt32016"; //pwd_prueba
//$mail->Password = "n071f1c4c10n35";
$mail->setFrom('reportes@impulse-telecom.com', 'Retardos acumulados');


function reformatDate($date, $from_format = 'Y-m-d', $to_format = 'd/m/Y')
{
    $date_aux = date_create_from_format($from_format, $date);
    return date_format($date_aux, $to_format);
}




if (!$result->EOF) {
    while (!$result->EOF) {

        $fecha = reformatDate($result->fields['ULT_FECHA']);
        if (($result->fields['MES_ACTUAL'] == 6 || $result->fields['MES_ACTUAL'] == 16 || $result->fields['MES_ACTUAL'] == 18 || $result->fields['MES_ACTUAL'] == 24) && $fecha == $dia) {

            $asunto = "Retardo acumulado " . date('m') . "-" . date('Y') . "-" . $result->fields['NOMINA'];
            $CORREO_USUARIO  =  $result->fields['CORREO_ELECTRONICO'];
            $NOMBRE_USUARIO  =   $result->fields['NOMBRE'];
            $NOMINA_USUARIO  =   $result->fields['NOMINA'];

            $NOMBRE_JEFE =  $result->fields['JEFE_INMEDIATO'];
            $CORREO_JEFE = $result->fields['CORREO_JEFE'];
            $resp1  = $result->fields['RESP1'];
            $nresp1 = $result->fields['NRESP1'];

            $resp2  = $result->fields['RESP2'];
            $nresp2 = $result->fields['NRESP2'];

            $resp3  = $result->fields['RESP3'];
            $nresp3  = $result->fields['NRESP3'];

            $mail->addAddress($CORREO_JEFE, $NOMBRE_JEFE);
            $mail->addCC($CORREO_USUARIO, $NOMBRE_USUARIO);
            $mail->addCC($resp1, $nresp1);
            $mail->addCC($resp2, $nresp2);
            $mail->addCC($resp3, $nresp3);

            //var_dump($mail);

            if ($result->fields['MES_ACTUAL'] == 6 && $fecha == $dia) {
                $mensaje_texto = 'Correo de aviso de 6to retardo acumulado de: ' . $NOMINA_USUARIO . ' - ' . $NOMBRE_USUARIO . ', se debe aplicar medida disciplinaria en sistema (RP-1)';
            } else if ($result->fields['MES_ACTUAL'] == 12 && $fecha == $dia) {
                $mensaje_texto = 'Correo de aviso de 12° retardo acumulado de: ' . $NOMINA_USUARIO . ' - ' . $NOMBRE_USUARIO . ', se debe aplicar medida disciplinaria en sistema (RP-1)';
            } else if ($result->fields['MES_ACTUAL'] == 18 && $fecha == $dia) {
                $mensaje_texto = 'Correo de aviso de 18° retardo acumulado de: ' . $NOMINA_USUARIO . ' - ' . $NOMBRE_USUARIO . ', se debe aplicar medida disciplinaria en sistema (RP-1)';
            } else if ($result->fields['MES_ACTUAL'] == 24 && $fecha == $dia) {
                $mensaje_texto = 'Correo de aviso de 24° retardo acumulado de: ' . $NOMINA_USUARIO . ' - ' . $NOMBRE_USUARIO . ', se debe aplicar medida disciplinaria en sistema (RP-1)';
            }


            echo "<br>";
            var_dump($asunto);
            echo "<br>";
            var_dump($CORREO_JEFE);
            echo "<br>";
            var_dump($NOMBRE_JEFE);
            echo "<br>";
            var_dump($CORREO_USUARIO);
            echo "<br>";
            var_dump($NOMBRE_USUARIO);
            echo "<br>";
            var_dump($resp1);
            echo "<br>";
            var_dump($nresp1);
            echo "<br>";
            var_dump($resp2);
            echo "<br>";
            var_dump($nresp2);
            echo "<br>";
            var_dump($resp3);
            echo "<br>";
            var_dump($nresp3);
            echo "<br>";
            var_dump($mensaje_texto);


?>
            <!DOCTYPE html>
            <html lang='es'>

            <head>
                <meta charset='UTF-8'>
                <title>Pricing Table</title>
                <style>
                    body {
                        background: #fff;
                        font: 400 1em/1.4 'Open Sans', 'Helvetica Neue', sans-serif;
                        color: #333;
                        text-align: center;
                        padding: 4em 2em;
                    }

                    h1 {
                        font-weight: 300;
                        font-size: 5em;
                        line-height: 1.35;
                        margin: 0 0 .125em;
                    }

                    h1+p {
                        font-size: 1.5em;
                        color: #999;
                        max-width: 30em;
                        margin: 0 auto 3em
                    }

                    ;

                    table {
                        width: 100%;
                        text-align: left;
                        border-spacing: 0;
                        border-collapse: collapse;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                    }

                    .content-table {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    th,
                    td {
                        font-family: inherit;
                        font-size: .875em;
                        line-height: 1.45;
                        color: #444;
                        vertical-align: middle;
                        padding: 1em;
                    }

                    th {
                        font-weight: 600;
                    }

                    colgroup:nth-child(1) {
                        width: 31%;
                        border: 0 none;
                    }

                    colgroup:nth-child(2) {
                        width: 22%;
                        border: 1px solid #ccc;
                    }

                    colgroup:nth-child(3) {
                        width: 22%;
                        border: 1px solid #ccc;
                    }

                    colgroup:nth-child(4) {
                        width: 22%;
                        border: 1px solid #ccc;
                    }

                    /* Tablehead */

                    thead th {
                        background: #def4fe;
                        background: -moz-linear-gradient(top, #ffffff 0%, #f5f5f5 100%);
                        background: -webkit-linear-gradient(top, #ffffff 0%, #f5f5f5 100%);
                        background: -o-linear-gradient(top, #ffffff 0%, #f5f5f5 100%);
                        background: -ms-linear-gradient(top, #ffffff 0%, #f5f5f5 100%);
                        background: linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%);
                        text-align: center;
                        position: relative;
                        border-bottom: 1px solid #ccc;
                        padding: 3em 0 2em;
                        font-weight: 400;
                        color: #999;
                    }

                    thead th:nth-child(1) {
                        background: transparent;
                    }

                    /*thead th:nth-child(3) {  padding: 2em 0 5em; }*/
                    thead th h2 {
                        font-weight: 300;
                        font-size: 2.4em;
                        line-height: 1.2;
                        color: #59c7fb;
                    }

                    thead th h2+p {
                        font-size: 1.25em;
                        line-height: 1.4;
                    }

                    thead th:nth-child(3) h2 {
                        font-size: 2.4em;
                    }

                    thead th:nth-child(3) h2+p {
                        font-size: 1.5em;
                    }

                    thead th p.promo {
                        font-size: 1em;
                        color: #fff;
                        position: absolute;
                        top: 9em;
                        left: -17px;
                        z-index: 1000;
                        width: 100%;
                        margin: 0;
                        padding: .625em 17px .75em;
                        background: #c00;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, .25);
                        border-bottom: 1px solid #900;
                    }

                    thead th p.promo:before {
                        content: '';
                        position: absolute;
                        display: block;
                        width: 0px;
                        height: 0px;
                        border-style: solid;
                        border-width: 0 7px 7px 0;
                        border-color: transparent #900 transparent transparent;
                        bottom: -7px;
                        left: 0;
                    }

                    thead th p.promo:after {
                        content: '';
                        position: absolute;
                        display: block;
                        width: 0px;
                        height: 0px;
                        border-style: solid;
                        border-width: 7px 7px 0 0;
                        border-color: #900 transparent transparent transparent;
                        bottom: -7px;
                        right: 0;
                    }

                    /* Tablebody */

                    tbody th {
                        background: #fff;
                        border-left: 1px solid #ccc;
                    }

                    tbody th span {
                        font-weight: normal;
                        font-size: 87.5%;
                        color: #999;
                        display: block;
                    }

                    tbody td {
                        background: #fff;
                        text-align: center;
                    }

                    tbody tr:nth-child(even) th,
                    tbody tr:nth-child(even) td {
                        background: #f5f5f5;
                        border: 1px solid #ccc;
                        border-width: 1px 0 1px 1px;
                    }

                    tbody tr:last-child td {
                        border-bottom: 0 none;
                    }

                    /* Tablefooter */

                    tfoot th {
                        padding: 2em 1em;
                        border-top: 1px solid #ccc;
                    }

                    tfoot td {
                        text-align: center;
                        padding: 2em 1em;
                        border-top: 1px solid #ccc;
                    }

                    tfoot a {
                        font-weight: bold;
                        color: #fff;
                        text-decoration: none;
                        text-transform: uppercase;
                        display: block;
                        padding: 1.125em 2em;
                        background: #59c7fb;
                        border-radius: .5em;
                    }
                </style>
            </head>

            <body>
                <h4>Retardo acumulado</h4><br>
                <p><?php echo $mensaje_texto; ?></p>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nomina</th>
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
                                <td><?php echo $result->fields['NOMINA'] ?></td>
                                <td><?php echo $result->fields['NOMBRE'] ?></td>
                                <td><?php echo $result->fields['MES_ACTUAL'] ?></td>
                                <td><?php echo $result->fields['MES_1'] ?></td>
                                <td><?php echo $result->fields['MES_2'] ?></td>
                                <td><?php echo $result->fields['MES_3'] ?></td>
                                <td><?php echo $result->fields['ACUM_3MESES'] ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <body>

            </html>



<?php
            $mensaje_final =
                "<!DOCTYPE html>
            <html lang='es' >
                <head>
                <meta charset='UTF-8'>
                <title>Pricing Table</title>
                    <style>
                    
                        body { background: #fff; font: 400 1em/1.4 'Open Sans', 'Helvetica Neue', sans-serif; color: #333; text-align: center; padding: 4em 2em; }

                        h1 { font-weight: 300; font-size: 5em; line-height: 1.35; margin: 0 0 .125em; }
                        h1 + p { font-size: 1.5em; color: #999; max-width: 30em; margin: 0 auto 3em }; 
                        table { width: 100%; text-align: left; border-spacing: 0; border-collapse: collapse; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }

                        .content-table{
                            display: flex; justify-content: center; align-items: center;
                        }

                        th, td { font-family: inherit; font-size: .875em; line-height: 1.45; color: #444; vertical-align: middle; padding: 1em; }
                        th { font-weight: 600; }
        
                        colgroup:nth-child(1) { width: 31%; border: 0 none; }
                        colgroup:nth-child(2) { width: 22%; border: 1px solid #ccc; }
                        colgroup:nth-child(3) { width: 22%; border: 1px solid #ccc; }
                        colgroup:nth-child(4) { width: 22%; border: 1px solid #ccc; }
        
                        /* Tablehead */

                        thead th { background: #def4fe; background: -moz-linear-gradient(top,  #ffffff 0%, #f5f5f5 100%); background: -webkit-linear-gradient(top,  #ffffff 0%,#f5f5f5 100%); background: -o-linear-gradient(top,  #ffffff 0%,#f5f5f5 100%); background: -ms-linear-gradient(top,  #ffffff 0%,#f5f5f5 100%); background: linear-gradient(to bottom,  #ffffff 0%,#f5f5f5 100%); text-align: center; position: relative; border-bottom: 1px solid #ccc; padding: 3em 0 2em; font-weight: 400; color: #999; }
                        thead th:nth-child(1) { background: transparent;  }
                        /*thead th:nth-child(3) {  padding: 2em 0 5em; }*/
                        thead th h2 { font-weight: 300; font-size: 2.4em; line-height: 1.2; color: #59c7fb; }
                        thead th h2 + p { font-size: 1.25em; line-height: 1.4; }
                        thead th:nth-child(3) h2 { font-size: 2.4em; }
                        thead th:nth-child(3) h2 + p { font-size: 1.5em; }
        
                        thead th p.promo { font-size: 1em; color: #fff; position: absolute; top: 9em; left: -17px; z-index: 1000; width: 100%; margin: 0; padding: .625em 17px .75em; background: #c00; box-shadow: 0 2px 4px rgba(0,0,0,.25); border-bottom: 1px solid #900; }
        
                        thead th p.promo:before { content: ''; position: absolute; display: block; width: 0px; height: 0px; border-style: solid; border-width: 0 7px 7px 0; border-color: transparent #900 transparent transparent; bottom: -7px; left: 0; }
                        thead th p.promo:after { content: ''; position: absolute; display: block; width: 0px; height: 0px; border-style: solid; border-width: 7px 7px 0 0; border-color: #900 transparent transparent transparent; bottom: -7px; right: 0; }
        
                        /* Tablebody */
        
                        tbody th { background: #fff; border-left: 1px solid #ccc; }
                        tbody th span { font-weight: normal; font-size: 87.5%; color: #999; display: block; }
        
                        tbody td { background: #fff; text-align: center; }
        
                        tbody tr:nth-child(even) th,
                        tbody tr:nth-child(even) td { background: #f5f5f5; border: 1px solid #ccc; border-width: 1px 0 1px 1px; }
                        tbody tr:last-child td { border-bottom: 0 none; }
        
                        /* Tablefooter */
        
                        tfoot th  { padding: 2em 1em; border-top: 1px solid #ccc; }
                        tfoot td  { text-align: center; padding: 2em 1em; border-top: 1px solid #ccc; }
        
                        tfoot a  { font-weight: bold; color: #fff; text-decoration: none; text-transform: uppercase; display: block; padding: 1.125em 2em; background: #59c7fb; border-radius: .5em; }
                    </style>
                </head>

                <body>
                <h4>Retardo Acumulado</h4><br>

                <div>
                
                <p>" . $mensaje_texto . "</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Nomina</th>
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
                                <td>" . $result->fields['NOMINA'] . "</td>
                                <td>" . $result->fields['NOMBRE'] . "</td>
                                <td>" . $result->fields['MES_ACTUAL'] . "</td>
                                <td>" . $result->fields['MES_1'] . "</td>
                                <td>" . $result->fields['MES_2'] . "</td>
                                <td>" . $result->fields['MES_3'] . "</td>
                                <td>" . $result->fields['ACUM_3MESES'] . "</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr>
        ";


            $mail->Subject = $asunto;
            $mail->msgHTML($mensaje_final);

            if (!$mail->Send()) {
                echo json_encode(array('estado' => 'false', 'mensaje' => $mail->ErrorInfo));
            } else {
                echo json_encode(array('estado' => 'true', 'mensaje' => 'sin error'));
            }
            $mail->ClearAddresses();  // each AddAddress add to list
            $mail->ClearCCs();
        }
        $result->MoveNext();
    }
}





?>



















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
            res.json({rspta: "Correos cargados correctamente", details: porcionEmail});
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
  checkEmailRecipients: async (req,res) => {
    // console.log(correosJson)
    const emailsCorto = correosJson.slice(0, 2);
    res.json({rspta: `Total de correos cargados ${correosJson.length}`, details: emailsCorto})

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
  /*EmailRetardos: async (req, res) => {
    const campaign = 1;
    const nameProcedure = "SPS_CONTROL_RETARDOS";    
    
    objConnOracle = await createConnObj(campaign, nameProcedure);
    
    try {    

      //mando a mi base a traer los correos
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

      // Accedo a los correos
      const emails = email_base.map((subArray) => subArray[1]);

      let correosEnviados = 0;
      for (const email of emails) {

        const mailOptions = {
          to: email,
          subject: `Retardos acumulados`,
          html: `<h5>HOLAAAAAA ${email}</h5>`,
        };

        try {
          let nObjMailer = await actMailer.createObjMailer(mailOptions);

          if (nObjMailer == 200) {
            console.log('MAILS SENT');
          }    
        } catch (error) {
          console.log(error);
        }
        correosEnviados++;
      }

      res.json({
        rspta: "Success",
        mensaje: "Correos enviados exitosamente",
        total: correosEnviados,
      });
  
     } catch (error) {
       res.status(500).json({ rspta: "Error", mensaje: "Error interno del servidor" });
     }
  },*/

EmailRetardos: async (req, res) => {
    const { procedure, subject, content } = req.body;

    console.log(procedure);
    console.log(subject);
    console.log(content);

    return;


    const campaign = 1;
    const nameProcedure = "SPS_CONTROL_RETARDOS";    
    
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

        // Accedo a los correos DE JEFES INMEDIATOS
        const datosJefe = email_base.map((subArray) => ({
          nombre: subArray[6],
          email: subArray[7], 
        }));
      

      //ACCEDER DATOS USUARIO
      const Usuario = email_base.map((subArray) => ({
        nombre: subArray[6],
        email: subArray[7], 
      }));

      //ACCEDER A DATOS LABORALES
      const Laborales = email_base.map((subArray) => ({
        nombre: subArray[6],
        email: subArray[7], 
      }));

      console.log(datosJefe);
      return res.json({
        rspta: "Success",
        mensaje: "Correos enviados exitosamente"
    });



        // Envío de correos en paralelo
        const mailPromises = emails.map(async (email) => {
          const mailOptions = {
              to: email,
              subject: subject,
              html: `<h5>HOLAAAAAA ${email}</h5>`,
          }; 
          
          console.log(mailOptions);
            //try {
            //  console.log(mailOptions);
            //    let nObjMailer = await actMailer.createObjMailer(mailOptions);
            //    return nObjMailer === 200;
            //} catch (error) {
            //    console.log(`Error al enviar correo a ${email}:`, error);
            //    return false;
            //}
        });

        // Espera a que todos los correos sean enviados
        const results = await Promise.all(mailPromises);
        const correosEnviados = results.filter(result => result).length; // Cuenta los correos enviados exitosamente

        res.json({
            rspta: "Success",
            mensaje: "Correos enviados exitosamente",
            total: correosEnviados,
        });
  
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





































