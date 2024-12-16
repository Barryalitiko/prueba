const { toggleAdmin } = require("../../services/toggleAdmin");
const { PREFIX } = require("../../config");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un usuario",
  commands: ["admin"],
  usage: `${PREFIX}admin @usuario promote|demote`,
  handle: async ({ args, socket, remoteJid, sendReply, sendReact }) => {
    if (args.length < 2) {
      return sendReply("Uso incorrecto. Ejemplo: !admin @usuario promote|demote");
    }

    const [userMention, action] = args;
    const userJid = userMention.replace(/[@]/g, "") + "@s.whatsapp.net";

    // Validar acción
    if (!["promote", "demote"].includes(action)) {
      return sendReply("Acción inválida. Usa 'promote' o 'demote'.");
    }

    // Llamar a toggleAdmin
    const result = await toggleAdmin(socket, remoteJid, userJid, action);

    if (result.success) {
      await sendReact("✅");
      return sendReply(result.message);
    } else {
      await sendReact("❌");
      return sendReply(result.error);
    }
  },
};