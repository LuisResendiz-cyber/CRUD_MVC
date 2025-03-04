const actMailer = require("../model/model-mailer");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { actionsMysql } = require("../model/model-mysql");

let tabla = "";
let envio_correcto = 0;

const { createConnObj, oraExcProc2 } = require("../model/model-oracle");
const { func } = require("joi");

const reporteCortoSofom = {
  reporteCortoCitiSofom: async (req, res) => {
    
    const datos = [
      { opcion: 2, nombre: "PAP SJ", empresa: 411 },
      { opcion: 2, nombre: "PAP SA", empresa: 5 },
      { opcion: 4, nombre: "TOTAL PAP", empresa: 411 },
    ];

    respuesta_promesa = 0;
    const workbook = new ExcelJS.Workbook();
    let oraRspta_1 = [];

    async function fillSheet(worksheet, nombre, workbook) {
        // Función para añadir los datos
        async function addTableData(rowStart, opcion, nombre_tabla, empresa) {
            console.log(rowStart);
            tabla = nombre_tabla;
            // Solo agregar los encabezados una vez por tabla (filas 1, 14, 27)
            if (rowStart === 1 || rowStart === 13 || rowStart === 25) {
                let date = new Date()
    
                let day = date.getDate()
                let month = date.getMonth() + 1
                let year = date.getFullYear()
        
                if(month < 10) {
                    console.log(`${day}/0${month}/${year}`)
                    fecha_actual = `${day}/0${month}/${year}`;
                } else {
                    console.log(`${day}/${month}/${year}`)
                    fecha_actual = `${day}/${month}/${year}`;
                }

                const headerRow = worksheet.addRow([
                    nombre_tabla, '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', fecha_actual
                ]);
        
                headerRow.eachCell((cell, colNumber) => {
                    if (colNumber === 1 || colNumber === 12) { //tamaño de ancho para las celdas
                        worksheet.getColumn(colNumber).width = 20;
                    }
        
                    cell.style = {
                        alignment: { horizontal: 'center' }
                    };
                });
        
                headerRow.commit(); 
            }

            const campaign = 1014;
            const nameProcedure = "SPS_REPORTE_CORTO";
            let parameters = { v_empresa: empresa, v_opcion: opcion };

            objConnOracle = await createConnObj(campaign, nameProcedure, parameters);

            if (objConnOracle == null || objConnOracle == undefined) {
              console.log("NO CREDENTIALS FOR THIS CAMPAIGN");
              res.json({ status: 402, rspta: "NO CREDENTIALS FOR THIS CAMPAIGN" });
            } else {
                try {
                    const oraRspta_1 = await oraExcProc2(objConnOracle);
                    // const oraRspta_1 = 0;

                    if (oraRspta_1 == 0) {
                        const rows = [
                            { total_pap: 'Meta Ventas', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 },
                            { total_pap: 'Meta Autenticadas', '10:00': '0%', '11:00': '0%', '12:00': '0%', '13:00': '0%', '14:00': '0%', '15:00': '0%', '16:00': '0%', '17:00': '0%', '18:00': '0%', '19:00': '0%', total: '0%' },
                            { total_pap: 'Meta Pre creadas', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 },
                            //{ total_pap: '%', '10:00': '0%', '11:00': '0%', '12:00': '0%', '13:00': '0%', '14:00': '0%', '15:00': '0%', '16:00': '0%', '17:00': '0%', '18:00': '0%', '19:00': '0%', total: '0%' },
                            { total_pap: 'WS', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 },
                            { total_pap: 'Ventas', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 },
                            { total_pap: 'AU', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 },
                            { total_pap: '% AU', '10:00': '0%', '11:00': '0%', '12:00': '0%', '13:00': '0%', '14:00': '0%', '15:00': '0%', '16:00': '0%', '17:00': '0%', '18:00': '0%', '19:00': '0%', total: '0%' },
                            { total_pap: 'Pre creadas', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 },
                            { total_pap: '% AR', '10:00': '0%', '11:00': '0%', '12:00': '0%', '13:00': '0%', '14:00': '0%', '15:00': '0%', '16:00': '0%', '17:00': '0%', '18:00': '0%', '19:00': '0%', total: '0%' },
                            { total_pap: 'Declinadas', '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0, '17:00': 0, '18:00': 0, '19:00': 0, total: 0 }
                        ];
                        
                        rows.forEach((row, rowIndex) => {
                            const newRow = worksheet.addRow([
                                row.total_pap, row['10:00'], row['11:00'], row['12:00'], row['13:00'], row['14:00'], row['15:00'], row['16:00'], row['17:00'], row['18:00'], row['19:00'], row.total
                            ]);
                            newRow.commit(); 
                        });
            
                        if (rowStart !== 25) {
                            worksheet.addRow([]);  // Añadir una fila vacía de separación entre tablas
                        }
                    } else {
                        // Extraer los valores de forma dinámica
                        const metaVentas = oraRspta_1.map(item => item.META_VENTAS);
                        const metaPreCreadas = oraRspta_1.map(item => item.META_PRECARGADAS);
                        const ws = oraRspta_1.map(item => item.WS);
                        const ventas = oraRspta_1.map(item => item.VENTAS);
                        const autorizadas = oraRspta_1.map(item => item.VENTAS_AUTENTICADAS);
                        const precreadas = oraRspta_1.map(item => item.VENTAS_PRECARGADAS);
                        const declinadas = oraRspta_1.map(item => item.VENTAS_DECLINADAS);
                        // const porcentaje_ve = oraRspta_1.map(item => item.PORC_VENTAS);
                        const metaAutenticadas = oraRspta_1.map(item => item.META_AUTENTICADAS);
                        const porcentaje_pc = oraRspta_1.map(item => item.PORC_PRE);
                        const porcentaje_au = oraRspta_1.map(item => item.PORC_AUT);
                        const porcentaje_ar = oraRspta_1.map(item => item.PORC_AR);

                        // 
                        const mv_10 = metaVentas[0];
                        const mv_11 = metaVentas[1];
                        const mv_12 = metaVentas[2];
                        const mv_13 = metaVentas[3];
                        const mv_14 = metaVentas[4];
                        const mv_15 = metaVentas[5];
                        const mv_16 = metaVentas[6];
                        const mv_17 = metaVentas[7];
                        const mv_18 = metaVentas[8];
                        const mv_19 = metaVentas[9];

                        const mpc_10 = metaPreCreadas[0];
                        const mpc_11 = metaPreCreadas[1];
                        const mpc_12 = metaPreCreadas[2];
                        const mpc_13 = metaPreCreadas[3];
                        const mpc_14 = metaPreCreadas[4];
                        const mpc_15 = metaPreCreadas[5];
                        const mpc_16 = metaPreCreadas[6];
                        const mpc_17 = metaPreCreadas[7];
                        const mpc_18 = metaPreCreadas[8];
                        const mpc_19 = metaPreCreadas[9];

                        const ws_10 = ws[0];
                        const ws_11 = ws[1];
                        const ws_12 = ws[2];
                        const ws_13 = ws[3];
                        const ws_14 = ws[4];
                        const ws_15 = ws[5];
                        const ws_16 = ws[6];
                        const ws_17 = ws[7];
                        const ws_18 = ws[8];
                        const ws_19 = ws[9];

                        const ventas_10 = ventas[0];
                        const ventas_11 = ventas[1];
                        const ventas_12 = ventas[2];
                        const ventas_13 = ventas[3];
                        const ventas_14 = ventas[4];
                        const ventas_15 = ventas[5];
                        const ventas_16 = ventas[6];
                        const ventas_17 = ventas[7];
                        const ventas_18 = ventas[8];
                        const ventas_19 = ventas[9];

                        const au_10 = autorizadas[0];
                        const au_11 = autorizadas[1];
                        const au_12 = autorizadas[2];
                        const au_13 = autorizadas[3];
                        const au_14 = autorizadas[4];
                        const au_15 = autorizadas[5];
                        const au_16 = autorizadas[6];
                        const au_17 = autorizadas[7];
                        const au_18 = autorizadas[8];
                        const au_19 = autorizadas[9];

                        const pc_10 = precreadas[0];
                        const pc_11 = precreadas[1];
                        const pc_12 = precreadas[2];
                        const pc_13 = precreadas[3];
                        const pc_14 = precreadas[4];
                        const pc_15 = precreadas[5];
                        const pc_16 = precreadas[6];
                        const pc_17 = precreadas[7];
                        const pc_18 = precreadas[8];
                        const pc_19 = precreadas[9];

                        const dec_10 = declinadas[0];
                        const dec_11 = declinadas[1];
                        const dec_12 = declinadas[2];
                        const dec_13 = declinadas[3];
                        const dec_14 = declinadas[4];
                        const dec_15 = declinadas[5];
                        const dec_16 = declinadas[6];
                        const dec_17 = declinadas[7];
                        const dec_18 = declinadas[8];
                        const dec_19 = declinadas[9];

                        const maut_10 = metaAutenticadas[0];
                        const maut_11 = metaAutenticadas[1];
                        const maut_12 = metaAutenticadas[2];
                        const maut_13 = metaAutenticadas[3];
                        const maut_14 = metaAutenticadas[4];
                        const maut_15 = metaAutenticadas[5];
                        const maut_16 = metaAutenticadas[6];
                        const maut_17 = metaAutenticadas[7];
                        const maut_18 = metaAutenticadas[8];
                        const maut_19 = metaAutenticadas[9];

                        const porpc_10 = porcentaje_pc[0];
                        const porpc_11 = porcentaje_pc[1];
                        const porpc_12 = porcentaje_pc[2];
                        const porpc_13 = porcentaje_pc[3];
                        const porpc_14 = porcentaje_pc[4];
                        const porpc_15 = porcentaje_pc[5];
                        const porpc_16 = porcentaje_pc[6];
                        const porpc_17 = porcentaje_pc[7];
                        const porpc_18 = porcentaje_pc[8];
                        const porpc_19 = porcentaje_pc[9];

                        const porau_10 = porcentaje_au[0];
                        const porau_11 = porcentaje_au[1];
                        const porau_12 = porcentaje_au[2];
                        const porau_13 = porcentaje_au[3];
                        const porau_14 = porcentaje_au[4];
                        const porau_15 = porcentaje_au[5];
                        const porau_16 = porcentaje_au[6];
                        const porau_17 = porcentaje_au[7];
                        const porau_18 = porcentaje_au[8];
                        const porau_19 = porcentaje_au[9];

                        const porar_10 = porcentaje_ar[0];
                        const porar_11 = porcentaje_ar[1];
                        const porar_12 = porcentaje_ar[2];
                        const porar_13 = porcentaje_ar[3];
                        const porar_14 = porcentaje_ar[4];
                        const porar_15 = porcentaje_ar[5];
                        const porar_16 = porcentaje_ar[6];
                        const porar_17 = porcentaje_ar[7];
                        const porar_18 = porcentaje_ar[8];
                        const porar_19 = porcentaje_ar[9];

                        const total_mv = parseFloat(mv_10) + parseFloat(mv_11) + parseFloat(mv_12) + parseFloat(mv_13) + parseFloat(mv_14) + parseFloat(mv_15) + parseFloat(mv_16) + parseFloat(mv_17) + parseFloat(mv_18) + parseFloat(mv_19);
                        const total_mpc = parseFloat(mpc_10) + parseFloat(mpc_11) + parseFloat(mpc_12) + parseFloat(mpc_13) + parseFloat(mpc_14) + parseFloat(mpc_15) + parseFloat(mpc_16) + parseFloat(mpc_17) + parseFloat(mpc_18) + parseFloat(mpc_19);
                        const total_ws = (parseInt(ws_10) + parseInt(ws_11) + parseInt(ws_12) + parseInt(ws_13) + parseInt(ws_14) + parseInt(ws_15) + parseInt(ws_16) + parseInt(ws_17) + parseInt(ws_18) + parseInt(ws_19)) / 10;
                        const total_ventas = parseInt(ventas_10) + parseInt(ventas_11) + parseInt(ventas_12) + parseInt(ventas_13) + parseInt(ventas_14) + parseInt(ventas_15) + parseInt(ventas_16) + parseInt(ventas_17) + parseInt(ventas_18) + parseInt(ventas_19);
                        const total_aut = parseInt(au_10) + parseInt(au_11) + parseInt(au_12) + parseInt(au_13) + parseInt(au_14) + parseInt(au_15) + parseInt(au_16) + parseInt(au_17) + parseInt(au_18) + parseInt(au_19);
                        const total_pre = parseInt(pc_10) + parseInt(pc_11) + parseInt(pc_12) + parseInt(pc_13) + parseInt(pc_14) + parseInt(pc_15) + parseInt(pc_16) + parseInt(pc_17) + parseInt(pc_18) + parseInt(pc_19);
                        const total_dec = parseInt(dec_10) + parseInt(dec_11) + parseInt(dec_12) + parseInt(dec_13) + parseInt(dec_14) + parseInt(dec_15) + parseInt(dec_16) + parseInt(dec_17) + parseInt(dec_18) + parseInt(dec_19);
                        const total_maut = parseFloat(maut_10) + parseFloat(maut_11) + parseFloat(maut_12) + parseFloat(maut_13) + parseFloat(maut_14) + parseFloat(maut_15) + parseFloat(maut_16) + parseFloat(maut_17) + parseFloat(maut_18) + parseFloat(maut_19);
                        const total_pormp = (parseInt(total_pre) / parseInt(total_mpc)).toFixed(0);
                        const total_porau = (parseInt(total_aut) / parseInt(total_ventas)) * 100 ;
                        const total_porar = (parseInt(total_pre) / parseInt(total_aut)) * 100 ;

                        if (nombre_tabla == 'TOTAL PAP') {
                            const rows = [
                                { total_pap: 'Meta Ventas', '10:00': mv_10, '11:00': mv_11, '12:00': mv_12, '13:00': mv_13, '14:00': mv_14, '15:00': mv_15, '16:00': mv_16, '17:00': mv_17, '18:00': mv_18, '19:00': mv_19, total: total_mv },
                                { total_pap: 'Meta Autenticadas', '10:00': validarValor(maut_10), '11:00': validarValor(maut_11), '12:00': validarValor(maut_12), '13:00': validarValor(maut_13), '14:00': validarValor(maut_14), '15:00': validarValor(maut_15), '16:00': validarValor(maut_16), '17:00': validarValor(maut_17), '18:00': validarValor(maut_18), '19:00': validarValor(maut_19), total: validarValor(total_maut) },
                                { total_pap: 'Meta Pre creadas', '10:00': mpc_10, '11:00': mpc_11, '12:00': mpc_12, '13:00': mpc_13, '14:00': mpc_14, '15:00': mpc_15, '16:00': mpc_16, '17:00': mpc_17, '18:00': mpc_18, '19:00': mpc_19, total: total_mpc },
                                // { total_pap: '%', '10:00': validarValor(porpc_10) + '%', '11:00': validarValor(porpc_11) + '%', '12:00': validarValor(porpc_12) + '%', '13:00': validarValor(porpc_13) + '%', '14:00': validarValor(porpc_14) + '%', '15:00': validarValor(porpc_15) + '%', '16:00': validarValor(porpc_16) + '%', '17:00': validarValor(porpc_17) + '%', '18:00': validarValor(porpc_18) + '%', '19:00': validarValor(porpc_19) + '%', total: validarValor(total_pormp) + '%' },
                                { total_pap: 'WS', '10:00': ws_10, '11:00': ws_11, '12:00': ws_12, '13:00': ws_13, '14:00': ws_14, '15:00': ws_15, '16:00': ws_16, '17:00': ws_17, '18:00': ws_18, '19:00': ws_19, total: validarValor(total_ws.toFixed(0)) },
                                { total_pap: 'Ventas', '10:00': ventas_10, '11:00': ventas_11, '12:00': ventas_12, '13:00': ventas_13, '14:00': ventas_14, '15:00': ventas_15, '16:00': ventas_16, '17:00': ventas_17, '18:00': ventas_18, '19:00': ventas_19, total: total_ventas },
                                { total_pap: 'AU', '10:00': au_10, '11:00': au_11, '12:00': au_12, '13:00': au_13, '14:00': au_14, '15:00': au_15, '16:00': au_16, '17:00': au_17, '18:00': au_18, '19:00': au_19, total: total_aut },
                                { total_pap: '% AU', '10:00': porau_10.toFixed(0) + '%', '11:00': porau_11.toFixed(0) + '%', '12:00': porau_12.toFixed(0) + '%', '13:00': porau_13.toFixed(0) + '%', '14:00': porau_14.toFixed(0) + '%', '15:00': porau_15.toFixed(0) + '%', '16:00': porau_16.toFixed(0) + '%', '17:00': porau_17.toFixed(0) + '%', '18:00': porau_18.toFixed(0) + '%', '19:00': porau_19.toFixed(0) + '%', total: validarValor(total_porau.toFixed(0)) + '%' },
                                { total_pap: 'Pre creadas', '10:00': pc_10, '11:00': pc_11, '12:00': pc_12, '13:00': pc_13, '14:00': pc_14, '15:00': pc_15, '16:00': pc_16, '17:00': pc_17, '18:00': pc_18, '19:00': pc_19, total: total_pre },
                                { total_pap: '% AR', '10:00': porar_10.toFixed(0) + '%', '11:00': porar_11.toFixed(0) + '%', '12:00': porar_12.toFixed(0) + '%', '13:00': porar_13.toFixed(0) + '%', '14:00': porar_14.toFixed(0) + '%', '15:00': porar_15.toFixed(0) + '%', '16:00': porar_16.toFixed(0) + '%', '17:00': porar_17.toFixed(0) + '%', '18:00': porar_18.toFixed(0) + '%', '19:00': porar_19.toFixed(0) + '%', total: validarValor(total_porar.toFixed(0)) + '%' },
                                { total_pap: 'Declinadas', '10:00': dec_10, '11:00': dec_11, '12:00': dec_12, '13:00': dec_13, '14:00': dec_14, '15:00': dec_15, '16:00': dec_16, '17:00': dec_17, '18:00': dec_18, '19:00': dec_19, total: total_dec }
                            ];
                            
                            rows.forEach((row, rowIndex) => {
                                const newRow = worksheet.addRow([
                                    row.total_pap, row['10:00'], row['11:00'], row['12:00'], row['13:00'], row['14:00'], row['15:00'], row['16:00'], row['17:00'], row['18:00'], row['19:00'], row.total
                                ]);
                                newRow.commit(); 
                            });

                            const filas_2_14 = [2, 14]; // mv
                            const filas_3_15 = [3, 15]; // maut
                            const filas_4_16 = [4, 16]; // mpc
                            const filas_5_17 = [5, 17]; // ws
                            const filas_6_18 = [6, 18]; // ventas
                            const filas_7_19 = [7, 19]; // au                           
                            const filas_9_21 = [9, 21]; // pc

                            const columnas = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']; 
                            
                            for (let i = 0; i < columnas.length; i++) {
                                let columna = columnas[i];
                                
                                let valor1_2_14 = worksheet.getCell(`${columna}${filas_2_14[0]}`).value;
                                let valor2_2_14 = worksheet.getCell(`${columna}${filas_2_14[1]}`).value;
                                let valor1_3_15 = worksheet.getCell(`${columna}${filas_3_15[0]}`).value;
                                let valor2_3_15 = worksheet.getCell(`${columna}${filas_3_15[1]}`).value;
                                let valor1_4_16 = worksheet.getCell(`${columna}${filas_4_16[0]}`).value;
                                let valor2_4_16 = worksheet.getCell(`${columna}${filas_4_16[1]}`).value;
                                let valor1_5_17 = worksheet.getCell(`${columna}${filas_5_17[0]}`).value;
                                let valor2_5_17 = worksheet.getCell(`${columna}${filas_5_17[1]}`).value;
                                let valor1_6_18 = worksheet.getCell(`${columna}${filas_6_18[0]}`).value;
                                let valor2_6_18 = worksheet.getCell(`${columna}${filas_6_18[1]}`).value;
                                let valor1_7_19 = worksheet.getCell(`${columna}${filas_7_19[0]}`).value;
                                let valor2_7_19 = worksheet.getCell(`${columna}${filas_7_19[1]}`).value;
                                let valor1_9_21 = worksheet.getCell(`${columna}${filas_9_21[0]}`).value;
                                let valor2_9_21 = worksheet.getCell(`${columna}${filas_9_21[1]}`).value;

                                if (typeof valor1_2_14 === 'number' && typeof valor2_2_14 === 'number') {
                                    let suma = valor1_2_14 + valor2_2_14;
                                    worksheet.getCell(`${columna}26`).value = validarValor(suma);
                                }
                                if (typeof valor1_3_15 === 'number' && typeof valor2_3_15 === 'number') {
                                    let suma = valor1_3_15 + valor2_3_15;
                                    worksheet.getCell(`${columna}27`).value = validarValor(suma);
                                } 
                                if (typeof valor1_4_16 === 'number' && typeof valor2_4_16 === 'number') {
                                    let suma = valor1_4_16 + valor2_4_16;
                                    worksheet.getCell(`${columna}28`).value = validarValor(suma);
                                } 
                                if (typeof valor1_5_17 === 'number' && typeof valor2_5_17 === 'number') {
                                    let suma = valor1_5_17 + valor2_5_17;
                                    worksheet.getCell(`${columna}29`).value = validarValor(suma);
                                }
                                if (typeof valor1_6_18 === 'number' && typeof valor2_6_18 === 'number') {
                                    let suma = valor1_6_18 + valor2_6_18;
                                    worksheet.getCell(`${columna}30`).value = validarValor(suma);
                                } 
                                if (typeof valor1_7_19 === 'number' && typeof valor2_7_19 === 'number') {
                                    let suma = valor1_7_19 + valor2_7_19;
                                    worksheet.getCell(`${columna}31`).value = validarValor(suma);
                                }
                                if (typeof valor1_9_21 === 'number' && typeof valor2_9_21 === 'number') {
                                    let suma = valor1_9_21 + valor2_9_21;
                                    worksheet.getCell(`${columna}33`).value = validarValor(suma);
                                }  
                            }

                            // worksheet.getCell(`L29`).value = validarValor(((worksheet.getCell(`L33`).value / worksheet.getCell(`L28`).value) * 100).toFixed(0)) + '%'; 
                            // worksheet.getCell(`L31`).value = validarValor(((worksheet.getCell(`L36`).value / worksheet.getCell(`L30`).value) * 100).toFixed(0)) + '%'; 
                            // worksheet.getCell(`L32`).value = validarValor(((worksheet.getCell(`B32`).value + worksheet.getCell(`C32`).value + worksheet.getCell(`D32`).value + worksheet.getCell(`E32`).value + worksheet.getCell(`F32`).value + worksheet.getCell(`G32`).value + worksheet.getCell(`H32`).value + worksheet.getCell(`I32`).value + worksheet.getCell(`J32`).value + worksheet.getCell(`K32`).value) / 10).toFixed(0));
                            // // worksheet.getCell(`L35`).value = validarValor(((worksheet.getCell(`L34`).value / worksheet.getCell(`L33`).value) * 100).toFixed(0)) + '%'; 
                            // // worksheet.getCell(`L37`).value = validarValor(((worksheet.getCell(`L36`).value / worksheet.getCell(`L34`).value) * 100).toFixed(0)) + '%'; 
                            // // worksheet.getCell(`N38`).value = validarValor(((worksheet.getCell(`N33`).value - worksheet.getCell(`N36`).value) * 100)); 

                            // // porcentajes
                            const filas_31_30 = [31, 30]; // pocentaje au
                            const filas_33_31 = [33, 31]; // pocentaje ar
                            // const filas_34_33 = [34, 33]; // pocentaje au
                            // const filas_36_34 = [36, 34]; // pocentaje ar
			                const filas_30_33 = [30, 33]; // dec

                            for (let i = 0; i < columnas.length; i++) {
                                let columna = columnas[i];

                                let valor1_31_30 = worksheet.getCell(`${columna}${filas_31_30[0]}`).value;
                                let valor2_31_30 = worksheet.getCell(`${columna}${filas_31_30[1]}`).value;
                                let valor1_33_31 = worksheet.getCell(`${columna}${filas_33_31[0]}`).value;
                                let valor2_33_31 = worksheet.getCell(`${columna}${filas_33_31[1]}`).value;
                                let valor1_30_33 = worksheet.getCell(`${columna}${filas_30_33[0]}`).value;
                                let valor2_30_33 = worksheet.getCell(`${columna}${filas_30_33[1]}`).value;

                                if (typeof valor1_31_30 === 'number' && typeof valor2_31_30 === 'number') {
                                    let division = (valor1_31_30 / valor2_31_30) * 100;
                                    worksheet.getCell(`${columna}32`).value = validarValor(division.toFixed(0)) + '%';
                                } 
                                if (typeof valor1_33_31 === 'number' && typeof valor2_33_31 === 'number') {
                                    let division = (valor1_33_31 / valor2_33_31) * 100;
                                    worksheet.getCell(`${columna}34`).value = validarValor(division.toFixed(0)) + '%';
                                }
                                if (typeof valor1_30_33 === 'number' && typeof valor2_30_33 === 'number') {
                                    let division = (valor1_30_33 - valor2_30_33);
                                    worksheet.getCell(`${columna}35`).value = validarValor(division.toFixed(0));
                                }
                            }

                            // worksheet.getCell(`L37`).value = validarValor(((worksheet.getCell(`L36`).value / worksheet.getCell(`L34`).value) * 100).toFixed(0)) + '%';
                            // let total_declinadas = 0;
                            // for (let i = 0; i < columnas.length; i++) {
                            //     let columna = columnas[i];
                            //     total_declinadas = total_declinadas + worksheet.getCell(`${columna}38`).value;
                            // }
                            // worksheet.getCell(`L38`).value = validarValor(total_declinadas);

                             // /////////////////////////// COLUMNA TOTALES ///////////////////////////
                            const filas_total = [26,27,28,30,31,33]; // filas 
                            // const celdas_totales = ["H", "M"];
                            
                            for (let i = 0; i < filas_total.length; i++) {
                                const fila = filas_total[i];
                                let total = 0;

                                columnas.forEach((celda, index) => {
                                    let celda_valor = worksheet.getCell(`${celda}${fila}`).value;
                                    // console.log(celda_valor);
                                    if (typeof celda_valor === 'string' && celda_valor.includes('%')) {
                                        let porcentaje = parseFloat(celda_valor.replace('%', '').trim());
                                        // console.log(porcentaje);
                                        total = total + porcentaje;
                                    } else {
                                        total = total + celda_valor;
                                    }

                                    // console.log(total);
                                    worksheet.getCell(`L${fila}`).value = validarValor(total);
                                });
                            }
                            
                            worksheet.getCell(`L29`).value = validarValor(((worksheet.getCell(`B29`).value + worksheet.getCell(`C29`).value + worksheet.getCell(`D29`).value + worksheet.getCell(`E29`).value + worksheet.getCell(`F29`).value + worksheet.getCell(`G29`).value + worksheet.getCell(`H29`).value + worksheet.getCell(`I29`).value + worksheet.getCell(`J29`).value + worksheet.getCell(`K29`).value) / 10).toFixed(0));
                            worksheet.getCell(`L32`).value = validarValor(((worksheet.getCell(`L31`).value / worksheet.getCell(`L30`).value) * 100).toFixed(0)) + '%'; 
                            worksheet.getCell(`L34`).value = validarValor(((worksheet.getCell(`L33`).value / worksheet.getCell(`L31`).value) * 100).toFixed(0)) + '%'; 
                            worksheet.getCell(`L35`).value = validarValor(((parseInt(worksheet.getCell(`B35`).value) + parseInt(worksheet.getCell(`C35`).value) + parseInt(worksheet.getCell(`D35`).value) + parseInt(worksheet.getCell(`E35`).value) + parseInt(worksheet.getCell(`F35`).value) + parseInt(worksheet.getCell(`G35`).value) + parseInt(worksheet.getCell(`H35`).value) + parseInt(worksheet.getCell(`I35`).value) + parseInt(worksheet.getCell(`J35`).value) + parseInt(worksheet.getCell(`K35`).value))).toFixed(0));
                            // worksheet.getCell(`N38`).value = validarValor(((worksheet.getCell(`N33`).value - worksheet.getCell(`N36`).value) * 100)); 

                        } else {
                            const rows = [
                                { total_pap: 'Meta Ventas', '10:00': mv_10, '11:00': mv_11, '12:00': mv_12, '13:00': mv_13, '14:00': mv_14, '15:00': mv_15, '16:00': mv_16, '17:00': mv_17, '18:00': mv_18, '19:00': mv_19, total: total_mv },
                                { total_pap: 'Meta Autenticadas', '10:00': validarValor(maut_10), '11:00': validarValor(maut_11), '12:00': validarValor(maut_12), '13:00': validarValor(maut_13), '14:00': validarValor(maut_14), '15:00': validarValor(maut_15), '16:00': validarValor(maut_16), '17:00': validarValor(maut_17), '18:00': validarValor(maut_18), '19:00': validarValor(maut_19), total: validarValor(total_maut) },
                                { total_pap: 'Meta Pre creadas', '10:00': mpc_10, '11:00': mpc_11, '12:00': mpc_12, '13:00': mpc_13, '14:00': mpc_14, '15:00': mpc_15, '16:00': mpc_16, '17:00': mpc_17, '18:00': mpc_18, '19:00': mpc_19, total: total_mpc },
                                // { total_pap: '%', '10:00': validarValor(porpc_10) + '%', '11:00': validarValor(porpc_11) + '%', '12:00': validarValor(porpc_12) + '%', '13:00': validarValor(porpc_13) + '%', '14:00': validarValor(porpc_14) + '%', '15:00': validarValor(porpc_15) + '%', '16:00': validarValor(porpc_16) + '%', '17:00': validarValor(porpc_17) + '%', '18:00': validarValor(porpc_18) + '%', '19:00': validarValor(porpc_19) + '%', total: validarValor(total_pormp) + '%' },
                                { total_pap: 'WS', '10:00': ws_10, '11:00': ws_11, '12:00': ws_12, '13:00': ws_13, '14:00': ws_14, '15:00': ws_15, '16:00': ws_16, '17:00': ws_17, '18:00': ws_18, '19:00': ws_19, total: validarValor(total_ws.toFixed(0)) },
                                { total_pap: 'Ventas', '10:00': ventas_10, '11:00': ventas_11, '12:00': ventas_12, '13:00': ventas_13, '14:00': ventas_14, '15:00': ventas_15, '16:00': ventas_16, '17:00': ventas_17, '18:00': ventas_18, '19:00': ventas_19, total: total_ventas },
                                { total_pap: 'AU', '10:00': au_10, '11:00': au_11, '12:00': au_12, '13:00': au_13, '14:00': au_14, '15:00': au_15, '16:00': au_16, '17:00': au_17, '18:00': au_18, '19:00': au_19, total: total_aut },
                                { total_pap: '% AU', '10:00': porau_10.toFixed(0) + '%', '11:00': porau_11.toFixed(0) + '%', '12:00': porau_12.toFixed(0) + '%', '13:00': porau_13.toFixed(0) + '%', '14:00': porau_14.toFixed(0) + '%', '15:00': porau_15.toFixed(0) + '%', '16:00': porau_16.toFixed(0) + '%', '17:00': porau_17.toFixed(0) + '%', '18:00': porau_18.toFixed(0) + '%', '19:00': porau_19.toFixed(0) + '%', total: validarValor(total_porau.toFixed(0)) + '%' },
                                { total_pap: 'Pre creadas', '10:00': pc_10, '11:00': pc_11, '12:00': pc_12, '13:00': pc_13, '14:00': pc_14, '15:00': pc_15, '16:00': pc_16, '17:00': pc_17, '18:00': pc_18, '19:00': pc_19, total: total_pre },
                                { total_pap: '% AR', '10:00': porar_10.toFixed(0) + '%', '11:00': porar_11.toFixed(0) + '%', '12:00': porar_12.toFixed(0) + '%', '13:00': porar_13.toFixed(0) + '%', '14:00': porar_14.toFixed(0) + '%', '15:00': porar_15.toFixed(0) + '%', '16:00': porar_16.toFixed(0) + '%', '17:00': porar_17.toFixed(0) + '%', '18:00': porar_18.toFixed(0) + '%', '19:00': porar_19.toFixed(0) + '%', total: validarValor(total_porar.toFixed(0)) + '%' },
                                { total_pap: 'Declinadas', '10:00': dec_10, '11:00': dec_11, '12:00': dec_12, '13:00': dec_13, '14:00': dec_14, '15:00': dec_15, '16:00': dec_16, '17:00': dec_17, '18:00': dec_18, '19:00': dec_19, total: total_dec }
                            ];

                            rows.forEach((row, rowIndex) => {
                                const newRow = worksheet.addRow([
                                    row.total_pap, row['10:00'], row['11:00'], row['12:00'], row['13:00'], row['14:00'], row['15:00'], row['16:00'], row['17:00'], row['18:00'], row['19:00'], row.total
                                ]);
                                newRow.commit(); 
                            });

                            // ///////////////////////// FILA DECLINADAS ///////////////////////////
                            const celdas = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
                            if (nombre_tabla == 'PAP ITQ') {
                                let total_dec_itq = 0;
                                celdas.forEach((celda, index) => {
                                    // console.log(celda_valor);
                                    worksheet.getCell(`${celda}11`).value = worksheet.getCell(`${celda}6`).value - worksheet.getCell(`${celda}9`).value;
                                    total_dec_itq = total_dec_itq + worksheet.getCell(`${celda}11`).value;
                                });
                                worksheet.getCell(`L11`).value = total_dec_itq;
                            } else {
                                let total_dec_its = 0;
                                celdas.forEach((celda, index) => {
                                    // console.log(celda_valor);
                                    worksheet.getCell(`${celda}23`).value = worksheet.getCell(`${celda}18`).value - worksheet.getCell(`${celda}21`).value;
                                    total_dec_its = total_dec_its + worksheet.getCell(`${celda}23`).value;
                                });
                                worksheet.getCell(`L23`).value = total_dec_its;
                            }                           
                            // /////////////////////////// FILA DECLINADAS ///////////////////////////

                        }                        
            
                        if (rowStart !== 25) {
                            worksheet.addRow([]);  // Añadir una fila vacía de separación entre tablas
                        }
                    }
                } catch (error) {
                    res.status(500).send({ error: error.message });
                }
            }
        }

        setTimeout(() => {
            addTableData(1, 1, "PAP ITQ", 1);
            setTimeout(() => {
                addTableData(13, 1, "PAP ITS", 5);
                setTimeout(() => {
                    addTableData(25, 1, "TOTAL PAP", 5);
                    if (tabla == "TOTAL PAP" && nombre == "XSELL") {
                        setTimeout(() => {
                            aplicarEstilos(worksheet, workbook, res, tabla, nombre)
                        }, 1000);    
                    } else {
                        aplicarEstilos(worksheet, workbook, res, tabla, nombre)
                    }
                }, 1000);
            }, 1000);
        }, 1000);
             
        
    }

    // Crear las hojas
    // const names = ["ECS", "XSELL"];
    const names = ["XSELL"];
    names.forEach(nombre => {
        const worksheet = workbook.addWorksheet(nombre);
        fillSheet(worksheet, nombre, workbook);        
    });
  },
};

function aplicarEstilos(worksheet, workbook, res, nombre_tabla, nombre) {
    //**** Aplicar estilos ****
    // Centrar el contenido de todas las celdas en la hoja
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    });

    // Definir bordes
    const borderStyle = {
        top: { style: 'thin', color: { argb: '2e86c1' } },
        left: { style: 'thin', color: { argb: '2e86c1' } },
        bottom: { style: 'thin', color: { argb: '2e86c1' } },
        right: { style: 'thin', color: { argb: '2e86c1' } }
    };

    // Aplicar bordes a un rango de celdas (A1 a Q38)
    for (let i = 1; i <= 35; i++) {
        for (let j = 1; j <= 12; j++) {
            const cell = worksheet.getCell(i, j); // Obtener la celda por fila y columna
            cell.font = { name: 'Calibri', size: 11 }; //color: { argb: '002060' } };
            cell.border = borderStyle; 
        }
    }

    const celdas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    // Recorrer el arreglo para aplicar estilos
    for (let i = 1; i <= 35; i++) {
        celdas.forEach((celda, index) => {
            if (celda == 'A' || celda == 'L') { // Estilos para columna A, H y M con fondo azul
                if (i > 1 && i < 12) {
                    // if (celda == 'A' ||) { //La celda A no pintar de verde o rojo por que son nombres
                        worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 12, bold: true, color: { argb: '002060' } };
                        worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DEEBF7' } };
                } else if (i > 13 && i < 24) {
                        worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 12, bold: true, color: { argb: '002060' } };
                        worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DEEBF7' } };
                } else if (i > 25 && i < 36) {
                        worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 12, bold: true, color: { argb: '002060' } };
                        worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DEEBF7' } };
                }
            } 

            if (i == 1 || i == 13 || i == 25) { //Encabezados de cada tabla 
                worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 12, bold: true, color: { argb: '081d2a' } };
                worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0070C0' } };
            } 

            if (celda == 'A' || celda == 'L') { // Estilos para celdas con el color de letra blanco
                if (i == 1 || i == 13 || i == 25) { 
                    worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'DEEBF7' } };
                    worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '203864' } };
                }
            }

            // if (celda !== 'A') {
            //     if (i == 16 || i == 18 || i == 29 || i == 31) { 
            //         const celda_valor = worksheet.getCell(`${celda}${i}`);
            //         // console.log('Valor de A1:', celda_valor.value);

            //         if (typeof celda_valor.value === 'string' && celda_valor.value.includes('%')) {
            //             const porcentaje = parseFloat(celda_valor.value.replace('%', '').trim());
            //             // console.log(porcentaje);
            //             if (porcentaje >= 100) {
            //                 // console.log('verde');
            //                 worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 11, color: { argb: '0a690c' } };
            //                 worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c6efce' } };
                            
            //             } else {
            //                 // console.log('rojo');
            //                 worksheet.getCell(`${celda}${i}`).font = { name: 'Calibri', size: 11, color: { argb: 'ca2920' } };
            //                 worksheet.getCell(`${celda}${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffc7ce' } };
            //             }
            //         }
            //     }
            // }

        });
    }

    if (nombre_tabla == "TOTAL PAP" && nombre == "XSELL") {
        guardarArchivo(workbook, res);
    }
}

function guardarArchivo(workbook, res) {
    // Guardar el archivo
    const outputPath = path.join(__dirname, "..", 'assets/docs', 'Reporte_Corto_Sofom.xlsx');
    workbook.xlsx.writeFile(outputPath)
        .then(() => {
            console.log('Archivo guardado como Reporte_Corto_Sofom.xlsx');
            // res.json({ status: 200, rspta: "MAILS SENT" });
        })
        .catch(err => {
            console.error('Error al guardar el archivo:', err);
        });
        enviarCorreo(res);
}

async function enviarCorreo(res) {
    const filePath = path.join(
    __dirname,
    "..",
    "assets/docs",
    "Reporte_Corto_Sofom.xlsx"
    );

    const mails = await actionsMysql.mailsAsistencia(5);
    if (mails.length == 0) {
        console.log("Reporte no enviado, sin remitentes para este correo");
        res.json({
            status: 200,
            rspta: "Reporte no enviado, sin remitentes para este correo",
        });
    } else {
        const emailAddresses = mails.map((emailObj) => emailObj.MAILS);
        const emailString = emailAddresses.join(",");

        const mailOptions = {
            to: emailString,
            subject: "Reporte Corto Sofom",
            html: "Reporte Corto Sofom",
            attachments: [
            {
                filename: "Reporte_Corto_Sofom.xlsx",
                path: filePath,
            },
            ],
        };

        let nObjMailer = await actMailer.createObjMailer(mailOptions);

        if (nObjMailer == 200) {
            console.log("Reporte enviado: ", nObjMailer);
            await actionsMysql.saveLogCron("REPORTE CORTO", 1);
            res.json({ status: 200, rspta: "MAILS SENT" });
        } else {
            await actionsMysql.saveLogCron("REPORTE CORTO", 0);
            console.log("Error al enviar reporte : ", nObjMailer);
            res.send("Error al enviar reporte");
        }
    }
}

function validarValor(valor) {
    if (Number.isNaN(valor) || valor === Infinity || valor === -Infinity || valor === 'Infinity' || valor === 'NaN') {
      return 0;
    }
    return valor;
  }
  

module.exports = { reporteCortoSofom };

