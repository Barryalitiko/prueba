const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Asigna o quita permisos de administrador",
  commands: ["admin"],
  usage: `${PREFIX}admin (promover/desconvertir)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, fromMe }) => {
    if (!args.length || (args[0] !== "promover" && args[0] !== "desconvertir")) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Escribe 'promover' o 'desconvertir' para gestionar los permisos de administrador."
      );
    }

    const action = args[0]; // Puede ser "promover" o "desconvertir"

    if (action === "promover") {
      await toggleAdmin(remoteJid, fromMe, "promover");
    } else if (action === "desconvertir") {
      await toggleAdmin(remoteJid, fromMe, "desconvertir");
    }

    await sendSuccessReact();
    await sendReply(`👻 Krampus.bot 👻 El usuario ha sido ${action === "promover" ? "promovido" : "desconvertido"} a administrador.`);
  },
};