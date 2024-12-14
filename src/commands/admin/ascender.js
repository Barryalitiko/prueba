const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { toUserJid } = require("../../utils");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un miembro como administrador.",
  commands: ["admin", "convertir-admin"],
  usage: `${PREFIX}admin (1/0) @usuario`,
  handle: async ({
    args,
    isReply,
    remoteJid,
    replyJid,
    sendReply,
    sendSuccessReact,
    userJid,
    socket,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona y escribe '1' para promover o '0' para desconvertir."
      );
    }

    const action = args[0]; // '1' para promover, '0' para desconvertir
    const memberToModifyJid = isReply ? replyJid : toUserJid(args[1]);

    if (action !== "1" && action !== "0") {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Usa '1' para promover o '0' para desconvertir."
      );
    }

    if (memberToModifyJid === userJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No puedes modificar tus propios permisos.");
    }

    // Realizar la acción de promover o desconvertir
    try {
      await toggleAdmin(remoteJid, memberToModifyJid, action === "1" ? "promover" : "desconvertir");
      await sendSuccessReact();
      await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario ha sido ${action === "1" ? "promovido a" : "degradado de"} administrador.`);
    } catch (error) {
      throw new DangerError(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo realizar la acción: ${error.message}`);
    }
  },
};