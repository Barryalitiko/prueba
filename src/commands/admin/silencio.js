const { PREFIX } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid } = require("../../utils");
const { muteMember } = require("../../database");

const SILENCE_TIMES = [0, 1, 3, 5, 10, 15]; // Tiempos en minutos

module.exports = {
  name: "silencio",
  description: "Silenciar a un miembro del grupo",
  commands: ["silencio"],
  usage: `${PREFIX}silencio <tiempo> @miembro`,
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
    // Verificar si el usuario proporcionó un tiempo y mencionó al miembro
    if (args.length < 2 && !isReply) {
      throw new InvalidParameterError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona y proporciona un tiempo válido.");
    }

    // Obtener el tiempo
    const silenceTime = parseInt(args[0], 10);

    // Verificar que el tiempo sea válido
    if (isNaN(silenceTime) || !SILENCE_TIMES.includes(silenceTime)) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El tiempo de muteo debe ser uno de los siguientes: 0 (desmutear), 1, 2, 3, 4, 5."
      );
    }

    // Obtener el JID del miembro a silenciar
    const memberToMuteJid = isReply ? replyJid : toUserJid(args[1]);

    // Desmutear si el tiempo es 0
    if (silenceTime === 0) {
      // Aquí iría la lógica para desmutear al miembro
      await muteMember(remoteJid, memberToMuteJid, 0);
      await sendReply("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El miembro ha sido desmuteado.");
      return;
    }

    // Silenciar el miembro por el tiempo correspondiente (en minutos)
    const muteDuration = SILENCE_TIMES[silenceTime] * 60 * 1000; // Convertir minutos a milisegundos

    // Llamar a la función para mutear
    await muteMember(remoteJid, memberToMuteJid, muteDuration);

    // Responder al usuario
    await sendSuccessReact();
    await sendReply(`👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El miembro ha sido silenciado por ${SILENCE_TIMES[silenceTime]} minutos.`);
  },
};