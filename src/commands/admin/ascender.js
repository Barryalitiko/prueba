const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Asigna o quita permisos de administrador a un usuario",
  commands: [
    "admin",
    "administrador",
  ],
  usage: `${PREFIX}admin (1/0) (userId)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (args.length !== 2) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Por favor, usa el formato correcto: `!admin (1/0) (userId)`"
      );
    }

    const [action, userId] = args;
    if (action !== "1" && action !== "0") {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El primer parámetro debe ser 1 (para asignar) o 0 (para quitar) los permisos."
      );
    }

    const actionType = action === "1" ? "promover" : "desconvertir";
    toggleAdmin(remoteJid, userId, actionType);

    const context = action === "1" ? "Asignados" : "Quitados";
    await sendSuccessReact();
    await sendReply(
      `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Los permisos de administrador han sido ${context} al usuario ${userId} en el grupo.`
    );
  },
};