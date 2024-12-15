const { getProfileImageData } = require("../services/baileys");
const { PREFIX } = require("../config");

module.exports = {
  name: "fotoperfil",
  description: "Obtén la foto de perfil de un usuario",
  commands: ["fotoperfil"],
  usage: `${PREFIX}fotoperfil @usuario`,
  handle: async ({ args, sendReply, remoteJid, socket }) => {
    if (!args.length) {
      return await sendReply(
        `👻 Krampus.bot 👻 Por favor, menciona a un usuario para obtener su foto de perfil.\nUso: ${PREFIX}fotoperfil @usuario`
      );
    }

    const userJid = args[0]?.includes("@") ? args[0] : `${args[0]}@s.whatsapp.net`;

    try {
      const { buffer, success } = await getProfileImageData(socket, userJid);

      const caption = success
        ? `👻 Krampus.bot 👻 Aquí está la foto de perfil del usuario @${args[0].replace("@", "")}.`
        : `👻 Krampus.bot 👻 No se pudo obtener la foto de perfil del usuario @${args[0].replace("@", "")}.`;

      await socket.sendMessage(remoteJid, {
        image: buffer,
        caption,
        mentions: [userJid],
      });
    } catch (error) {
      await sendReply("👻 Krampus.bot 👻 Hubo un error al obtener la foto de perfil. Inténtalo de nuevo más tarde.");
    }
  },
};