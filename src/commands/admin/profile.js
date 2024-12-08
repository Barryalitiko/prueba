const { getProfileImageData } = require("../services/baileys");
const { onlyNumbers } = require("../utils");

module.exports = {
  name: "profilepic",
  description: "Envía la foto de perfil de un usuario respondido.",
  commands: ["profilepic"],
  usage: `${PREFIX}pfp`,
  handle: async ({ webMessage, socket, sendText, sendReact, remoteJid }) => {
    // Verifica si el mensaje tiene una respuesta
    const replyMessage = webMessage?.quotedMessage;

    if (!replyMessage) {
      await sendText("⚠️ Para obtener la foto de perfil, por favor responde a un mensaje.");
      return;
    }

    // Extraemos el JID (identificador único) del usuario al que se respondió
    const userJid = replyMessage?.sender?.user;

    try {
      // Obtenemos la foto de perfil del usuario
      const { buffer, profileImage } = await getProfileImageData(socket, userJid);

      // Enviar la foto de perfil
      await socket.sendMessage(remoteJid, {
        image: buffer,
        caption: `Aquí está la foto de perfil de @${onlyNumbers(userJid)}.`,
        mentions: [userJid],
      });
    } catch (error) {
      await sendText("❌ No se pudo obtener la foto de perfil.");
    }
  },
};
