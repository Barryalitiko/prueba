const { PREFIX } = require("../../config");

module.exports = {
  name: "etiquetarAdmins",
  description: "Menciona a todos los administradores del grupo.",
  commands: ["etiquetarAdmins", "tagAdmins"],
  usage: `${PREFIX}etiquetarAdmins`,
  handle: async ({ sendReply, socket, remoteJid }) => {
    try {
      // Obtener los metadatos del grupo
      const groupMetadata = await socket.groupMetadata(remoteJid);

      // Filtrar solo los administradores
      const admins = groupMetadata.participants.filter(
        (participant) => participant.admin === "admin" || participant.admin === "superadmin"
      );

      if (admins.length === 0) {
        return sendReply("No hay administradores en este grupo.");
      }

      // Construir el mensaje
      const message = `👻 Krampus.bot 👻 Aquí están los administradores del grupo:\n` + admins.map((admin, index) => `${index + 1}. @${(link unavailable).split("@")[0]}`).join("\n");

      // Enviar el mensaje con las menciones
      await sendReply(message, { mentions: admins.map((admin) => (link unavailable)) });
    } catch (error) {
      console.error("Error etiquetando a los administradores:", error);
      sendReply("Ocurrió un error al intentar etiquetar a los administradores.");
    }
  },
};
