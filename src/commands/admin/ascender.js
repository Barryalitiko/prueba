const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { toggleAdmin } = require("../../utils/database");

module.exports = {
  name: "admin",
  description: "Promover o degradar a un miembro como administrador usando números.",
  commands: ["admin", "convertir-admin"],
  usage: `${PREFIX}admin (1/0) @usuario`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket, webMessage }) => {
    try {
      // Validar argumentos mínimos
      if (args.length < 1) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Indica la acción ('1' para promover, '0' para desconvertir) y menciona al usuario."
        );
      }

      // Obtener y validar la acción
      const action = parseInt(args[0], 10);
      if (![1, 0].includes(action)) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Acción inválida. Usa '1' para promover o '0' para desconvertir."
        );
      }

      // Obtener los usuarios mencionados
      const mentionedUsers = webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentionedUsers.length) {
        throw new InvalidParameterError(
          "👻 Krampus.bot 👻 Debes mencionar al usuario objetivo con @usuario."
        );
      }

      // Procesar solo el primer usuario mencionado
      const targetUserJid = mentionedUsers[0];

      // Validar el JID
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

      // Llamar a la función toggleAdmin para ejecutar la acción
      const actionText = action === 1 ? "promovido a" : "degradado de";
      await toggleAdmin(remoteJid, targetUserJid, action === 1 ? "promover" : "desconvertir");

      // Responder con éxito
      await sendSuccessReact();
      await sendReply(
        `👻 Krampus.bot 👻 El usuario ${targetUserJid} ha sido ${actionText} administrador.`
      );
    } catch (error) {
      // Manejo de errores
      throw new DangerError(
        `👻 Krampus.bot 👻 Ocurrió un error al ejecutar el comando admin:\n\n📄 *Detalles*: ${error.message}`
      );
    }
  },
};