const { PREFIX, BOT_NUMBER } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { muteMember, unmuteMember } = require("../../utils/database");
const { MAX_MUTE_TIME } = require("../../utils/database");

module.exports = {
  name: "silencio",
  description: "Silenciar a un miembro durante un tiempo determinado.",
  commands: ["silenciar", "mute"],
  usage: `${PREFIX}silencio @marcar_miembro <tiempo_en_minutos> 

o 

${PREFIX}silencio respondiendo a un mensaje <tiempo_en_minutos>`,
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
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona o responde a un mensaje"
      );
    }

    const memberToMuteJid = isReply ? replyJid : toUserJid(args[0]);
    const muteDuration = args[1] ? parseInt(args[1], 10) : 0; // Asumimos que el segundo argumento es el tiempo en minutos

    if (isNaN(muteDuration) || muteDuration <= 0 || muteDuration > 15) {
      throw new InvalidParameterError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El tiempo de muteo debe ser un número entre 1 y 15 minutos.");
    }

    const memberToMuteNumber = onlyNumbers(memberToMuteJid);
    if (memberToMuteNumber.length < 7 || memberToMuteNumber.length > 15) {
      throw new InvalidParameterError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Número inválido.");
    }

    if (memberToMuteJid === userJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No te puedes silenciar a ti mismo.");
    }

    const botJid = toUserJid(BOT_NUMBER);
    if (memberToMuteJid === botJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No te puedes silenciar a ti mismo.");
    }

    // Muteamos al miembro
    await muteMember(remoteJid, memberToMuteJid, muteDuration * 60 * 1000); // Guardamos el tiempo en milisegundos
    await sendSuccessReact();
    
    await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Has silenciado a ${memberToMuteJid} por ${muteDuration} minutos.`);
  },
};