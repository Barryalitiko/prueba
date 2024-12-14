const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un miembro como administrador.",
  commands: ["admin", "convertir-admin"],
  usage: `${PREFIX}admin (promover/desconvertir) @usuario`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket, webMessage }) => {
    if (args.length < 1) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Indica la acción ('promover' o 'desconvertir') y menciona al usuario.");
    }

    const action = args[0].toLowerCase();
    const mentionedUsers = webMessage.mentionedJid;
    const targetUserJid = mentionedUsers[0];

    if (!targetUserJid || !targetUserJid.endsWith("@(link unavailable)")) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Menciona correctamente al usuario o proporciona su número completo.");
    }

    // Verificar permisos de administrador
    const hasPermission = await checkPermission({
      type: "admin",
      socket,
      userJid,
      remoteJid,
    });

    if (!hasPermission) {
      throw new DangerError("👻 Krampus.bot 👻 No tienes permisos para realizar esta acción.");
    }

    // Evitar auto-modificación
    if (targetUserJid === userJid) {
      throw new DangerError("👻 Krampus.bot 👻 No puedes modificar tus propios permisos.");
    }

    // Validar acción
    if (action !== "promover" && action !== "desconvertir") {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Acción inválida. Usa 'promover' o 'desconvertir'.");
    }

    // Llamar a la función toggleAdmin para promover o degradar al usuario
    try {
      await toggleAdmin(remoteJid, targetUserJid, action);
      await sendSuccessReact();
      await sendReply(`👻 Krampus.bot 👻 El usuario ${targetUserJid} ha sido ${action === "promover" ? "promovido a" : "degradado de"} administrador.`);
    } catch (error) {
      throw new DangerError(`👻 Krampus.bot 👻 No se pudo completar la acción: ${error.message}`);
    }
  },
};
