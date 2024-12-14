const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toggleAdmin } = require("../../utils/database");
const { toUserJid } = require("../../utils");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un miembro como administrador.",
  commands: ["admin", "convertir-admin"],
  usage: `${PREFIX}admin (1/0) @usuario`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket, webMessage }) => {
    if (args.length < 1) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Indica la acción ('1' para promover o '0' para desconvertir) y menciona al usuario.");
    }

    const action = args[0];
    const mentionedUsers = webMessage.mentionedJid;
    const targetUserJid = mentionedUsers.length > 0 ? toUserJid(mentionedUsers[0]) : null;

    // Verificar que se haya mencionado un usuario
    if (!targetUserJid) {
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

    // Validar acción (1 para promover, 0 para desconvertir)
    if (action !== "1" && action !== "0") {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Acción inválida. Usa '1' para promover o '0' para desconvertir.");
    }

    // Llamar a la función toggleAdmin para promover o degradar al usuario
    try {
      await toggleAdmin(remoteJid, targetUserJid, action === "1" ? "promover" : "desconvertir");
      await sendSuccessReact();
      const actionText = action === "1" ? "promovido a" : "degradado de";
      await sendReply(`👻 Krampus.bot 👻 El usuario ${targetUserJid} ha sido ${actionText} administrador.`);
    } catch (error) {
      throw new DangerError(`👻 Krampus.bot 👻 No se pudo completar la acción: ${error.message}`);
    }
  },
};