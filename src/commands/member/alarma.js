const { PREFIX } = require("../../config");

module.exports = {
  name: "alarma",
  description: "Configura una alarma y notifica al usuario correspondiente.",
  commands: ["alarma"],
  usage: `${PREFIX}alarma [minutos] (responde a un mensaje)`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    quotedMessage,
  }) => {
    try {
      // Verificar si se respondió a un mensaje o si se pasaron minutos
      if (!isReply && !args.length) {
        return await sendReply(
          "👻 Krampus.bot 👻 Responde a un mensaje para configurar la alarma."
        );
      }

      // Validar minutos
      const minutes = parseInt(args[0], 10);
      if (isNaN(minutes) || minutes <= 0) {
        return await sendReply(
          "👻 Krampus.bot 👻 Especifica un número válido de minutos."
        );
      }

      // Calcular la hora de finalización
      const now = new Date();
      const finishTime = new Date(now.getTime() + minutes * 60000);

      // Enviar mensaje de confirmación
      await sendReply(
        `⏰ Alarma configurada para dentro de ${minutes} minutos. Hora de activación: ${finishTime.toLocaleTimeString(
          "es-ES"
        )}.`
      );

      // Configurar la alarma
      setTimeout(async () => {
        try {
          const message = `🔔 ¡Hola! Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString(
            "es-ES"
          )}.`;

          // Enviar mensaje en respuesta al mensaje citado (si existe) o al grupo/chat
          if (isReply && quotedMessage?.key?.participant) {
            const targetJid = quotedMessage.key.participant;
            await socket.sendMessage(targetJid, { text: message }, { quoted: quotedMessage });
          } else {
            await socket.sendMessage(remoteJid, { text: message });
          }
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      console.log(
        `Alarma configurada por ${userJid} para el mensaje de ${replyJid || remoteJid}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};