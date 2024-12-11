const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { addMute, isUserMuted } = require("../../utils/database");
const { toUserJid, onlyNumbers } = require("../../utils");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario en el grupo.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario <duración en segundos>`,
  handle: async ({
    args,
    sendReply,
    sendSuccessReact,
    remoteJid,
  }) => {
    if (args.length < 2) {
      throw new InvalidParameterError(
        "Uso incorrecto! Usa el comando así: \n`!mute @usuario <duración en segundos>`"
      );
    }

    const mentionedUser = args[0];
    const muteDuration = parseInt(args[1], 10); // Duración en segundos

    if (isNaN(muteDuration) || muteDuration <= 0) {
      throw new InvalidParameterError(
        "Por favor, proporciona una duración válida en segundos."
      );
    }

    const userId = toUserJid(onlyNumbers(mentionedUser)); // Convertir a formato JID
    if (await isUserMuted(remoteJid, userId)) {
      await sendReply("Este usuario ya está silenciado en este grupo.");
      return;
    }

    // Agregar al sistema de mute con duración
    await addMute(remoteJid, userId, muteDuration);
    await sendSuccessReact();
    await sendReply(
      `El usuario @${mentionedUser} ha sido silenciado por ${muteDuration} segundos.`
    );
  },
};