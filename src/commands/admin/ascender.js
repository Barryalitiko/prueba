const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un miembro como administrador.",
  commands: ["admin", "convertir-admin"],
  usage: `${PREFIX}admin (promover/desconvertir) (usuario)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket }) => {
    if (args.length < 2) {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Indica la acción ('promover' o 'desconvertir') y el usuario.");
    }

    const action = args[0].toLowerCase();
    const targetUserJid = args[1];

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

    if (action !== "promover" && action !== "desconvertir") {
      throw new InvalidParameterError("👻 Krampus.bot 👻 Acción inválida. Usa 'promover' o 'desconvertir'.");
    }

    // Llamar a la función toggleAdmin para promover o degradar al usuario
    await toggleAdmin(remoteJid, targetUserJid, action);

    await sendSuccessReact();
  },
};
