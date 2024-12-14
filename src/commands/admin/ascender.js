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
  usage: `${PREFIX}admin (activar/desactivar) (userId)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (args.length !== 2) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Por favor, usa el formato correcto: `!admin (activar/desactivar) (userId)`"
      );
    }

    const [action, userId] = args;

    // Validar que action sea "activar" o "desactivar"
    if (action !== "activar" && action !== "desactivar") {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El primer parámetro debe ser 'activar' o 'desactivar'."
      );
    }

    // Validar que userId sea un valor válido
    if (!userId || userId.length === 0) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Debes especificar el ID del usuario."
      );
    }

    // Acción para promover o desconvertir
    const actionType = action === "activar" ? "promover" : "desconvertir";
    toggleAdmin(remoteJid, userId, actionType);

    const context = action === "activar" ? "Asignados" : "Quitados";
    await sendSuccessReact();
    await sendReply(
      `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Los permisos de administrador han sido ${context} al usuario ${userId} en el grupo.`
    );
  },
};