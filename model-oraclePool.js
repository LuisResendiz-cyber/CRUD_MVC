// queries.js
const db = require("../config/db-oraclePool");
const oracledb = require("oracledb");

async function executeQuery(sql) {
  let connection;

  try {
    await db.initPool();

    const pool = db.getPool();
    connection = await pool.getConnection();
    const result = await connection.execute(sql);
    return result.rows;
  } catch (error) {
    throw new Error("Error executing query: " + error.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error al cerrar la conexión:", error);
      }
    }
  }
}

async function execProcedure(data) {
  
  let parameters
  let bindVars

  if (data.parameters == null || data.parameters == undefined) {    
    parameters = ':rc';
    bindVars = {
      rc: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    };
  } else {    
    parameters = `:${Object.keys(data.parameters).join(', :')} ,:rc`;  
    bindVars = data.parameters;
    bindVars.rc = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };
  }

  let connection;
  try {
    await db.initPool();
    const pool = db.getPool();
    connection = await pool.getConnection();    
    let result = await connection.execute( `BEGIN ${data.scheme}.${data.nameProcedure}(${parameters}); END;`,  bindVars )      

    let resultSet = result.outBinds.rc;
    let rows = [];
    let row;
    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }    
    // if (rows.length === 0) {
    //   console.log("El resultado de la base de datos está vacío.");
    //   return 0
    // }

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error al cerrar la conexión:", error);
      }
    }
    await db.closePool();
  }
}

module.exports = {
  executeQuery,
  execProcedure,
};
