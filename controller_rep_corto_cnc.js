const actMailer = require('../model/model-mailer')
// const XLSX = require("xlsx");
// const XLSX = require('xlsx-style');
const ExcelJS = require('exceljs');
const path = require("path");
const fs = require("fs");
const { actionsMysql } = require("../model/model-mysql");

const {
  createConnObj,
  oraExcProc2
} = require("../model/model-oracle");

const repCortoCNC = {
  test: (req, res) => {
    console.log("peticion test sms");
    res.json({ status: 200, rspta: "Mensaje enviado", proveedor: 1 });
  },
  reporteCortoCitiCNC: async (req, res) => {
    // console.log(req);
    const campaign = 1013;
    const nameProcedure = "sps_reporte_corto";
    let parameters = { option: 1 };
    // console.log(campaign);

    objConnOracle = await createConnObj(campaign, nameProcedure, parameters);
    if (objConnOracle == null || objConnOracle == undefined) {
      console.log("NO CREDENTIALS FOR THIS CAMPAIGN");
      res.json({ status: 402, rspta: "NO CREDENTIALS FOR THIS CAMPAIGN" });
    } else {
        // console.log(objConnOracle);
      try {
        const oraRspta = await oraExcProc2(objConnOracle);
        // const oraRspta = 0;
        if (oraRspta == 0) {
          console.log("NO DATA IN ORACLE");
          // res.json({ status: 402, rspta: "NO DATA IN ORACLE" });
          let date = new Date()

          let day = date.getDate()
          let month = date.getMonth() + 1
          let year = date.getFullYear()

          if(month < 10){
            console.log(`${day}/0${month}/${year}`)
            fecha_actual = `${day}/0${month}/${year}`;
          }else{
            console.log(`${day}-${month}-${year}`)
            fecha_actual = `${day}-${month}-${year}`;
          }

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Reporte_Corto_CNC');

          const ws_data = [
              [fecha_actual, "CORTE", "", "CNC", ""],
              ["", "", "", "G1", "G2", "G3", "G4", "G5", "Recarga", "Recovery", "Total"],
              ["BAU", "11:00", "WS", "", "", "", "", "", "", "", ""],
              ["", "", "Ventas", "", "", "", "", "", "", "", ""],
              ["", "14:00", "WS", "", "", "", "", "", "", "", ""],
              ["", "", "Ventas", "", "", "", "", "", "", "", ""],
              ["", "16:00", "WS", "", "", "", "", "", "", "", ""],
              ["", "", "Ventas", "", "", "", "", "", "", "", ""],
              ["", "19:00", "WS", "", "", "", "", "", "", "", ""],
              ["", "", "Ventas", "", "", "", "", "", "", "", ""],
              ["", "WS", "", "", "", "", "", "", "", "", ""],
              ["", "Ventas", "", "", "", "", "", "", "", "", ""],
              ["GENERAL", "Ventas Sin Cita", "", "", "", "", "", "", "", "", ""]
          ];

          aplicarEstilos(ws_data, worksheet, workbook, res);
        
        } else {
        //   console.log('con datos')
        //   console.log(oraRspta);
        //   console.log(oraRspta[0]["FECHA"]);
            // Función para obtener el valor, usando 0 si es vacío
            const getValue = (value) => (value === '' || value === null) ? 0 : value;

            // Inicializa variables
            let p1_9_11_g1, p2_9_11_g1, p1_9_11_g2, p2_9_11_g2, p1_9_11_g3, p2_9_11_g3, p1_9_11_g4, p2_9_11_g4, p1_9_11_g5, p2_9_11_g5;
            let total_ws_9_11, total_ventas_9_11;

            let p1_11_14_g1, p2_11_14_g1, p1_11_14_g2, p2_11_14_g2, p1_11_14_g3, p2_11_14_g3, p1_11_14_g4, p2_11_14_g4, p1_11_14_g5, p2_11_14_g5;
            let total_ws_11_14, total_ventas_11_14;

            let p1_14_16_g1, p2_14_16_g1, p1_14_16_g2, p2_14_16_g2, p1_14_16_g3, p2_14_16_g3, p1_14_16_g4, p2_14_16_g4, p1_14_16_g5, p2_14_16_g5;
            let total_ws_14_16, total_ventas_14_16;

            let p1_16_19_g1, p2_16_19_g1, p1_16_19_g2, p2_16_19_g2, p1_16_19_g3, p2_16_19_g3, p1_16_19_g4, p2_16_19_g4, p1_16_19_g5, p2_16_19_g5;
            let total_ws_16_19, total_ventas_16_19;

            let total_ventas_g1 = 0;
            let total_sw_g1 = 0;

            // Asignar valores para cada periodo
            const assignValues = (index, rangePrefix) => {
                if (oraRspta[index]) {
                    const data = oraRspta[index];
                    for (let i = 1; i <= 5; i++) {
                        eval(`p1_${rangePrefix}_g${i} = getValue(data['G${i}_WS']);`);
                        eval(`p2_${rangePrefix}_g${i} = getValue(data['G${i}']);`);
                    }
                    eval(`total_ws_${rangePrefix} = getValue(data['TOTAL_WS']);`);
                    eval(`total_ventas_${rangePrefix} = getValue(data['TOTAL_VENTAS']);`);
                }
            };

            // Asignar valores
            if (oraRspta.length > 0) {
                assignValues(0, '9_11');
                // Calcular totales
                total_ventas_g1 = p2_9_11_g1;
                total_sw_g1 = p1_9_11_g1;
                total_ventas_g2 = p2_9_11_g2;
                total_sw_g2 = p1_9_11_g2;
                total_ventas_g3 = p2_9_11_g3;
                total_sw_g3 = p1_9_11_g3;
                total_ventas_g4 = p2_9_11_g4;
                total_sw_g4 = p1_9_11_g4;
                total_ventas_g5 = p2_9_11_g5;
                total_sw_g5 = p1_9_11_g5;
            }
            if (oraRspta.length > 1) {
                assignValues(1, '11_14');
                // Calcular totales
                total_ventas_g1 = p2_9_11_g1 + p2_11_14_g1;
                total_sw_g1 = (p1_9_11_g1 + p1_11_14_g1) / 2;
                total_ventas_g2 = p2_9_11_g2 + p2_11_14_g2;
                total_sw_g2 = (p1_9_11_g2 + p1_11_14_g2) / 2;
                total_ventas_g3 = p2_9_11_g3 + p2_11_14_g3;
                total_sw_g3 = (p1_9_11_g3 + p1_11_14_g3) / 2;
                total_ventas_g4 = p2_9_11_g4 + p2_11_14_g4;
                total_sw_g4 = (p1_9_11_g4 + p1_11_14_g4) / 2;
                total_ventas_g5 = p2_9_11_g5 + p2_11_14_g5;
                total_sw_g5 = (p1_9_11_g5 + p1_11_14_g5) / 2;
            }
            if (oraRspta.length > 2) {
                assignValues(2, '14_16');
                // Calcular totales
                total_ventas_g1 = p2_9_11_g1 + p2_11_14_g1 + p2_14_16_g1 ;
                total_sw_g1 = (p1_9_11_g1 + p1_11_14_g1 + p1_14_16_g1) / 3;
                total_ventas_g2 = p2_9_11_g2 + p2_11_14_g2 + p2_14_16_g2;
                total_sw_g2 = (p1_9_11_g2 + p1_11_14_g2 + p1_14_16_g2) / 3;
                total_ventas_g3 = p2_9_11_g3 + p2_11_14_g3 + p2_14_16_g3;
                total_sw_g3 = (p1_9_11_g3 + p1_11_14_g3 + p1_14_16_g3) / 3;
                total_ventas_g4 = p2_9_11_g4 + p2_11_14_g4 + p2_14_16_g4;
                total_sw_g4 = (p1_9_11_g4 + p1_11_14_g4 + p1_14_16_g4) / 3;
                total_ventas_g5 = p2_9_11_g5 + p2_11_14_g5 + p2_14_16_g5;
                total_sw_g5 = (p1_9_11_g5 + p1_11_14_g5 + p1_14_16_g5) / 3;
            }
            if (oraRspta.length > 3) {
                assignValues(3, '16_19');
                // Calcular totales
                total_ventas_g1 = p2_9_11_g1 + p2_11_14_g1 + p2_14_16_g1 + p2_16_19_g1;
                total_sw_g1 = (p1_9_11_g1 + p1_11_14_g1 + p1_14_16_g1 + p1_16_19_g1) / 4;
                total_ventas_g2 = p2_9_11_g2 + p2_11_14_g2 + p2_14_16_g2 + p2_16_19_g2;
                total_sw_g2 = (p1_9_11_g2 + p1_11_14_g2 + p1_14_16_g2 + p1_16_19_g2) / 4;
                total_ventas_g3 = p2_9_11_g3 + p2_11_14_g3 + p2_14_16_g3 + p2_16_19_g3;
                total_sw_g3 = (p1_9_11_g3 + p1_11_14_g3 + p1_14_16_g3 + p1_16_19_g3) / 4;
                total_ventas_g4 = p2_9_11_g4 + p2_11_14_g4 + p2_14_16_g4 + p2_16_19_g4;
                total_sw_g4 = (p1_9_11_g4 + p1_11_14_g4 + p1_14_16_g4 + p1_16_19_g4) / 4;
                total_ventas_g5 = p2_9_11_g5 + p2_11_14_g5 + p2_14_16_g5 + p2_16_19_g5;
                total_sw_g5 = (p1_9_11_g5 + p1_11_14_g5 + p1_14_16_g5 + p1_16_19_g5) / 4;
            }

            total_ws = total_sw_g1 + total_sw_g2 + total_sw_g3 + total_sw_g4 + total_sw_g5;
            total_ventas = total_ventas_g1 + total_ventas_g2 + total_ventas_g3 + total_ventas_g4 + total_ventas_g5;

            parameters = { option: 3 };
            objConnOracle = await createConnObj(campaign, nameProcedure, parameters);
            // console.log(objConnOracle);
            try {
                const oraRspta2 = await oraExcProc2(objConnOracle);
                // console.log(oraRspta2);
                if (oraRspta2 == 0) {
                    // console.log("NO DATA IN ORACLE");
                    total_ventas_sc = 0;
                    total_ventas_sc_g1 = 0;
                    total_ventas_sc_g2 = 0;
                    total_ventas_sc_g3 = 0;
                    total_ventas_sc_g4 = 0;
                    total_ventas_sc_g5 = 0;
                } else {
                    total_ventas_sc_g1 = oraRspta2[0]["GRUPO_1"];
                    total_ventas_sc_g2 = oraRspta2[0]["GRUPO_2"];
                    total_ventas_sc_g3 = oraRspta2[0]["GRUPO_3"];
                    total_ventas_sc_g4 = oraRspta2[0]["GRUPO_4"];
                    total_ventas_sc_g5 = oraRspta2[0]["GRUPO_5"];

                    total_ventas_sc = total_ventas_sc_g1 + total_ventas_sc_g2 + total_ventas_sc_g3 + total_ventas_sc_g4 + total_ventas_sc_g5;
                }
            } catch (error) {
                res.status(500).send({ error: error.message });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte_Corto_CNC');

            const ws_data = [
                [oraRspta[0]["FECHA"], "CORTE", "", "CNC", ""],
                ["", "", "", "G1", "G2", "G3", "G4", "G5", "Recarga", "Recovery", "Total"],
                ["BAU", "11:00", "WS", p1_9_11_g1, p1_9_11_g2, p1_9_11_g3, p1_9_11_g4, p1_9_11_g5, "", "", total_ws_9_11],
                ["", "", "Ventas", p2_9_11_g1, p2_9_11_g2, p2_9_11_g3, p2_9_11_g4, p2_9_11_g5, "", "", total_ventas_9_11],
                ["", "14:00", "WS", p1_11_14_g1, p1_11_14_g2, p1_11_14_g3, p1_11_14_g4, p1_11_14_g5, "", "", total_ws_11_14],
                ["", "", "Ventas", p2_11_14_g1, p2_11_14_g2, p2_11_14_g3, p2_11_14_g4, p2_11_14_g5, "", "", total_ventas_11_14],
                ["", "16:00", "WS", p1_14_16_g1, p1_14_16_g2, p1_14_16_g3, p1_14_16_g4, p1_14_16_g5, "", "", total_ws_14_16],
                ["", "", "Ventas", p2_14_16_g1, p2_14_16_g2, p2_14_16_g3, p2_14_16_g4, p2_14_16_g5, "", "", total_ventas_14_16],
                ["", "19:00", "WS", p1_16_19_g1, p1_16_19_g2, p1_16_19_g3, p1_16_19_g4, p1_16_19_g5, "", "", total_ws_16_19],
                ["", "", "Ventas", p2_16_19_g1, p2_16_19_g2, p2_16_19_g3, p2_16_19_g4, p2_16_19_g5, "", "", total_ventas_16_19],
                ["", "WS", "", total_sw_g1, total_sw_g2, total_sw_g3, total_sw_g4, total_sw_g5, "", "", total_ws],
                ["", "Ventas", "", total_ventas_g1, total_ventas_g2, total_ventas_g3, total_ventas_g4, total_ventas_g5, "", "", total_ventas],
                ["GENERAL", "Ventas Sin Cita", "", total_ventas_sc_g1, total_ventas_sc_g2, total_ventas_sc_g3, total_ventas_sc_g4, total_ventas_sc_g5, "", "", total_ventas_sc]
            ];
            aplicarEstilos(ws_data, worksheet, workbook, res);
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    } //termina else objConnOracle
  },
};

async function aplicarEstilos(ws_data, worksheet, workbook, res) {
  // Añadir los datos a la hoja de trabajo
  ws_data.forEach(row => worksheet.addRow(row));
  // Aplicar estilos
  worksheet.getCell('A1').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '28b445' } };

  worksheet.getCell('B1:C2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('B1:C2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };

  worksheet.getCell('D1').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('D1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };

  worksheet.getCell('D2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('D2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('E2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('E2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('F2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('F2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('G2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('G2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('H2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('H2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('I2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('I2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('J2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('J2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };
  worksheet.getCell('K2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('K2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0042cf' } };

  worksheet.getCell('A3:A12').font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'ffffff' } };
  worksheet.getCell('A3:A12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '405d46' } };

  worksheet.getCell('C3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('C3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('D3').font = { name: 'Calibri', size: 11,  color: { argb: '000000' } };
  worksheet.getCell('D3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('E3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('E3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('F3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('F3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('G3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('G3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('H3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('H3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('I3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('I3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('J3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('J3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('K3').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('K3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };

  worksheet.getCell('C5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('C5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('D5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('D5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('E5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('E5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('F5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('F5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('G5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('G5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('H5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('H5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('I5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('I5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('J5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('J5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('K5').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('K5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };

  worksheet.getCell('C7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('C7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('D7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('D7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('E7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('E7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('F7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('F7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('G7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('G7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('H7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('H7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('I7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('I7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('J7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('J7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('K7').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('K7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };

  worksheet.getCell('C9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('C9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('D9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('D9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('E9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('E9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('F9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('F9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('G9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('G9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('H9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('H9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('I9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('I9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('J9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('J9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };
  worksheet.getCell('K9').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('K9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c7d7ca' } };

  worksheet.getCell('B12:C12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('B12:C12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('D12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('D12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('E12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('E12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('F12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('F12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('G12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('G12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('H12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('H12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('I12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('I12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('J12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('J12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };
  worksheet.getCell('K12').font = { name: 'Calibri', size: 11, color: { argb: '000000' } };
  worksheet.getCell('K12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'fefa00' } };

  worksheet.getCell('A13').font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'fe0000' } };
  worksheet.getCell('B13:C13').font = { name: 'Calibri', size: 11 , bold: true, color: { argb: '000000' } };
  worksheet.getCell('D13').font = { name: 'Calibri', size: 11, bold: true, color: { argb: '000000' } };
  worksheet.getCell('K13').font = { name: 'Calibri', size: 11, bold: true, color: { argb: '000000' } };

  worksheet.getCell('B13:C13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('D13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('E13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('F13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('G13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('H13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('I13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('J13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };
  worksheet.getCell('K13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '828480' } };


  // Fusionar celdas
  worksheet.mergeCells('A1:A2');
  worksheet.mergeCells('B1:C2');
  worksheet.mergeCells('D1:K1');
  worksheet.mergeCells('B3:B4');
  worksheet.mergeCells('B5:B6');
  worksheet.mergeCells('B7:B8');
  worksheet.mergeCells('B9:B10');
  worksheet.mergeCells('A3:A12');
  worksheet.mergeCells('B11:C11');
  worksheet.mergeCells('B12:C12');
  worksheet.mergeCells('B13:C13');

  // Especificar la ruta del archivo
  const outputPath = path.join(__dirname, "..", 'assets/docs', 'Reporte_Corto_CNC.xlsx');
  console.log(outputPath);

  // Crear la carpeta si no existe
  // Crear la carpeta si no existe
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  // Guardar el archivo


  const filePath = path.join(__dirname, "..", "assets/docs", "Reporte_Corto_CNC.xlsx");
  try {
  // // Escribir el archivo
  // XLSX.writeFile(wb, filePath);
  // console.log(`Archivo guardado en ${filePath}`);
      await workbook.xlsx.writeFile(outputPath);
      console.log(`Archivo Excel guardado en: ${outputPath}`);
      // res.json({ status: 200, rspta: "Reporte de asistencia no enviado, sin remitentes para este correo" });
      enviarCorreo(outputPath, res);
/*
      const mails= await actionsMysql.mailsAsistencia(2);
    if (mails.length == 0) {
      res.json({ status: 200, rspta: "Reporte de asistencia no enviado, sin remitentes para este correo" });
    } else {

      console.log(mails);
      const emailAddresses = mails.map(emailObj => emailObj.MAILS);
      const emailString = emailAddresses.join(',');             

      const htmlPath = path.join(outputPath);
      htmlContent = fs.readFileSync(htmlPath, "utf-8");

      const mailOptions = {
          to: emailString,                
          subject: 'Reporte Corto Citi CNC',      
          html: 'Reporte Corto Citi CNC',
          attachments: [
          {
              filename: 'Reporte_Corto_CNC.xlsx',
              path: filePath 
          }
          ]
      }
      let nObjMailer = await actMailer.createObjMailer(mailOptions)

      if (nObjMailer == 200) {
          console.log('Reporte de asistencia enviado: ', nObjMailer)
          await actionsMysql.saveLogCron("REPORTE DE ASISTENCIA",1);
                  
          res.json({ status: 200, rspta: "MAILS SENT" });

      }else {
          await actionsMysql.saveLogCron("REPORTE DE ASISTENCIA",0);
          console.log('Error al enviar reporte de asistencia: ', nObjMailer)
          res.send('Error al enviar reporte de asistencia')
      } 
    }*/

  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).json(error);
  }
}

async function enviarCorreo(filePath, res) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];


  let html = '<table style="border-collapse: collapse; width: 50%;">';

    // Agregar encabezados de la segunda fila
    worksheet.getRow(2).eachCell((cell, colNumber) => {
        if (colNumber === 1) {
            // Primera celda de la segunda fila
            html += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #4CAF50; color: white;">${cell.value}</th>`;
        } else {
            // Otras celdas de la segunda fila
            html += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #0042cf; color: white;">${cell.value}</th>`;
        }
    });
    html += '</tr>';
//c7d7ca
    // Agregar filas a partir de la tercera fila y manejar combinaciones de celdas
    let rowSpanCounter = {}; // Para llevar un registro de las celdas combinadas

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber === 1 || rowNumber === 2) return; // Saltar la primera fila (índice 1 en ExcelJS)

        html += '<tr>';
        row.eachCell((cell, colNumber) => {
            let cellStyle = 'border: 1px solid #ddd; padding: 8px;';

            // Aplicar color especial a la primera celda de la segunda fila hasta la primera celda de la fila 11
            if (rowNumber === 13 && colNumber === 1) {
              cellStyle += 'color: red;'; // 
            } else if (rowNumber === 13 && colNumber >= 2 && colNumber <= 11) {
              cellStyle += 'background-color: #828480; color: white;'; // 
            } else if (rowNumber === 12 && colNumber >= 2 && colNumber <= 11) {
              cellStyle += 'background-color: #fefa00; color: black;'; // 
            } else if (rowNumber === 9 && colNumber >= 3 && colNumber <= 11) {
              cellStyle += 'background-color: #c7d7ca; color: black;'; // 
            } else if (rowNumber === 7 && colNumber >= 3 && colNumber <= 11) {
              cellStyle += 'background-color: #c7d7ca; color: black;'; // 
            } else if (rowNumber === 5 && colNumber >= 3 && colNumber <= 11) {
              cellStyle += 'background-color: #c7d7ca; color: black;'; // 
            } else if (rowNumber === 3 && colNumber >= 3 && colNumber <= 11) {
              cellStyle += 'background-color: #c7d7ca; color: black;'; // 
            } else if (colNumber === 1 && rowNumber >= 2 && rowNumber <= 12) {
                cellStyle += 'background-color: #405d46; color: white;'; // Color especial
            } else {
              cellStyle += 'background-color: #FFF;'; // Color para las demás celdas
            }

            if (rowSpanCounter[`${rowNumber}-${colNumber}`]) {
              // Si la celda ya está combinada, no agregarla de nuevo
              return;
            }

            let colspan = 1;
            let rowspan = 1;

            // Ejemplo: combinar celdas basadas en el valor
            if (cell.value === 'Combinar') {
                colspan = 2; // Combinar con la siguiente celda
                rowSpanCounter[`${rowNumber}-${colNumber + 1}`] = true; // Marcar la celda combinada
            } else if (cell.value === 'Vertical') {
                rowspan = 2; // Combinar con la celda de abajo
                rowSpanCounter[`${rowNumber + 1}-${colNumber}`] = true; // Marcar la celda combinada
            }

            html += `<td style="${cellStyle}" colspan="${colspan}" rowspan="${rowspan}">${cell.value}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';





  const filePath_ = path.join(__dirname, "..", "assets/docs", "Reporte_Corto_CNC.xlsx");

  const mails= await actionsMysql.mailsAsistencia(2);
    if (mails.length == 0) {
      res.json({ status: 200, rspta: "Reporte no enviado, sin remitentes para este correo" });
    } else {

      console.log(mails);
      const emailAddresses = mails.map(emailObj => emailObj.MAILS);
      const emailString = emailAddresses.join(',');             

      const htmlPath = path.join(filePath);
      htmlContent = fs.readFileSync(htmlPath, "utf-8");

      const mailOptions = {
          to: emailString,                
          subject: 'Reporte Corto Citi CNC',      
          html: html,
          attachments: [
          {
              filename: 'Reporte_Corto_CNC.xlsx',
              path: filePath_ 
          }
          ]
      }
      let nObjMailer = await actMailer.createObjMailer(mailOptions)

      if (nObjMailer == 200) {
          console.log('Reporte de CNC enviado: ', nObjMailer)
          await actionsMysql.saveLogCron("REPORTE DE CNC",1);
                  
          res.json({ status: 200, rspta: "MAILS SENT" });

      }else {
          await actionsMysql.saveLogCron("REPORTE DE CNC",0);
          console.log('Error al enviar reporte de CNC: ', nObjMailer)
          res.send('Error al enviar reporte de CNC')
      } 
    }
}

module.exports = { repCortoCNC };
