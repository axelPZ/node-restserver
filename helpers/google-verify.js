
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIEND_ID );

const googleVerify = async( idToken = '' )=> {

  const ticket = await client.verifyIdToken({

      idToken,
      audience: process.env.GOOGLE_CLIEND_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  //toda la informaccion del usario
    //const payload = ticket.getPayload();

  //extraer solo la informacion que necesitamos
    // cambiar de nombre al momento de hacer la destructuracion
    const { name: nombre,
            picture: img,
            email: correo } = ticket.getPayload();

  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  return { nombre, img, correo };
}

module.exports = {
    googleVerify
}