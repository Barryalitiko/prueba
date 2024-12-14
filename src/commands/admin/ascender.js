const { PREFIX } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toggleAdmin } = require("../../utils/loadcommonfunctions");
const { toUserJid } = require("../../utils");

module.exports = {
  name: "admin",
  description: "Gestionar permisos de administrador",
  usage: `${PREFIX}admin (1/0) @miembro o respondiendo a un mensaje`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    sendSuccessReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Indica si deseas asignar (1) o quitar (0) permisos de administrador."
      );
    }

    const isPromote = args[0] === "1"; // Convertimos `1` en true
    const isDemote = args[0] === "0";  // Convertimos `0` en true

    // Validar el argumento inicial
    if (!isPromote && !isDemote) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Acción no válida. Usa 1 para promover o 0 para degradar."
      );
    }

    // Determinar el JID del miembro a modificar
    const memberToModifyJid = isReply ? replyJid : toUserJid(args[1]);
    if (!memberToModifyJid) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Menciona al miembro para asignar o quitar permisos de administrador."
      );
    }

    // Acción de promoción o degradación
    const action = isPromote ? "promover" : "degradar";

    try {
      await toggleAdmin(socket, remoteJid, memberToModifyJid, action); // Llama a tu lógica reutilizable
      await sendSuccessReact();
      await sendReply(
        `👻 Krampus.bot 👻 Permisos de administrador actualizados. El usuario ha sido ${isPromote ? "promovido" : "degradado"}.`
      );
    } catch (error) {
      throw new DangerError(
        `👻 Krampus.bot 👻 Error al actualizar permisos de administrador: ${error.message}`
      );
    }
  },
};