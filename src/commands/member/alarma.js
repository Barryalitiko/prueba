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
      // Verificar si se respondió a un mensaje y si se pasaron minutos
      if (!isReply || !args.length) {
        return await sendReply(
          "👻 Krampus.bot 👻 Responde a un mensaje para configurar la alarma y especifica los minutos."
        );
      }

      // Validar los minutos
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

      // Determinar el JID del usuario al que se le debe enviar la notificación
      let targetJid;
      if (isReply && quotedMessage?.key?.participant) {
        targetJid = quotedMessage.key.participant; // Usar el participante del mensaje citado
      } else {
        targetJid = remoteJid; // Usar el JID del grupo o usuario si no se respondió a un mensaje
      }

      // Configurar la alarma y enviarla después del tiempo especificado
      setTimeout(async () => {
        try {
          const message = `🔔 ¡Hola! Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString(
            "es-ES"
          )}.`;
          await socket.sendMessage(targetJid, { text: message });
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      // Registro en consola para verificar la alarma configurada
      console.log(
        `Alarma configurada por ${userJid} para el mensaje de ${replyJid || remoteJid}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};