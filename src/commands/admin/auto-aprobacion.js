const { toggleAutoApprove, isAutoApproveActive } = require("../../utils/database");
const { PREFIX } = require("../../config");

module.exports = {
  name: "autoapprove",
  description: "Activa o desactiva la aprobación automática de solicitudes de ingreso al grupo.",
  commands: ["autoapprove"],
  usage: `${PREFIX}autoapprove on/off`,
  handle: async ({ args, sendReply, remoteJid }) => {
    if (args.length < 1) {
      return sendReply("Uso incorrecto. Usa: !autoapprove on/off");
    }

    const action = args[0].toLowerCase();
    if (!["on", "off"].includes(action)) {
      return sendReply("Opción inválida. Usa 'on' o 'off'.");
    }

    if (action === "on") {
      toggleAutoApprove(remoteJid, true);
      await sendReply("Aprobación automática activada para este grupo.");
    } else {
      toggleAutoApprove(remoteJid, false);
      await sendReply("Aprobación automática desactivada para este grupo.");
    }
  },
};