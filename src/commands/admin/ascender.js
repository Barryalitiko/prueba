const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { toggleAdmin } = require("../../utils/loadcommonfunctions");
const { toUserJid } = require("../../utils");

module.exports = {
  name: "admin",
  description: "Asignar o quitar permisos de administrador",
  commands: ["admin", "asignaradmin", "quitaradmin"],
  usage: `${PREFIX}admin (1/0) @miembro o respondiendo a un mensaje`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, sendSuccessReact, userJid }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Menciona a la persona o responde a un mensaje. Usa 1 para asignar o 0 para quitar permisos de administrador."
      );
    }

    const action = args[0] === "1" ? "promover" : args[0] === "0" ? "degradar" : null;

    if (!action) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Acción no válida. Usa 1 para asignar o 0 para quitar permisos de administrador."
      );
    }

    let memberToModifyJid;

    if (isReply) {
      // Si es una respuesta a un mensaje, tomar el JID del remitente
      memberToModifyJid = replyJid;
    } else if (args[1]) {
      // Si no es una respuesta, tomar el JID del miembro mencionado
      memberToModifyJid = toUserJid(args[1]);
    }

    if (!memberToModifyJid) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Menciona al miembro para asignar o quitar permisos de administrador."
      );
    }

    if (memberToModifyJid === userJid) {
      throw new DangerError("👻 Krampus.bot 👻 No puedes cambiar tus propios permisos.");
    }

    try {
      // Usar la función toggleAdmin para cambiar los permisos
      await toggleAdmin(socket, remoteJid, memberToModifyJid, action);

      await sendSuccessReact();
      await sendReply(
        `👻 Krampus.bot 👻 El usuario ha sido ${action === "promover" ? "promovido" : "degradado"} a administrador.`
      );
    } catch (error) {
      throw new DangerError(`👻 Krampus.bot 👻 Error al realizar la acción: ${error.message}`);
    }
  },
};