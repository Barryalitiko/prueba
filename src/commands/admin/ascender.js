const { PREFIX } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid } = require("../../utils");
const { toggleAdmin } = require("../../utils/loadcommonfunctions");

module.exports = {
  name: "admin",
  description: "Gestionar permisos de administrador (promover/degradar)",
  usage: `${PREFIX}admin <1/0> @miembro`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, sendSuccessReact }) => {
    try {
      // Validar que se proporcione un argumento o una respuesta
      if (!args.length && !isReply) {
        throw new InvalidParameterError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a un usuario o responde a su mensaje para asignar/quitar permisos de administrador."
        );
      }

      // Obtener el JID del miembro objetivo
      const memberToModifyJid = isReply ? replyJid : toUserJid(args[1]);
      if (!memberToModifyJid) {
        throw new InvalidParameterError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo identificar al miembro. Asegúrate de mencionar correctamente o responder al mensaje."
        );
      }

      // Validar el tipo de acción (1 para promover, 0 para degradar)
      const action = args[0];
      if (!["1", "0"].includes(action)) {
        throw new InvalidParameterError(
          "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Acción no válida. Usa '1' para promover a administrador o '0' para degradar."
        );
      }

      // Ejecutar la acción de promoción/degradación
      const actionText = action === "1" ? "promover" : "degradar";
      await toggleAdmin(remoteJid, memberToModifyJid, actionText);

      // Enviar confirmación
      await sendSuccessReact();
      await sendReply(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 El usuario fue ${actionText === "promover" ? "promovido a administrador" : "degradado"} correctamente.`
      );
    } catch (error) {
      // Capturar errores y enviar mensajes personalizados
      if (error instanceof DangerError || error instanceof InvalidParameterError) {
        throw error; // Manejo personalizado para estos casos
      }
      throw new DangerError(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Hubo un error inesperado al procesar el comando: ${error.message}`
      );
    }
  },
};