const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Asigna o quita permisos de administrador",
  commands: ["admin"],
  usage: `${PREFIX}admin (promover/desconvertir)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket }) => {
    if (!args.length) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Indica si quieres promover o desconvertir a un administrador.");
    }

    const action = args[0].toLowerCase();
    if (action !== "promover" && action !== "desconvertir") {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Comando inválido. Usa 'promover' o 'desconvertir'.");
    }

    // Verificar permisos del usuario
    const hasPermission = await checkPermission({ type: "admin", socket, userJid, remoteJid });
    if (!hasPermission) {
      throw new DangerError("👻 Krampus.bot 👻 No tienes permisos para realizar esta acción.");
    }

    // Cambiar el estado del administrador
    await toggleAdmin(remoteJid, userJid, action);

    // Responder al usuario
    await sendReply(`👻 Krampus.bot 👻 El usuario ha sido ${action === "promover" ? "promovido" : "desconvertido"} a administrador.`);
    await sendSuccessReact();
  },
};