const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { updateGroupSettings } = require("../../utils/database");

module.exports = {
  name: "grupo",
  description: "Abre o cierra el grupo para que los miembros puedan enviar mensajes.",
  commands: ["grupo", "configgrupo"],
  usage: `${PREFIX}grupo (1/0)`, // 1 para abrir, 0 para cerrar
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    // Verificar que se haya recibido un argumento
    if (!args.length) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Escribe 1 para abrir el grupo o 0 para cerrarlo."
      );
    }

    // Determinar si se debe abrir o cerrar el grupo
    const action = args[0] === "1" ? "open" : args[0] === "0" ? "close" : null;

    // Validar los parámetros (solo se aceptan 1 o 0)
    if (!action) {
      throw new InvalidParameterError(
        "👻 Krampus.bot 👻 Solo puedes usar 1 para abrir el grupo o 0 para cerrarlo."
      );
    }

    try {
      // Actualizar la configuración del grupo
      const result = await updateGroupSettings(remoteJid, action === "open" ? "not_announcement" : "announcement");

      if (result.success) {
        await sendSuccessReact();
        const actionText = action === "open" ? "🔓 Abierto" : "🔒 Cerrado";
        await sendReply(`👻 Krampus.bot 👻 El grupo ha sido ${actionText} correctamente.`);
      } else {
        await sendReply("👻 Krampus.bot 👻 Hubo un problema al actualizar la configuración del grupo.");
      }
    } catch (error) {
      console.error(error);
      await sendReply("👻 Krampus.bot 👻 No se pudo actualizar la configuración del grupo. Inténtalo de nuevo más tarde.");
    }
  },
};
