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
      if (!isReply && !args.length) {
        return await sendReply(
          "👻 Krampus.bot 👻 Responde a un mensaje para configurar la alarma."
        );
      }

      const minutes = parseInt(args[0], 10);
      if (isNaN(minutes) || minutes <= 0) {
        return await sendReply(
          "👻 Krampus.bot 👻 Especifica un número válido de minutos."
        );
      }

      const now = new Date();
      const finishTime = new Date(now.getTime() + minutes * 60000);

      await sendReply(
        `⏰ Alarma configurada para dentro de ${minutes} minutos. Hora de activación: ${finishTime.toLocaleTimeString("es-ES")}.`
      );

      const targetUser = isReply && quotedMessage?.key?.participant
        ? quotedMessage.key.participant
        : userJid;

      if (!targetUser) {
        return await sendReply(
          "❌ No se pudo determinar el usuario objetivo. Responde a un mensaje válido."
        );
      }

      const alarmMessage = `🔔 La alarma ha terminado @${onlyNumbers(targetUser)}.`;

      if (!alarms[remoteJid]) alarms[remoteJid] = [];
      alarms[remoteJid].push({ targetUser, finishTime, alarmMessage });

      setTimeout(async () => {
        try {
          const alarmList = alarms[remoteJid] || [];
          const alarmIndex = alarmList.findIndex(
            (a) =>
              a.targetUser === targetUser &&
              a.finishTime.getTime() === finishTime.getTime()
          );
          if (alarmIndex > -1) {
            const alarm = alarmList[alarmIndex];
            await socket.sendMessage(
              remoteJid,
              { text: alarm.alarmMessage, mentions: [alarm.targetUser] }
            );
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