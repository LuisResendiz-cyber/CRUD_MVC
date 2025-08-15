const axios = require("axios");
const https = require("https");

const enviarSMS = async (creSMS, message, tel) => {
  if (!creSMS || !message || !tel) {
    return {
      status: 400,
      desc: "Faltan parámetros requeridos",
      proveedor: null,
    };
  }

  for (const proveedor of creSMS) {
    try {
      switch (proveedor.PROVEEDOR) {
        case "VOICES": {
          const credenciales = [proveedor.USER, proveedor.PASS];
          const respuesta = await smsVoices(credenciales, message, tel);
          console.log(respuesta);
          return {
            status: respuesta.code,
            desc: respuesta,
            proveedor: proveedor.PROVEEDOR,
          };
        }
        case "MERCURIO": {
          let data = {
            U: proveedor.USER, //Users
            P: proveedor.PASS, //pass
            K: proveedor.TOKEN, //key
            T: tel, //phone
            M: message, //message
          };
          let respuesta = await smsMercurio(data);
          console.log(respuesta);
          return {
            status: respuesta.code,
            desc: respuesta,
            proveedor: proveedor.PROVEEDOR,
          };
        }
        case "GEPARD": {
          let data = {
            U: proveedor.USER, //Users
            P: proveedor.PASS, //pass
            K: proveedor.TOKEN, //key
            T: tel, //phone
            M: message, //message
          };
          let respuesta = await smsGepard(data);
          console.log(respuesta);

          return {
            status: respuesta.code,
            desc: respuesta,
            proveedor: proveedor.PROVEEDOR,
          };
        }
        case "DIRECTO": {
          let data = {
            to: tel,
            username: proveedor.USER,
            password: proveedor.PASS,
            token: proveedor.TOKEN,
            message: message,
          };
          let respuesta = await smsDirecto(data);
          console.log(respuesta);
          return {
            status: respuesta.code,
            desc: respuesta,
            proveedor: proveedor.PROVEEDOR,
          };
        }
        case "DIRECTO_2": {
          let data = {
            to: tel,
            username: proveedor.USER,
            password: proveedor.PASS,
            token: proveedor.TOKEN,
            message: message,
          };
          let respuesta = await smsDirecto(data);
          console.log(respuesta);
          return {
            status: respuesta.code,
            desc: respuesta,
            proveedor: proveedor.PROVEEDOR,
          };
        }

        default:
          console.log(`Proveedor no soportado: ${proveedor.PROVEEDOR}`);
          continue;
      }
    } catch (error) {
      console.error(`Error con proveedor ${proveedor.PROVEEDOR}:`, error);
    }
  }

  return {
    status: 500,
    desc: "Todos los proveedores fallaron",
    proveedor: null,
  };
};

const smsMasivoDigital = async (credencialesSMS, msjMasivos) => {
  let data = [credencialesSMS[0].USER, credencialesSMS[0].PASS];
  let toSMS = msjMasivos.length;
  for (const element of msjMasivos) {
    try {
      let tel = element[2];
      let message = element[3];
      let sms = await smsVoices(data, message, tel);
      console.log(sms);
    } catch (error) {
      return error;
    }
  }
  return { status: 200, desc: `Total mensajes enviados: ${toSMS} ` };
};

const smsMasivoScotiabank = async (
  oraRspta,
  credencialesSMS,
  smsScotiabank
) => {
  let data = [credencialesSMS[0].USER, credencialesSMS[0].PASS];
  let toSMS = 0;
  let smsEnviados = {
    TOTAL: 0,
    DETALLES: [],
  };

  for (const element of oraRspta) {
    // console.log(element)
    if (element[5]) {
      let objA = {
        SOLICITUD: element[0],
        TEL: element[5],
        CODIGOIVR: element[3],
        PRODUCTO: element[1],
        HORA: element[9],
      };
      const textoCoincidente = buscarTexto(objA, smsScotiabank);
      let message = "";
      if (textoCoincidente !== null) {
        message = textoCoincidente.replace("[DATA]", objA.CODIGOIVR);
      }

      try {
        let sms = await smsVoices(data, message, objA.TEL);
        if (sms.code == 200) {
          toSMS++;
          let nuevoDetalle = {
            SOLICITUD: parseInt(objA.SOLICITUD),
            PRODUCTO: parseInt(objA.PRODUCTO),
            TIPO: 2,
          };
          smsEnviados.DETALLES.push(nuevoDetalle);
        }
        // console.log(sms.code);
      } catch (error) {
        console.log(error);
      }
    }
    smsEnviados.TOTAL = toSMS;
  }
  // return { status: 200, desc: `Total mensajes enviados: ${toSMS} ` };
  return smsEnviados;
};

const smsMasivoHsbc = async (credencialesSMS, msjMasivos) => {
  let data = [credencialesSMS[0].USER, credencialesSMS[0].PASS];
  let toSMS = 0;
  const message =
    "Te invitamos a depositar a tu cuenta HSBC en los proximos 5 dias. No te quedes sin la protección de tu Seguros HSBC";

  for (const element of msjMasivos) {
    try {
      let tel = element[2];

      if (tel != "0") {
        // let sms = await smsVoices(data, message, '9717185016');
        // let sms = await smsVoices(data, message, '4421493199');
        let sms = await smsVoices(data, message, tel);

        if (sms.code == 200) {
          toSMS++;
        }
      }
    } catch (error) {
      return error;
    }
  }
  return { status: 200, desc: `Total mensajes enviados: ${toSMS} ` };
};

const smsMasivoBanamex = async(credencialesSMS,msg,phone) => {

  let data = [credencialesSMS[0].USER, credencialesSMS[0].PASS];
  // console.log(data)
  let sms = await smsVoices(data, msg, phone);
  
  return sms
  
}


const smsVoices = async (data, message, tel) => {
  const url = "https://sms-voices.com.mx:8080/envioSms";
  const params = new URLSearchParams();
  // params.append("user", "desarrollo");
  params.append("user", data[0]);
  // params.append("password", "jxK5HF4W5f");
  params.append("password", data[1]);
  params.append("message", message);
  params.append("number", tel);
  params.append("mask", "NUMERO CORTO");

  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const response = await axios.post(url, params, { httpsAgent: agent });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const smsMercurio = async (creSMS) => {
  const url = "https://www.message-center.com.mx/webresources/Engine/SendMsg";

  const headers = { "Content-Type": "application/json" };
  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const response = await axios.post(url, creSMS, {
      headers,
      httpsAgent: agent,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const smsDirecto = async (creSMS) => {
  const url = `https://smsrp.directo.com/rest/send_sms?from=CARGA&to=52${creSMS.to}&message=${creSMS.message}&username=${creSMS.username}&password=${creSMS.password}`;

  const headers = { Authorization: `Bearer ${creSMS.token}` };

  try {
    // const response = await axios.post(url, { headers });
    //console.log(response.status);
    const response = await axios.post(
      url,
      {},
      {
        // Nota el objeto vacío {} para el body
        headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Ignora certificados no válidos
        }),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
    // return false;
  }
};

const smsGepard = async (creSMS) => {
  const url = "https://gepardapi.com/webresources/Engine/SendMsg";

  const headers = { "Content-Type": "application/json" };
  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const response = await axios.post(url, creSMS, {
      headers,
      httpsAgent: agent,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function buscarTexto(arreglo1, arreglo2) {
  const objetoCoincidente = arreglo2.find((objeto) => {
    return objeto.PRODUCTO == arreglo1.PRODUCTO && objeto.HORA == arreglo1.HORA;
  });
  return objetoCoincidente ? objetoCoincidente.TEXTO : null;
}

module.exports = {
  enviarSMS,
  smsMasivoDigital,
  smsMasivoHsbc,
  smsVoices,
  smsDirecto,
  smsMasivoScotiabank,
  smsMasivoBanamex
};
