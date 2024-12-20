const { PREFIX, ASSETS_DIR } = require("../../config");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

module.exports = {
  name: "fotoamor",
  description: "Combina la foto de perfil de quien ejecuta el comando con la de otro usuario y un corazón en el centro.",
  commands: ["fotoamor"],
  usage: `${PREFIX}fotoamor [@usuario o reacción]`,
  handle: async ({ args, socket, remoteJid, userJid, quoted, sendImageFromFile, sendReply }) => {
    try {
      let targetJid = userJid; // Por defecto, usamos la foto del que ejecuta el comando

      // Si hay un mensaje citado o un usuario etiquetado, obtenemos su JID
      if (quoted?.sender) {
        targetJid = quoted.sender;
      } else if (args[0]?.startsWith("@")) {
        targetJid = args[0].replace("@", "") + "@s.whatsapp.net";
      }

      // Obtener URLs de las fotos de perfil
      const userProfileUrl = await socket.profilePictureUrl(userJid, "image").catch(() => null);
      const targetProfileUrl = await socket.profilePictureUrl(targetJid, "image").catch(() => null);

      // Descargar las imágenes o usar una predeterminada
      const userImage = userProfileUrl || path.join(ASSETS_DIR, "default.png");
      const targetImage = targetProfileUrl || path.join(ASSETS_DIR, "default.png");
      const heartImage = path.join(ASSETS_DIR, "heart.png");

      // Crear el lienzo y cargar las imágenes
      const canvas = createCanvas(500, 250);
      const ctx = canvas.getContext("2d");
      const [img1, img2, heart] = await Promise.all([
        loadImage(userImage),
        loadImage(targetImage),
        loadImage(heartImage),
      ]);

      // Dibujar las imágenes en el lienzo
      ctx.drawImage(img1, 0, 0, 250, 250); // Imagen izquierda
      ctx.drawImage(img2, 250, 0, 250, 250); // Imagen derecha
      ctx.drawImage(heart, 200, 75, 100, 100); // Corazón en el centro

      // Guardar la imagen generada en un archivo temporal
      const outputPath = path.join(ASSETS_DIR, "temp", `fotoamor-${Date.now()}.png`);
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on("finish", async () => {
        // Enviar la imagen generada
        await sendImageFromFile(outputPath, "💖 Aquí tienes tu foto amorosa 💖");
        fs.unlinkSync(outputPath); // Eliminar el archivo temporal
      });
    } catch (error) {
      console.error("Error generando la foto amorosa:", error);
      await sendReply("❌ Hubo un problema al generar la foto amorosa.");
    }
  },
};