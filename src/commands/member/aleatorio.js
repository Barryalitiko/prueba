const { PREFIX } = require("../../config");

module.exports = {
  name: "aleatorio",
  description: "Menciona a un miembro del grupo al azar.",
  commands: ["aleatorio", "random"],
  usage: `${PREFIX}aleatorio`,
  handle: async ({ socket, remoteJid, sendReply, sendReact }) => {
    try {
      // Obtén la lista de participantes del grupo
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participants = groupMetadata.participants;

      // Verifica si hay participantes en el grupo
      if (participants.length === 0) {
        return sendReply("👻 Krampus.bot 👻 No hay participantes en este grupo.");
      }

      // Selecciona un participante al azar
      const randomIndex = Math.floor(Math.random() * participants.length);
      const randomParticipant = participants[randomIndex].id;

      // Envía la mención al participante
      await sendReact("🎲");
      await sendReply(`¡Mencionando a alguien al azar! 🎲\n@${randomParticipant.split("@")[0]}`, [randomParticipant]);
    } catch (error) {
      console.error("Error en el comando aleatorio:", error);
      await sendReply("👻 Krampus.bot 👻 Hubo un error al intentar mencionar a alguien.");
    }
  },
};