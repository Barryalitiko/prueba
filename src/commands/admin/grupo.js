const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { isGroupClosed, openGroup, closeGroup } = require("../../utils/database");

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

      // Actualizar en la base de datos
      await closeGroup(remoteJid);

      // Configurar el grupo como cerrado en WhatsApp
      await socket.groupSettingUpdate(remoteJid, "announcement");
      await sendReply("👻 Krampus.bot 👻 El grupo ha sido cerrado.");
    } else if (action === "abrir") {
      if (!await isGroupClosed(remoteJid)) {
        throw new DangerError("👻 Krampus.bot 👻 El grupo ya está abierto.");
      }

      // Actualizar en la base de datos
      await openGroup(remoteJid);

      // Configurar el grupo como abierto en WhatsApp
      await socket.groupSettingUpdate(remoteJid, "not_announcement");
      await sendReply("👻 Krampus.bot 👻 El grupo ha sido abierto.");
    } else {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Comando inválido. Usa 'abrir' o 'cerrar'.");
    }

    await sendSuccessReact();
  },
};
