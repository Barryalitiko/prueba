const { PREFIX } = require("../../config");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "randommention",
  description: "Mencionar a una persona aleatoria junto con un mensaje.",
  commands: ["randommention", "sx"],
  usage: `${PREFIX}randommention`,
  handle: async ({ socket, remoteJid, senderJid, sendMedia, sendReact }) => {
    try {
      // Obtener información del grupo
      const { participants } = await socket.groupMetadata(remoteJid);

      // Filtrar los participantes (excluir al bot y admins si es necesario)
      const userJids = participants.map(({ id }) => id).filter((id) => id !== senderJid);

      // Seleccionar un usuario aleatorio
      const randomUser = userJids[Math.floor(Math.random() * userJids.length)];

      // Ruta de la imagen
      const imagePath = path.resolve(__dirname, "../../assets/images/20042632.gif");

      // Verificar que la imagen exista
      if (!fs.existsSync(imagePath)) {
        throw new Error("La imagen no se encuentra en la ruta especificada.");
      }

      // Construir el mensaje
      const message = `@${senderJid.split("@")[0]} te ha mandado un beso a ti, @${randomUser.split("@")[0]} ❤️`;

      // Enviar el mensaje con la imagen y las menciones
      await sendMedia(imagePath, "image/gif", message, [senderJid, randomUser]);

      // Reaccionar con el emoji 🔞
      await sendReact("🔞");
    } catch (error) {
      console.error("Error en el comando randommention:", error);
    }
  },
};