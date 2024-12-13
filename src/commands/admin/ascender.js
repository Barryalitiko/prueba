const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { DangerError } = require("../../errors/DangerError");
const { checkPermission } = require("../../middlewares/checkpermission");
const { isAdmin } = require("../../utils/database"); // Necesitamos la función isAdmin para validar

module.exports = {
  name: "admin",
  description: "Promover o quitar admin a un usuario en el grupo.",
  commands: [`${PREFIX}admin`],
  usage: `${PREFIX}admin (promover/demote) @usuario`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, userJid, socket, mentionedJidList }) => {
    if (!args.length || mentionedJidList.length === 0) {
      throw new InvalidParameterError(
        `👻 Krampus.bot 👻 Indica la acción ('promover' o 'demote') y menciona al usuario. Uso: ${PREFIX}admin (promover/demote) @usuario`
      );
    }

    const action = args[0].toLowerCase();

    // Verificar si el usuario que ejecuta el comando tiene permisos de administrador
    const hasPermission = await checkPermission({ type: "admin", socket, userJid, remoteJid });
    if (!hasPermission) {
      throw new DangerError("👻 Krampus.bot 👻 No tienes permisos para realizar esta acción.");
    }

    const mentionedJid = mentionedJidList[0]; // Tomamos el primer usuario mencionado

    // Lógica para promover o quitar admin
    if (action === "promover") {
      // Promover a admin
      try {
        await socket.groupParticipantsUpdate(remoteJid, [mentionedJid], "promote");
        await sendReply(`👻 Krampus.bot 👻 ¡${mentionedJid} ahora es administrador!`);
      } catch (error) {
        throw new DangerError("👻 Krampus.bot 👻 No se pudo promover al usuario. Verifica que el bot tenga permisos.");
      }
    } else if (action === "demote") {
      // Quitar admin
      try {
        await socket.groupParticipantsUpdate(remoteJid, [mentionedJid], "demote");
        await sendReply(`👻 Krampus.bot 👻 ¡${mentionedJid} ya no es administrador!`);
      } catch (error) {
        throw new DangerError("👻 Krampus.bot 👻 No se pudo quitar el rol de administrador al usuario.");
      }
    } else {
      throw new InvalidParameterError(
        `👻 Krampus.bot 👻 Comando inválido. Usa 'promover' o 'demote'. Uso: ${PREFIX}admin (promover/demote) @usuario`
      );
    }

    await sendSuccessReact();
  },
};