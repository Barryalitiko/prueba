const { PREFIX } = require("../../config");
const { onlyNumbers } = require("../../utils");

let alarms = {};

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

      // Determinar el usuario objetivo
      let targetUser;
      if (isReply && quotedMessage?.key?.participant) {
        // Si hay una respuesta válida, usar la ID del participante al que se responde
        targetUser = quotedMessage.key.participant;
      } else if (!isReply && args.length) {
        // Si no hay respuesta y hay un argumento, usar el usuario que invoca el comando
        targetUser = userJid;
      } else {
        // Si no se puede determinar el usuario, enviar mensaje de error
        return await sendReply(
          "❌ No se pudo determinar el usuario objetivo. Responde a un mensaje válido."
        );
      }

      // Preparar el texto para enviar cuando termine el tiempo
      const alarmMessage = `🔔 La alarma ha terminado @${onlyNumbers(targetUser)}`;

      // Almacenar la alarma en memoria
      if (!alarms[remoteJid]) alarms[remoteJid] = [];
      alarms[remoteJid].push({ targetUser, finishTime, alarmMessage });

      // Configurar el temporizador para la alarma
      setTimeout(async () => {
        try {
          // Obtener la información de la alarma
          const alarmList = alarms[remoteJid] || [];
          const alarmIndex = alarmList.findIndex(
            (a) =>
              a.targetUser === targetUser &&
              a.finishTime.getTime() === finishTime.getTime()
          );
          if (alarmIndex > -1) {
            const alarm = alarmList[alarmIndex];

            // Enviar el mensaje preparado
            await socket.sendMessage(
              remoteJid,
              { text: alarm.alarmMessage, mentions: [alarm.targetUser] }
            );

            // Eliminar la alarma de memoria
            alarmList.splice(alarmIndex, 1);
            if (alarmList.length === 0) delete alarms[remoteJid];
          }
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      console.log(
        `Alarma configurada por ${userJid} para ${targetUser}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};
