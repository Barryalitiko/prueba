const { PREFIX } = require("../../config");

module.exports = {
  name: "alarma",
  description: "Configura una alarma y notifica cuando se active.",
  commands: ["alarma", "alarm"],
  usage: `${PREFIX}alarma <duración en minutos>`,
  handle: async ({ args, sendReply, sendSuccessReact }) => {
    try {
      // Verificar que el usuario proporcionó un tiempo
      if (!args.length || isNaN(args[0])) {
        return await sendReply("❌ Debes especificar la duración en minutos. Ejemplo: !alarma 10");
      }

      // Convertir la duración a un número
      const durationMinutes = parseInt(args[0]);

      // Registrar la hora actual
      const now = new Date();
      const startTime = now.toLocaleTimeString("es-ES");

      // Calcular la hora de finalización
      const alarmTime = new Date(now.getTime() + durationMinutes * 60000); // Añadir los minutos
      const endTime = alarmTime.toLocaleTimeString("es-ES");

      // Confirmar la configuración de la alarma
      await sendReply(
        `⏰ Alarma configurada.\n\n- **Hora de inicio:** ${startTime}\n- **Duración:** ${durationMinutes} minutos\n- **Hora de finalización:** ${endTime}`
      );

      // Enviar una notificación cuando termine la alarma
      setTimeout(async () => {
        await sendReply(`🔔 ¡Alarma activada! Han pasado ${durationMinutes} minutos desde ${startTime}.`);
        await sendSuccessReact(); // React de éxito al finalizar
      }, durationMinutes * 60000); // Esperar el tiempo especificado
    } catch (error) {
      console.error("Error al configurar la alarma:", error);
      await sendReply("❌ Hubo un problema al configurar la alarma. Inténtalo de nuevo.");
    }
  },
};