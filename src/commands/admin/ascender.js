const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un miembro como administrador.",
  commands: ["admin", "convertir-admin"],
  usage: `${PREFIX}admin (promover/desconvertir) @usuario`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket, webMessage }) => {
    try {
      // Validar argumentos mínimos
      if (args.length < 1) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Indica la acción ('promover' o 'desconvertir') y menciona al usuario."
        );
      }

      // Obtener la acción y los usuarios mencionados
      const action = args[0].toLowerCase();
      const mentionedUsers = webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

      if (!mentionedUsers.length) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Debes mencionar al usuario objetivo con @usuario."
        );
      }

      // Solo procesar el primer usuario mencionado
      const targetUserJid = mentionedUsers[0];

      // Validar si es un JID válido
      if (!targetUserJid.endsWith("@s.whatsapp.net")) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Mención inválida o JID no reconocido."
        );
      }

      // Verificar permisos del usuario ejecutante
      const hasPermission = await checkPermission({
        type: "admin",
        socket,
        userJid,
        remoteJid,
      });

      if (!hasPermission) {
        throw new DangerError("👻 Krampus.bot 👻 No tienes permisos para realizar esta acción.");
      }

      // Prevenir auto-modificación
      if (targetUserJid === userJid) {
        throw new DangerError("👻 Krampus.bot 👻 No puedes modificar tus propios permisos.");
      }

      // Validar acción
      if (!["promover", "desconvertir"].includes(action)) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Acción inválida. Usa 'promover' o 'desconvertir'."
        );
      }

      // Llamar a la función `toggleAdmin` para ejecutar la acción
      await toggleAdmin(remoteJid, targetUserJid, action);

      // Responder con éxito
      await sendSuccessReact();
      await sendReply(
        `👻 Krampus.bot 👻 El usuario ${targetUserJid} ha sido ${
          action === "promover" ? "promovido a" : "degradado de"
        } administrador.`
      );
    } catch (error) {
      // Manejo de errores
      throw new DangerError(
        `👻 Krampus.bot 👻 Ocurrió un error al ejecutar el comando admin:\n\n📄 *Detalles*: ${error.message}`
      );
    }
  },
};