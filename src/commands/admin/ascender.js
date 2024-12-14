const { PREFIX } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Gestionar permisos de administrador",
  usage: `${PREFIX}admin <1/0> @miembro`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, userJid, sendSuccessReact, }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona para asignar o quitar permisos de administrador"
      );
    }

    const memberToModifyJid = isReply ? replyJid : toUserJid(args[1]);
    if (!memberToModifyJid) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo obtener el JID del miembro"
      );
    }

    const action = args[0];
    if (action !== "1" && action !== "0") {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Acción no válida. Utiliza 1 para promover o 0 para degradar"
      );
    }

    try {
      await toggleAdmin(remoteJid, memberToModifyJid, action === "1" ? "promover" : "degradar");
      await sendSuccessReact();
      await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Permiso de administrador actualizado`);
    } catch (error) {
      throw new DangerError(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Error al actualizar permiso de administrador: ${error.message}`);
    }
  },
};
