const { PREFIX } = require("../../config");

module.exports = {
  name: "alarma",
  description: "Configura una alarma y notifica al usuario correspondiente.",
  commands: ["alarma"],
  usage: `${PREFIX}alarma [minutos] (responde a un mensaje)`,
  handle: async ({ args, quoted, sendReply, remoteJid, replyJid, socket }) => {
    try {
      // Verificar si el comando se ejecuta en respuesta a un mensaje
      if (!quoted) {
        return await sendReply("👻 Krampus.bot 👻 Responde a un mensaje para configurar la alarma.");
      }

      // Verificar si se proporcionaron minutos
      const minutes = parseInt(args[0], 10);
      if (isNaN(minutes) || minutes <= 0) {
        return await sendReply("👻 Krampus.bot 👻 Especifica un número válido de minutos.");
      }

      // Obtener información del tiempo
      const now = new Date();
      const finishTime = new Date(now.getTime() + minutes * 60000);

      // Notificar que la alarma ha sido configurada
      await sendReply(
        `⏰ Alarma configurada para dentro de ${minutes} minutos. Hora de activación: ${finishTime.toLocaleTimeString(
          "es-ES"
        )}.`
      );

      // Esperar el tiempo especificado y notificar al usuario
      setTimeout(async () => {
        try {
          const message = `🔔 ¡Hola! Tu alarma programada ha sonado. 🕒 Hora de finalización: ${finishTime.toLocaleTimeString(
            "es-ES"
          )}.`;
          await socket.sendMessage(remoteJid, { text: message }, { quoted: { key: quoted.key } });
        } catch (error) {
          console.error("Error notificando la alarma:", error);
        }
      }, minutes * 60000);

      console.log(
        `Alarma configurada por ${replyJid} para el mensaje de ${quoted.sender}. Activación en ${minutes} minutos.`
      );
    } catch (error) {
      console.error("Error en el comando alarma:", error);
      await sendReply("❌ Ocurrió un problema al configurar la alarma.");
    }
  },
};
