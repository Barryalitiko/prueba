const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "fijar",
  description: "Fija un mensaje en el grupo.",
  commands: ["fijar"],
  usage: `${PREFIX}fijar <mensaje>`,
  handle: async ({ webMessage, sendReply, sendSuccessReact, remoteJid, socket }) => {
    // Verificamos si el mensaje es una respuesta
    const replyMessage = webMessage?.quotedMessage;

    if (!replyMessage) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Debes responder a un mensaje para fijarlo."
      );
    }

    try {
      // Usamos el método para fijar el mensaje respondido
      await socket.sendMessage(remoteJid, {
        text: replyMessage.text, // Fijamos el texto del mensaje respondido
        pinned: true, // Esto es lo que fijará el mensaje
      });

      await sendSuccessReact();

      await sendReply(`El mensaje ha sido fijado: ${replyMessage.text}`);
    } catch (error) {
      console.error(error);
      await sendReply("❌ No se pudo fijar el mensaje.");
    }
  },
};