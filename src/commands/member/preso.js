const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../config");

module.exports = {
  name: "saludo",
  description: "Crea una imagen con un saludo personalizado",
  commands: ["saludo"],
  usage: `${PREFIX}saludo [nombre]`,
  handle: async ({ args, sendImageFromFile, sendReply }) => {
    try {
      const name = args.join(" ") || "Amigo"; // Nombre del usuario o valor predeterminado
      const canvas = createCanvas(500, 250);
      const ctx = canvas.getContext("2d");

      // Fondo
      ctx.fillStyle = "#FFD700"; // Dorado
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Texto de saludo
      ctx.fillStyle = "#000000"; // Negro
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`¡Hola, ${name}!`, canvas.width / 2, canvas.height / 2);

      // Guardar imagen
      const outputPath = path.join(__dirname, "saludo.png");
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      // Enviar imagen generada
      await sendImageFromFile(outputPath, `🎉 Aquí tienes tu saludo, ${name}`);
      fs.unlinkSync(outputPath); // Eliminar archivo temporal después de enviarlo
    } catch (error) {
      console.error("Error generando la imagen:", error);
      await sendReply("❌ Ocurrió un error al generar la imagen.");
    }
  },
};