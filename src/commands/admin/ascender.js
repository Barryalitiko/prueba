const { toggleAdmin } = require("../../services/toggleAdmin");
const { PREFIX } = require("../../config");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un usuario como administrador.",
  commands: ["admin"],
  usage: `${PREFIX}admin promote/demote @usuario`,
  handle: async ({ args, sendReply, sendReact, remoteJid, socket }) => {
    if (args.length < 2) {
      return sendReply("Uso incorrecto. Usa: !admin promote/demote @usuario");
    }

    const action = args[0].toLowerCase(); // Normalizar acción
    const mentionedJid = args[1]?.replace("@", "") + "@s.whatsapp.net";

    if (!["promote", "demote"].includes(action)) {
      return sendReply("Acción inválida. Usa 'promote' o 'demote'.");
    }

    await sendReact("⏳"); // Reacción de espera

    const result = await toggleAdmin(socket, remoteJid, mentionedJid, action);

    if (result.success) {
      await sendReply(result.message);
      await sendReact("✅"); // Reacción de éxito
    } else {
      await sendReply(result.error);
      await sendReact("❌"); // Reacción de error
    }
  },
};