const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { isGroupClosed, openGroup, closeGroup } = require("../../utils/database"); // Importa las funciones necesarias

module.exports = {
  name: "grupo",
  description: "Abrir o cerrar un grupo.",
  commands: ["grupo", "group"],
  usage: `${PREFIX}grupo (abrir/cerrar)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket }) => {
    if (!args.length) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Indica si quieres abrir o cerrar el grupo.");
    }

    const action = args[0].toLowerCase();

    // Verificar permisos de administrador
    const hasPermission = await checkPermission({ type: "admin", socket, userJid, remoteJid });
    if (!hasPermission) {
      throw new DangerError("👻 Krampus.bot 👻 No tienes permisos para realizar esta acción.");
    }

    if (action === "cerrar") {
      if (await isGroupClosed(remoteJid)) {
        throw new DangerError("👻 Krampus.bot 👻 El grupo ya está cerrado.");
      }
      await closeGroup(remoteJid);
      await sendReply("👻 Krampus.bot 👻 El grupo ha sido cerrado.");
    } else if (action === "abrir") {
      if (!await isGroupClosed(remoteJid)) {
        throw new DangerError("👻 Krampus.bot 👻 El grupo ya está abierto.");
      }
      await openGroup(remoteJid);
      await sendReply("👻 Krampus.bot 👻 El grupo ha sido abierto.");
    } else {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Comando inválido. Usa 'abrir' o 'cerrar'.");
    }

    await sendSuccessReact();
  },
};