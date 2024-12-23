const { PREFIX } = require("../../config");

let alarms = {};

module.exports = {
  name: "alarma",
  description: "Configura una alarma y notifica al usuario correspondiente.",
  commands: ["alarma"],
  usage: `${PREFIX}alarma [minutos] (responde a un mensaje)`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, userJid, quotedMessage }) => {
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

      // Almacenar el usuario al que se le respondió
      let targetUser;
      if (isReply && quotedMessage?.key?.participant) {
        targetUser = quotedMessage.key.participant;
      } else {
        targetUser = remoteJid;
      }

      // Almacenar la alarma en memoria
      alarms[remoteJid] = { targetUser, finishTime };

      setTimeout(async () => {
        try {
          // Obtener la información de la alarma
          const alarm = alarms[remoteJid];
          if (alarm) {
            const message = `🔔 ¡Hola! @${onlyNumbers(alarm.targetUser)} Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString("es-ES")}.`;
            // Enviar el mensaje al usuario etiquetado
            await socket.sendMessage(remoteJid, { text: message, mentions: [{ jid: alarm.targetUser }] });
            // Eliminar la alarma de memoria
            delete alarms[remoteJid];
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
