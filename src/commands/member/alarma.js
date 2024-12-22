const { PREFIX } = require("../../config");

let alarms = {}; // Estructura temporal para almacenar las alarmas

module.exports = {
  name: "alarma",
  description: "Configura una alarma y notifica al usuario correspondiente.",
  commands: ["alarma"],
  usage: `${PREFIX}alarma [minutos] (responde a un mensaje)`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, quotedMessage }) => {
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

      // Determinar el JID del usuario al que se le responde
      let targetJid;
      if (isReply && quotedMessage?.key?.participant) {
        targetJid = quotedMessage.key.participant.replace(/:\d+@/, "@"); // Limpia el JID si tiene formato con dispositivo
      } else {
        return await sendReply(
          "👻 Krampus.bot 👻 Responde a un mensaje válido para configurar la alarma."
        );
      }

      // Enviar mensaje de confirmación
      await sendReply(
        `⏰ Alarma configurada para @${targetJid.split("@")[0]} dentro de ${minutes} minutos. Hora de activación: ${finishTime.toLocaleTimeString("es-ES")}.`,
        { mentions: [targetJid] }
      );

      // Almacenar la alarma en memoria
      alarms[remoteJid] = {
        targetJid,
        finishTime,
      };

      // Configurar el temporizador
      setTimeout(async () => {
        try {
          // Obtener la información de la alarma
          const alarm = alarms[remoteJid];
          if (alarm) {
            const message = `🔔 ¡Hola @${alarm.targetJid.split("@")[0]}! Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString(
              "es-ES"
            )}.`;

            // Enviar el mensaje al grupo mencionando al usuario
            await socket.sendMessage(remoteJid, {
              text: message,
              mentions: [alarm.targetJid],
            });

            // Eliminar la alarma de memoria
            delete alarms[remoteJid];
          }
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      console.log(
        `Alarma configurada para ${targetJid} por el mensaje de ${replyJid || remoteJid}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};