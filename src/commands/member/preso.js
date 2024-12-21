const { createCanvas, loadImage } = require('canvas');
const { PREFIX } = require('../../config');

module.exports = {
  name: 'canvas',
  description: 'Crea una imagen con texto y una imagen',
  usage: `${PREFIX}canvas`,
  execute: async (message) => {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Escribe el texto
    ctx.font = '30px Impact';
    ctx.rotate(0.1);
    ctx.fillText('¡Hola!', 50, 100);

    // Dibuja la línea
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.lineTo(50, 102);
    ctx.lineTo(200, 102);
    ctx.stroke();

    // Carga la imagen
    loadImage('https://example.com/imagen.png').then((image) => {
      // Dibuja la imagen
      ctx.drawImage(image, 250, 50, 100, 100);

      // Envía la imagen
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png');
      message.channel.send(attachment);
    });
  }
};
