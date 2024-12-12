const { isUserMuted } = require("../utils/database");

module.exports = async (socket, message) => {
  const { remoteJid, participant, fromMe, id } = message.key;
  
  if (!fromMe && (await isUserMuted(remoteJid, participant))) {
    try {
      await socket.sendMessage(remoteJid, {
        delete: { remoteJid, id, participant },
      });
    } catch (error) {
      console.error(`Error eliminando mensaje de usuario silenciado: ${error.message}`);
    }
  }
};