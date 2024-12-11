const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { addMute, removeMute, isUserMuted } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario en el grupo por una duración especificada.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario <duración en segundos>`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, mentionedJid }) => {
    if (args.length < 2 || !mentionedJid || isNaN(args[1])) {
      throw new InvalidParameterError(
        "Uso incorrecto! Usa el comando así: \n`!mute @usuario <duración en segundos>`"
      );
    }

    const muteDuration = parseInt(args[1]);
    if (isNaN(muteDuration) || muteDuration <= 0) {
      throw new InvalidParameterError(
        "La duración debe ser un número entero mayor a 0 segundos."
      );
    }

    const userId = mentionedJid[0];
    if (await isUserMuted(remoteJid, userId)) {
      await sendReply("Este usuario ya está silenciado en este grupo.");
      return;
    }

    await addMute(remoteJid, userId, muteDuration);
    await sendSuccessReact();
    await sendReply(`El usuario @${userId} ha sido silenciado por ${muteDuration} segundos.`);
  },
};
