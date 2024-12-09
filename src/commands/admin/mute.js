const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { muteMember, unmuteMember, getMuteDuration } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "🔇 Mutea o desmutea a un miembro del grupo.",
  commands: ["mute"],
  usage: `${PREFIX}mute <@usuario> <tiempo>`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "👻 Debes proporcionar el usuario y el tiempo de muteo."
      );
    }

    const userJid = args[0];
    const muteTime = parseInt(args[1]);

    if (!muteTime || muteTime <= 0) {
      throw new InvalidParameterError(
        "🕰️ El tiempo de muteo debe ser un número positivo."
      );
    }

    const duration = getMuteDuration(muteTime);
    if (muteMember(remoteJid, userJid, duration)) {
      await sendSuccessReact();
      await sendReply(`🔇 El usuario @${userJid} ha sido muteado por ${duration} minutos.`);
    } else {
      throw new InvalidParameterError(
        "🚫 No se pudo mutear al usuario."
      );
    }
  },
};
