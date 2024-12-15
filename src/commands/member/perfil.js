const { PREFIX } = require("../../config");
const { getProfilePictureUrl } = require("../../utils/loadcommonfunctions");

module.exports = {
  name: "fotoperfil",
  description: "Envía la foto de perfil de un usuario.",
  commands: ["fotoperfil", "perfil"],
  usage: `${PREFIX}fotoperfil [@usuario]`,
  handle: async ({ args, sendReply, remoteJid, socket }) => {
    try {
      let userJid = remoteJid; // Por defecto, se usa el remitente del mensaje
      if (args.length > 0) {
        const mentionedUser = args[0];
        if (!mentionedUser.startsWith("@")) {
          return await sendReply(
            "👻 Krampus.bot 👻 Debes mencionar a un usuario con '@'."
          );
        }
        userJid = `${mentionedUser.replace("@", "")}@s.whatsapp.net`;
      }

      // Obtener la URL de la foto de perfil
      const profilePictureUrl = await getProfilePictureUrl(userJid, socket);
      if (profilePictureUrl) {
        await socket.sendMessage(remoteJid, {
          image: { url: profilePictureUrl },
          caption: "👻 Krampus.bot 👻 Aquí tienes la foto de perfil.",
        });
      } else {
        await sendReply(
          "👻 Krampus.bot 👻 Este usuario no tiene una foto de perfil visible."
        );
      }
    } catch (error) {
      console.error("Error enviando la foto de perfil:", error);
      await sendReply("👻 Krampus.bot 👻 No se pudo obtener la foto de perfil.");
    }
  },
};