const {connItahi,connTocImpulse} = require("../config/db-mysql");

const actionsMysql = {
  validarConexion: async () => {
    const connection = await connItahi(); 
    try {
      const [rows] = await connection.query("SELECT 1");
      return true; // Si la consulta es exitosa, devuelve true
    } catch (error) {
      console.error("Error validando la conexión:", error);
      throw new Error("No se pudo establecer la conexión con la base de datos");
    }finally {
      await connection.end(); // Cerrar la conexión
    }
  },
  credencialesSms: async (campana) => {    
    const connection = await connItahi(); 
    try {
    const [rows] = await connection.query(`SELECT * FROM itachi.CREDENCIALES_SMS WHERE CAMPANA = ${campana} AND ACTIVO = 1 ORDER BY ID_CREDENCIALES  ASC`)
    return rows
      
    } catch (error) {
     console.log(error) 
    }finally {
      await connection.end(); // Cerrar la conexión
    }
  },
  smsScotiabank: async (campana) => {    
    const connection = await connItahi(); 
    try {
    const [rows] = await connection.query(`select * from itachi.SMS_SCOTIABANK where ACTIVO =1`)
    return rows
      
    } catch (error) {
     console.log(error) 
    }finally {
      await connection.end(); // Cerrar la conexión
    }
  },
  mailsAsistencia: async (report) => {    
    const connection = await connItahi(); 
    try {
    const [rows] = await connection.query(`SELECT MAILS FROM itachi.MAILINGS_REPORTS WHERE ACTIVE =1 AND ID_REPORTS = ${report}`)
    return rows
      
    } catch (error) {
     console.log(error) 
    }finally {
      await connection.end(); // Cerrar la conexión
    }
  },
  saveLogSms: async(campana,result,tipo = 'INDIVIDUAL', proveedor) => {
    const resultadoRecortado = result.slice(0, 499);
    const connection = await connItahi(); 
    try {
    await connection.query(`INSERT INTO itachi.LOG_SMS (CAMPANA,RESULTADO,TIPO, PROVEEDOR) VALUES (?,?,?,?)`,[campana,resultadoRecortado,tipo,proveedor]);
      

    } catch (error) {
     console.log(error) 
    }finally {
      await connection.end(); // Cerrar la conexión
    }
    
  },
  saveLogCron: async(proceso,estatus) => {
    const connection = await connItahi(); 
    try {
      await connection.query(`INSERT INTO itachi.LOG_CRON (PROCESO,ESTATUS) VALUES ('${proceso}','${estatus}')`);

    } catch (error) {
     console.log(error) 
    }finally {
      await connection.end(); // Cerrar la conexión
    }
    
  },
  credentialsOra : async(campaign) => {
    const connection = await connItahi(); 
    try {
    const [rows] = await connection.query(`SELECT * FROM itachi.CREDENTIALS_ORACLE WHERE ID_CAMPAIGN = ${campaign} AND ACTIVE = 1 `)
    return rows
      
    } catch (error) {
     console.log(error) 
    }finally {
      await connection.end(); // Cerrar la conexión
    }
  },
// -------------------TOC IMPULSE------------------------------------------------------------  

validarConexionToimp: async () => {
  const connection = await connTocImpulse(); 
  try {
    const [rows] = await connection.query(`SELECT * FROM tocimpul_landingamexsms.telefonos`)
    return rows
  } catch (error) {
    console.error("Error validando la conexión:", error);
    throw new Error("No se pudo establecer la conexión con la base de datos");
  }finally {
    await connection.end(); // Cerrar la conexión
  }
},


ProvSms: async (campana) => {
  const connection = await connItahi(); 
  try {
  const [rows] = await connection.query(`SELECT ID_CREDENCIALES, PROVEEDOR, CAMPANA, ACTIVO FROM itachi.CREDENCIALES_SMS WHERE CAMPANA = ${campana} ORDER by PROVEEDOR ASC ;
  `)
  return rows
    
  } catch (error) {
   console.log(error) 
  }finally {
    await connection.end(); // Cerrar la conexión
  }
},

mailsRetardos: async (centro, report) => {
  const connection = await connItahi(); 
  try {
  const [rows] = await connection.query(`SELECT MAILS FROM itachi.MAILINGS_REPORTS WHERE ACTIVE =1 AND ID_REPORTS = ${report} AND centro= ${centro}`)
  return rows
    
  } catch (error) {
   console.log(error)
  }finally {
    await connection.end(); // Cerrar la conexión
  }
},



};

module.exports = {
  actionsMysql
};

