const oracledb = require("oracledb");

const { actionsMysql } = require("../model/model-mysql");
const { createObjectCsvStringifier } = require('csv-writer');

async function oraExcProc(data) {  
  let connection, parameters, bindVars;

  connection = await oracledb.getConnection({
    user: data.dbConfig.user,
    password: data.dbConfig.pass,
    connectString: data.dbConfig.connectString,
  })

  if (data.parameters == null || data.parameters == undefined) {
    parameters = ":rc";
    bindVars = {
      rc: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    };
  } else {
    parameters = `:${Object.keys(data.parameters).join(", :")} ,:rc`;
    bindVars = data.parameters;
    bindVars.rc = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };
  }

  try {
    let result = await connection.execute(`BEGIN ${data.scheme}.${data.nameProcedure}(${parameters}); END;`, bindVars );

    let resultSet = result.outBinds.rc;

    let rows = [];
    let row;
    while ((row = await resultSet.getRow())) {rows.push(row); }
    return rows;
  } catch (err) {    
    // return 0    
    console.log(err)
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw new Error("Error al cerrar la conexión: " + err.message);
      }
    }
  }
}

async function oraExcProcNoCursor (data) {
  let connection, parameters, bindVars;
  connection = await oracledb.getConnection({
    user: data.dbConfig.user,
    password: data.dbConfig.pass,
    connectString: data.dbConfig.connectString,
  });
  parameters = `:${Object.keys(data.parameters).join(", :")} `;
  bindVars = data.parameters;   
  try {
    await connection.execute(`BEGIN ${data.scheme}.${data.nameProcedure}(${parameters}); END;`, bindVars );
    return 'procedimiento ejecutado';
  } catch (err) {    
    return err
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw new Error("Error al cerrar la conexión: " + err.message);
      }
    }
  }
}
//?  QUery con encabezados------------------------------------------------------------------------------------------

// async function oraExcProc2(data) {  
//     let connection, parameters, bindVars;
  
//     connection = await oracledb.getConnection({
//       user: data.dbConfig.user,
//       password: data.dbConfig.pass,
//       connectString: data.dbConfig.connectString,
//     })
  
//     if (data.parameters == null || data.parameters == undefined) {
//       parameters = ":rc";
//       bindVars = {
//         rc: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//       };
//     } else {
//       parameters = `:${Object.keys(data.parameters).join(", :")} ,:rc`;
//       bindVars = data.parameters;
//       bindVars.rc = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };
//     }
  
//     try {
//       let result = await connection.execute(`BEGIN ${data.scheme}.${data.nameProcedure}(${parameters}); END;`, bindVars );
  
//       let resultSet = result.outBinds.rc;
  
//       let rows = [];
//       let row;
//       let metaData = resultSet.metaData.map(column => column.name); // Obtener los nombres de las columnas
//       while ((row = await resultSet.getRow())) {
//         let rowData = {};
//         for (let i = 0; i < metaData.length; i++) {
//           rowData[metaData[i]] = row[i];
//         }
//         rows.push(rowData); 
//       }
//       return rows; // Devolver un arreglo de objetos con los datos
//     } catch (err) {   
//       console.log(err) 
//       return []; // Devolver un arreglo vacío en caso de error
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           throw new Error("Error al cerrar la conexión: " + err.message);
//         }
//       }
//     }
//   }

async function oraExcProc2(data, stream) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: data.dbConfig.user,
      password: data.dbConfig.pass,
      connectString: data.dbConfig.connectString,
    });

    const parameters = data.parameters
      ? `:${Object.keys(data.parameters).join(", :")}, :rc`
      : ":rc";

    const bindVars = data.parameters || {};
    bindVars.rc = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };

    const result = await connection.execute(
      `BEGIN ${data.scheme}.${data.nameProcedure}(${parameters}); END;`,
      bindVars
    );

    const resultSet = result.outBinds.rc;

    const metaData = resultSet.metaData.map(col => col.name);
    const csvStringifier = createObjectCsvStringifier({
      header: metaData.map(key => ({ id: key, title: key }))
    });

    // Escribir cabeceras
    stream.write(csvStringifier.getHeaderString());

    let rows = [];
    const batchSize = 500; // Ajustable

    let row;
    while ((row = await resultSet.getRow())) {
      const rowObj = {};
      for (let i = 0; i < metaData.length; i++) {
        rowObj[metaData[i]] = row[i] ?? ''; // Evitar nulls
      }

      rows.push(rowObj);

      if (rows.length === batchSize) {
        const csvChunk = csvStringifier.stringifyRecords(rows);
        if (!stream.write(csvChunk)) {
          await new Promise(resolve => stream.once('drain', resolve));
        }
        rows = [];
      }
    }

    // Escribe lo último
    if (rows.length > 0) {
      const csvChunk = csvStringifier.stringifyRecords(rows);
      stream.write(csvChunk);
    }

    await resultSet.close();
    return true;

  } catch (err) {
    console.error("Error en oraExcProc2Streaming:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar conexión Oracle:", err);
      }
    }
  }
}



  async function oraExcQuery(campaign,data) {  
    const oracleCredentials = await actionsMysql.credentialsOra(campaign);
 
    const connectString = process.env.NODE_ENV === "development" ? "172.20.1.35/XE" : "192.168.1.14/xccmtaf";
    const {NAME,PASS,SCHEMA} = { ...oracleCredentials[0] };

    let connection = await oracledb.getConnection({
      user: NAME,
      password: PASS,
      connectString: connectString,
    })   
    
    try {
      const sql = data;
      const result = await connection.execute(sql);          
      const columnNames = result.metaData.map(meta => meta.name);
      const rows = result.rows.map(row => {
        let rowObject = {};
        columnNames.forEach((columnName, index) => {
        rowObject[columnName] = row[index];
      });
      return rowObject;
      })
      
      return rows;

    } catch (err) {    
      // console.log(err)
      return [{STATUS: 0,error:"NOT WORKING"}]; // Devolver un arreglo vacío en caso de error
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          throw new Error("Error al cerrar la conexión: " + err.message);
        }
      }
    }
  }







const createConnObj = async (campaign,nameProcedure,parameters) => {  
  const oracleCredentials = await actionsMysql.credentialsOra(campaign);
  const connectString = process.env.NODE_ENV === "development" ? "127.0.0.1/xe" : "127.0.0.1/xe";
  
  let data;
  
  if (oracleCredentials.length == 0) {
    return false

  }else {        
    const {NAME,PASS,SCHEMA} = { ...oracleCredentials[0] };


    data = {
      dbConfig: {
        user: NAME,
        pass: PASS,
        connectString: connectString,
      },
      scheme: SCHEMA,      
      nameProcedure: nameProcedure,
    };


    if (parameters != null || parameters != undefined) {      
      data.parameters = parameters
    }
  }
  return data
}


module.exports = {
  oraExcProc,
  oraExcProcNoCursor,
  createConnObj,
  oraExcProc2,
  oraExcQuery
};
