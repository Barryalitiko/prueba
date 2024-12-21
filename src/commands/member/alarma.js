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
        `⏰ Alarma configurada para dentro de ${minutes} minutos. Hora de activación: ${finishTime.toLocaleTimeString(
          "es-ES"
        )}.`
      );

      setTimeout(async () => {
        try {
          const message = `🔔 ¡Hola! Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString(
            "es-ES"
          )}.`;
          await socket.sendMessage(remoteJid, { text: message }, { quoted: true });
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      console.log(
        `Alarma configurada por ${replyJid} para el mensaje de ${remoteJid}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};
