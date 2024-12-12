const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { addMute, isUserMuted } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario en el grupo.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario`,
  handle: async ({ args, socket, remoteJid, sendReply, sendSuccessReact }) => {
    if (args.length < 1) {
      throw new InvalidParameterError(
        `Uso incorrecto. Usa el comando así:\n${PREFIX}mute @usuario`
      );
    }

    const userId = args[0].replace("@", "").replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Verificar si el usuario ya está silenciado
    if (await isUserMuted(remoteJid, userId)) {
      await sendReply("Este usuario ya está silenciado en este grupo.");
      return;
    }

    // Silenciar al usuario
    await addMute(remoteJid, userId);
    await sendSuccessReact();
    await sendReply(`El usuario @${args[0]} ha sido silenciado.`);
  },
};