const nodemailer = require('nodemailer')
const configMail = require('../config/smtpConfig.json')

const actMailer = {

  createObjMailer : async (mailOptions) => {

    if(!mailOptions){
      return 'Falta el objeto mailOptions'
    }
    let transporter = nodemailer.createTransport(configMail.configMail)    
    mailOptions.from = configMail.mailOptions.from    

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado: ' + info.response);      
      return 200
    } catch (error) {
      // console.error('Error al enviar el correo:', error);
      return(error)
    }
    
  },
  createObjMailerDigital : async (mailOptions) => {

    if(!mailOptions){
      return 'Falta el objeto mailOptions'
    }
    let transporter = nodemailer.createTransport(configMail.configMailDigital)    
    mailOptions.from = configMail.mailOptionsDigital.from    
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado: ' + info.response);
      // return (info.response)
      return 200
    } catch (error) {
      // console.error('Error al enviar el correo:', error);
      return(error)
    }
    
  },

  createObjMailerRetardos : async (mailOptions) => {
    if(!mailOptions){
      return 'Falta el objeto mailOptions'
    }

    let transporter = nodemailer.createTransport(configMail.configMail)    
    mailOptions.from = configMail.mailOptions.from    

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado: ' + info.response);      
      return 200
    } catch (error) {
      // console.error('Error al enviar el correo:', error);
      return(error)
    }
    
  },


}

module.exports = actMailer