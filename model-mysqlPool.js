const pool = require("../config/db-mysql");

const actionsMysql = {
  validarConexion: async () => {
    try {
      const [rows] = await pool.query("SELECT 1");
      return true; // Si la consulta es exitosa, devuelve true
    } catch (error) {
      console.error("Error validando la conexión:", error);
      throw new Error("No se pudo establecer la conexión con la base de datos");
    }
  },
  credencialesSms: async (campana) => {    
    const [rows] = await pool.query(`SELECT * FROM itachi.CREDENCIALES_SMS WHERE CAMPANA = ${campana} AND ACTIVO = 1 ORDER BY ID_CREDENCIALES  ASC`)
    return rows
  },
  smsScotiabank: async (campana) => {    
    const [rows] = await pool.query(`select * from itachi.SMS_SCOTIABANK where ACTIVO =1`)
    return rows
  },
  saveLogSms: async(campana,result,tipo = 'INDIVIDUAL', proveedor) => {
    await pool.query(`INSERT INTO itachi.LOG_SMS (CAMPANA,RESULTADO,TIPO, PROVEEDOR) VALUES ('${campana}','${result}','${tipo}', '${proveedor}')`);
    
  },
  credentialsOra : async(campaign) => {
    const [rows] = await pool.query(`SELECT * FROM itachi.CREDENTIALS_ORACLE WHERE ID_CAMPAIGN = ${campaign} AND ACTIVO = 1 `)
    return rows
  }
};

module.exports = {
  actionsMysql
};

