const { PREFIX } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toUserJid } = require("../../utils");
const { toggleAdmin } = require("../../utils/loadcommonfunctions");

module.exports = {
  name: "admin",
  description: "Dar o quitar permisos de administrador a un miembro del grupo.",
  commands: ["admin"],
  usage: `${PREFIX}admin <1/0> @miembro o respondiendo a un mensaje`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    sendSuccessReact,
    userJid,
  }) => {
    // Validar argumentos
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Debes indicar la acción (1 para asignar, 0 para quitar) y mencionar a la persona objetivo."
      );
    }

    const action = args[0]; // "1" o "0"
    if (action !== "1" && action !== "0") {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Acción no válida. Usa 1 para asignar o 0 para quitar permisos de administrador."
      );
    }

    const memberToModifyJid = isReply ? replyJid : toUserJid(args[1]);
    if (!memberToModifyJid) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 No se pudo obtener el JID del miembro."
      );
    }

    if (memberToModifyJid === userJid) {
      throw new DangerError(
        "👻 Krampus.bot 👻 No puedes realizar esta acción sobre ti mismo."
      );
    }

    // Verificar permisos del usuario que ejecuta el comando
    const hasPermission = await checkPermission({
      type: "admin",
      socket,
      userJid,
      remoteJid,
    });

    if (!hasPermission) {
      throw new DangerError(
        "👻 Krampus.bot 👻 No tienes permisos para realizar esta acción."
      );
    }

    try {
      // Actualizar permisos de administrador
      const operation = action === "1" ? "promover" : "degradar";
      await toggleAdmin(remoteJid, memberToModifyJid, operation);

      await sendSuccessReact();
      await sendReply(
        `👻 Krampus.bot 👻 Permisos de administrador ${operation} correctamente.`
      );
    } catch (error) {
      throw new DangerError(
        `👻 Krampus.bot 👻 Ocurrió un error al modificar permisos: ${error.message}`
      );
    }
  },
};