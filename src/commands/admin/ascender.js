const { PREFIX, BOT_NUMBER } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");

module.exports = {
  name: "admin",
  description: "Gestionar permisos de administrador",
  commands: ["promover", "desconvertir"],
  usage: `${PREFIX}admin promover @miembro
  
ou
  
${PREFIX}admin desconvertir @miembro`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendSuccessReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona para asignar o quitar permisos de administrador"
      );
    }

    // Aseguramos que args[0] y replyJid no sean undefined
    const memberToModifyJid = isReply ? replyJid : toUserJid(args[0]);

    if (!memberToModifyJid) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo obtener el JID del miembro"
      );
    }

    const memberToModifyNumber = onlyNumbers(memberToModifyJid);

    // Verificamos que el número sea válido
    if (memberToModifyNumber.length < 7 || memberToModifyNumber.length > 15) {
      throw new InvalidParameterError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚞́𝚖𝚎𝚛𝚘 𝚗𝚘 válido");
    }

    if (memberToModifyJid === userJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No puedes cambiar tus propios permisos");
    }

    const botJid = toUserJid(BOT_NUMBER);

    if (memberToModifyJid === botJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pueden cambiar los permisos del bot");
    }

    // Aquí sería donde manejas el cambio de rol del miembro
    // Suponiendo que `toggleAdmin` sea la función que manejas para promover o quitar permisos

    const action = args[0]; // "promover" o "desconvertir"
    if (action === "promover") {
      // Lógica para promover
      await toggleAdmin(remoteJid, memberToModifyJid, "promover");
    } else if (action === "desconvertir") {
      // Lógica para desconvertir
      await toggleAdmin(remoteJid, memberToModifyJid, "desconvertir");
    } else {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Comando no válido"
      );
    }

    await sendSuccessReact();
    await sendReply("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Permiso de administrador actualizado");
  },
};