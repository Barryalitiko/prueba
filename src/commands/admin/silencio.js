const { PREFIX, BOT_NUMBER } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { addMute, removeMute, isUserMuted } = require("../../utils/database");
const { toUserJid, onlyNumbers } = require("../../utils");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario en el grupo.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario`,
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
    if (args.length < 1) {
      throw new InvalidParameterError(
        "Uso incorrecto! Usa el comando así: \n`!mute @usuario`"
      );
    }

    const userId = args[0];
    if (await isUserMuted(remoteJid, userId)) {
      await sendReply("Este usuario ya está silenciado en este grupo.");
      return;
    }

    await addMute(remoteJid, userId);
    await sendSuccessReact();
    await sendReply(`El usuario @${userId} ha sido silenciado.`);
  },
};
