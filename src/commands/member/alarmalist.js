const { PREFIX } = require("../../config");

let alarms = {};

module.exports = {
  name: "alarmalist",
  description: "Consulta las alarmas activas.",
  commands: ["alarmalist"],
  usage: `${PREFIX}alarmalist`,
  handle: async ({ sendReply, remoteJid }) => {
    try {
      const alarmList = alarms[remoteJid] || [];
      if (alarmList.length === 0) {
        return await sendReply("🔕 No hay alarmas activas en este grupo.");
      }

      let listMessage = "📋 Alarmas activas:\n";
      alarmList.forEach((alarm, index) => {
        listMessage += `${index + 1}. @${alarm.targetUser} - Hora de activación: ${alarm.finishTime.toLocaleTimeString("es-ES")}\n`;
      });

      await sendReply(listMessage);
    } catch (error) {
      console.error("Error en el comando alarmalist:", error);
      await sendReply("❌ Ocurrió un problema al consultar la lista de alarmas.");
    }
  },
};