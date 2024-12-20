const { PREFIX } = require("../../config");

module.exports = {
  name: "profilepic",
  description: "Obtén la foto de perfil de un usuario.",
  commands: ["profilepic", "pfp"],
  usage: `${PREFIX}profilepic @usuario`,
  handle: async ({ args, socket, remoteJid, sendReply, sendReact }) => {
    if (args.length < 1) {
      await sendReply("Uso incorrecto. Usa el comando así:\n" + `${PREFIX}profilepic @usuario`);
      return;
    }

    const userJid = args[0].replace("@", "") + "@s.whatsapp.net";

    try {
      // Obtener la foto de perfil del usuario
      const profilePicUrl = await socket.profilePictureUrl(userJid, "image");

      if (profilePicUrl) {
        await sendReply(`Foto de perfil de @${args[0]}:`);
        await sendReact("📸");
        await socket.sendMessage(remoteJid, { image: { url: profilePicUrl }, caption: `Foto de perfil de @${args[0]}` });
      } else {
        await sendReply(`No se pudo obtener la foto de perfil de @${args[0]}.`);
      }
    } catch (error) {
      console.error("Error al obtener la foto de perfil:", error);
      await sendReply("Hubo un error al intentar obtener la foto de perfil.");
    }
  },
};