const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { getProfileImageData } = require("../../utils/loadCommonFunctions"); // Asegúrate de que la ruta sea correcta
const fs = require("fs");

module.exports = {
  name: "profilepic",
  description: "Envía la foto de perfil de un usuario respondido o etiquetado.",
  commands: ["profilepic"],
  usage: `${PREFIX}pfp`,
  handle: async ({ webMessage, socket, sendText, sendReact, remoteJid }) => {
    // Verifica si el mensaje tiene una respuesta o menciona a un usuario
    const replyMessage = webMessage?.quotedMessage;
    const mentionedJids = webMessage?.mentionedJidList;
    
    let userJid = null;

    if (replyMessage) {
      // Si es una respuesta, obtenemos el JID del usuario al que se respondió
      userJid = replyMessage?.sender?.user;
    } else if (mentionedJids && mentionedJids.length > 0) {
      // Si se menciona a un usuario, usamos el primer JID mencionado
      userJid = mentionedJids[0];
    } else {
      // Si no se responde ni se menciona a nadie, enviamos un mensaje de error
      await sendText("⚠️ Para obtener la foto de perfil, por favor responde a un mensaje o menciona a un usuario.");
      return;
    }

    try {
      // Hacer que el bot reaccione con el emoji de cámara
      await sendReact("📸", webMessage.key);  // Reacción al mensaje original

      // Obtenemos la foto de perfil del usuario
      const { buffer, profileImage } = await getProfileImageData(socket, userJid);
      
      // Si no se encuentra la foto de perfil o no es accesible, usamos la imagen predeterminada
      const imageBuffer = profileImage ? buffer : fs.readFileSync("prueba/assets/images/default-user.png");

      // Enviar la foto de perfil
      await socket.sendMessage(remoteJid, {
        image: imageBuffer,
        caption: `Aquí está la foto de perfil de @${userJid.split('@')[0]}.`,
        mentions: [userJid],
      });
    } catch (error) {
      await sendText("❌ No se pudo obtener la foto de perfil.");
    }
  },
};