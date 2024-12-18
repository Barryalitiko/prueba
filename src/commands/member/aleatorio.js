const { PREFIX, ASSETS_DIR } = require("../../config");
const path = require("path");

module.exports = {
  name: "beso",
  description: "Envía un beso a una persona aleatoria.",
  commands: ["beso", "sx"],
  usage: `${PREFIX}beso`,
  handle: async ({
    sendText,
    sendImageFromFile,
    socket,
    remoteJid,
    sendReact,
    userJid,
  }) => {
    // Obtener participantes del grupo
    const { participants } = await socket.groupMetadata(remoteJid);
    const mentions = participants.map(({ id }) => id);

    // Elegir al azar a alguien para enviarle el beso
    const randomIndex = Math.floor(Math.random() * participants.length);
    const randomUser = participants[randomIndex];

    // Reacción del bot con el emoji 🔞
    await sendReact("🔞");

    // Enviar el mensaje con la etiqueta de la persona que usó el comando + la persona aleatoria y el GIF
    await sendImageFromFile(
      path.join(ASSETS_DIR, "images", "20042632.gif"), 
      `@${userJid.split("@")[0]} te ha mandado un beso 😘\nY @${randomUser.id.split("@")[0]} también recibe un beso!`, 
      mentions
    );
  },
};