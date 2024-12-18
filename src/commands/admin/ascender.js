const { toggleAdmin } = require("../../utils/database");
const { PREFIX } = require("../../config");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un usuario como administrador.",
  commands: ["admin"],
  usage: `${PREFIX}admin promote/demote @usuario`,
  handle: async ({ args, sendReply, sendReact, remoteJid, socket }) => {
    // Depuración: Ver qué valores están llegando
    console.log("args recibidos:", args);

    if (args.length < 2) {
      return sendReply("Uso incorrecto. Usa: !admin promote/demote @usuario");
    }

    const action = args[0].toLowerCase().trim(); // Asegurarse de que no haya espacios
    const mentionedJid = args[1]?.replace("@", "").trim() + "@s.whatsapp.net";

    // Verificar los valores procesados
    console.log("Acción:", action);
    console.log("Mencionado:", mentionedJid);

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
