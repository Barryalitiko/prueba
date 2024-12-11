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
    socket,
    remoteJid,
    sendReply,
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

    // Escuchar mensajes y eliminarlos si son del usuario silenciado
    socket.ev.on("messages.upsert", async ({ messages }) => {
      for (const message of messages) {
        if (
          message.key.remoteJid === remoteJid &&
          message.key.participant === userId &&
          !message.key.fromMe
        ) {
           await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid,
          fromMe: false,
          id: webMessage.key.id,
          participant: webMessage.key.participant,
            },
          });
        }
      }
    });
  },
};
