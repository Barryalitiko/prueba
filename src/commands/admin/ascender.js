const { PREFIX } = require("../../config");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un usuario como administrador.",
  commands: ["admin"],
  usage: `${PREFIX}admin promote/demote @usuario`,
  handle: async ({ args, socket, remoteJid, sendReply, sendReact }) => {
    if (args.length < 2) {
      return sendReply(`Uso incorrecto. Usa:\n${PREFIX}admin promote/demote @usuario`);
    }

    const action = args[0].toLowerCase(); // Acción: "promote" o "demote"
    const userJid = args[1].replace("@", "").replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Verificar que la acción sea válida
    if (!["promote", "demote"].includes(action)) {
      return sendReply("Acción inválida. Usa 'promote' para dar admin o 'demote' para quitar admin.");
    }

    try {
      await sendReact("⏳"); // Reacción mientras procesa

      // Realizar la acción correspondiente
      if (action === "promote") {
        await socket.groupParticipantsUpdate(remoteJid, [userJid], "promote");
        await sendReply(`@${args[1]} ahora es administrador del grupo.`);
      } else if (action === "demote") {
        await socket.groupParticipantsUpdate(remoteJid, [userJid], "demote");
        await sendReply(`@${args[1]} ya no es administrador del grupo.`);
      }

      await sendReact("✅"); // Reacción de éxito
    } catch (error) {
      console.error("Error al cambiar permisos de administrador:", error);
      await sendReact("❌");
      await sendReply("Ocurrió un error al intentar cambiar los permisos de administrador.");
    }
  },
};