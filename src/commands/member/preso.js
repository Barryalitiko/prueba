const { PREFIX } = require("../../config");
const { createCanvas } = require("canvas");

module.exports = {
  name: "testcanvas",
  description: "Genera una imagen de prueba para verificar que canvas funciona correctamente.",
  commands: ["testcanvas"],
  usage: `${PREFIX}testcanvas`,
  handle: async ({ sendImageFromBuffer }) => {
    try {
      // Crear un lienzo de 250x250
      const canvas = createCanvas(250, 250);
      const ctx = canvas.getContext("2d");

      // Establecer el fondo y dibujar texto
      ctx.fillStyle = "#FF6347"; // Color de fondo (rojo tomate)
      ctx.fillRect(0, 0, 250, 250); // Rellenar el fondo
      ctx.fillStyle = "white"; // Color del texto
      ctx.font = "30px Arial";
      ctx.fillText("¡Canvas Funciona!", 20, 120); // Escribir texto en el lienzo

      // Convertir la imagen a un buffer
      const buffer = canvas.toBuffer();

      // Enviar la imagen como respuesta
      await sendImageFromBuffer(buffer, "Aquí está la prueba de Canvas!");
    } catch (error) {
      console.error("Error generando la imagen de prueba:", error);
      await sendReply("❌ Hubo un problema al generar la imagen de prueba.");
    }
  },
};