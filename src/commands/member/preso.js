const { createCanvas } = require('canvas');
const { PREFIX } = require('../../config');

module.exports = {
  name: 'imagen',
  description: 'Crea una imagen vacía',
  usage: `${PREFIX}imagen`,
  execute: async (message) => {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    // Crea una imagen vacía
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 400);

    // Guarda la imagen en un archivo
    const fs = require('fs');
    const out = fs.createWriteStream(__dirname + '/imagen.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {
      message.reply('Imagen creada');
    });
  }
};
