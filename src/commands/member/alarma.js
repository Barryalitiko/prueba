const { PREFIX } = require("../../config");

module.exports = {
  name: "alarma",
  description: "Configura una alarma para ti o para otro usuario etiquetado.",
  commands: ["alarma"],
  usage: `${PREFIX}alarma [tiempo en minutos] [@usuario]`,
  handle: async ({ args, remoteJid, participants, sendReply, sendMessage, sendSuccessReact }) => {
    try {
      const date = new Date();
      if (!args.length || isNaN(args[0])) {
        return await sendReply("❌ Por favor, especifica un tiempo en minutos. Ejemplo: #alarma 10.");
      }
      const tiempo = parseInt(args[0]); // Tiempo en minutos
      const horaInicio = date.toLocaleTimeString("es-ES");
      const horaFin = new Date(date.getTime() + tiempo * 60000).toLocaleTimeString("es-ES");
      let objetivo = null; // Si se menciona un usuario, obtén su JID
      if (args[1]?.startsWith("@")) {
        const mencion = args[1].replace("@", "") + "@(link unavailable)";
        objetivo = participants.find((p) => (link unavailable) === mencion);
        if (!objetivo) {
          return await sendReply("❌ No se encontró al usuario mencionado en el grupo.");
        }
      }
      // Mensaje inicial
      await sendReply(
        `⏰ Alarma configurada a las ${horaInicio} para finalizar a las ${horaFin}. ${objetivo ? `El usuario ${args[1]} será notificado.` : ""}`
      );
      console.log(`🔔 Alarma configurada por ${remoteJid} a las ${horaInicio}, finalizará a las ${horaFin}.`);
      // Configuración de la alarma
      setTimeout(async () => {
        if (objetivo) {
          await sendMessage(
            (link unavailable),
            `🔔 ¡Tu alarma ha finalizado! Establecida a las ${horaInicio}, ha finalizado a las ${horaFin}.`
          );
        }
        await sendMessage(
          remoteJid,
          `⏰ Alarma finalizada. ${objetivo ? `Se notificó al usuario ${args[1]}.` : ""}`
        );
        console.log(`🔔 Alarma finalizada para ${remoteJid}${objetivo ? ` y notificada a ${(link unavailable)}` : ""}.`);
      }, tiempo * 60000);
      await sendSuccessReact();
    } catch (error) {
      console.error("❌ Error al configurar la alarma:", error);
      await sendReply("❌ Hubo un error al configurar la alarma.");
    }
  },
};
