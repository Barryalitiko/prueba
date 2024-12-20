const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const { PREFIX } = require("../../config");

module.exports = {
  name: "rejas",
  description: "Superpone unas rejas sobre la foto de perfil de un usuario.",
  commands: ["rejas", "jail"],
  usage: `${PREFIX}rejas @usuario`,
  handle: async ({ socket, remoteJid, args, sendImageFromFile, sendReply }) => {
    try {
      // Obtener el JID del objetivo
      const target = args[0]
        ? args[0].replace("@", "").replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        : remoteJid;

      // Obtener la foto de perfil del usuario
      const profilePicUrl = await socket.profilePictureUrl(target, "image");
      if (!profilePicUrl) {
        return await sendReply("El usuario no tiene foto de perfil.");
      }

      // Cargar la foto de perfil y la imagen de las rejas
      const profileImage = await loadImage(profilePicUrl);
      const jailBars = await loadImage(path.join(__dirname, "../../assets/jail-bars.png"));

      // Crear un canvas
      const canvas = createCanvas(profileImage.width, profileImage.height);
      const ctx = canvas.getContext("2d");

      // Dibujar la foto de perfil
      ctx.drawImage(profileImage, 0, 0, canvas.width, canvas.height);

      // Dibujar las rejas encima
      ctx.drawImage(jailBars, 0, 0, canvas.width, canvas.height);

      // Guardar el resultado como un buffer
      const buffer = canvas.toBuffer("image/png");

      // Enviar la imagen al chat
      await sendImageFromFile(buffer, "Aquí tienes la foto con rejas!");
    } catch (error) {
      console.error(error);
      await sendReply("Ocurrió un error al procesar la imagen.");
    }
  },
};