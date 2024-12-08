const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { openGroup, closeGroup, isGroupClosed } = require("../../utils/database");
const { checkAdminPermissions } = require("../../utils");

module.exports = {
  name: "grupo",
  description: "Abre o cierra el grupo.",
  commands: ["grupo"],
  usage: `${PREFIX}grupo (1/0)`,
  handle: async ({
    args,
    sendReply,
    sendSuccessReact,
    remoteJid,
    userJid,
    socket,
    sendErrorReact
  }) => {
    // Verificar si el usuario es administrador
    const isAdmin = await checkAdminPermissions(remoteJid, userJid);
    if (!isAdmin) {
      throw new DangerError("👻 Krampus.bot 👻 No tienes permisos para realizar esta acción.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Usa 1 para abrir o 0 para cerrar el grupo."
      );
    }

    const open = args[0] === "1";
    const close = args[0] === "0";

    if (!open && !close) {
      throw new InvalidParameterError(
        "👻Krampus.bot👻 Usa 1 para abrir o 0 para cerrar el grupo."
      );
    }

    const groupClosed = await isGroupClosed(remoteJid);

    // Si el grupo ya está cerrado y el usuario intenta abrirlo
    if (open && groupClosed) {
      openGroup(remoteJid);
      await sendReply("👻 Krampus.bot 👻 El grupo ha sido abierto.");
      await sendSuccessReact();
      return;
    }

    // Si el grupo ya está abierto y el usuario intenta cerrarlo
    if (close && !groupClosed) {
      closeGroup(remoteJid);
      await sendReply("👻 Krampus.bot 👻 El grupo ha sido cerrado.");
      await sendSuccessReact();
      return;
    }

    // Si el grupo está abierto y el usuario intenta abrirlo nuevamente
    if (open && !groupClosed) {
      await sendReply("👻 Krampus.bot 👻 El grupo ya está abierto.");
      await sendErrorReact();
      return;
    }

    // Si el grupo está cerrado y el usuario intenta cerrarlo nuevamente
    if (close && groupClosed) {
      await sendReply("👻 Krampus.bot 👻 El grupo ya está cerrado.");
      await sendErrorReact();
      return;
    }
  },
};