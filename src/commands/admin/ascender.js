const { toggleAdmin } = require("../../utils/database");
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

    const action = args[0].toLowerCase();
    const mentionedJid = args[1]?.replace("@", "") + "@s.whatsapp.net";

    // Validación estricta de acción
    if (!["promote", "demote"].includes(action)) {
      return sendReply("Acción inválida. Usa 'promote' o 'demote'.");
    }

    await sendReact("⏳");
    const result = await toggleAdmin(socket, remoteJid, mentionedJid, action);
    if (result.success) {
      await sendReply(result.message);
      await sendReact("✅");
    } else {
      await sendReply(result.error);
      await sendReact("❌");
    }
  },
};
