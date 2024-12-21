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
    quotedMessage,
    sendReply,
    userJid,
  }) => {
    try {
      // Verificar si se respondió a un mensaje
      if (!isReply || !quotedMessage) {
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

      // Obtener el JID del usuario cuyo mensaje fue citado
      const targetJid = quotedMessage.key.participant || quotedMessage.participant;

      // Calcular la hora de finalización
      const now = new Date();
      const finishTime = new Date(now.getTime() + minutes * 60000);

      // Confirmar configuración de la alarma
      await sendReply(
        `⏰ Alarma configurada para ${minutes} minutos. Notificaré a ${targetJid} a las ${finishTime.toLocaleTimeString(
          "es-ES"
        )}.`
      );

      // Configurar el temporizador
      setTimeout(async () => {
        try {
          const message = `🔔 ¡Hola, @${targetJid.split("@")[0]}! Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString(
            "es-ES"
          )}.`;

          await socket.sendMessage(
            remoteJid,
            {
              text: message,
              mentions: [targetJid],
            },
            { quoted: quotedMessage }
          );
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      console.log(
        `Alarma configurada por ${userJid} para notificar a ${targetJid}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};