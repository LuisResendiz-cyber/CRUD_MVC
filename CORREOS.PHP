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
