const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { openGroup, closeGroup, isGroupClosed } = require("../../utils/database");

module.exports = {
  name: "grupo",
  description: "Abre o cierra el grupo para que los miembros puedan enviar mensajes.",
  commands: ["grupo", "configgrupo"],
  usage: `${PREFIX}grupo (1/0)`, // 1 para abrir, 0 para cerrar
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    // Verificar que se haya recibido un argumento
    if (!args.length) {
      throw new InvalidParameterError(
        "🚨 ¡Error! 🚨 Escribe 1 para abrir el grupo o 0 para cerrarlo. 🤔"
      );
    }

    // Determinar si se debe abrir o cerrar el grupo
    const action = args[0] === "1" ? "open" : args[0] === "0" ? "close" : null;

    // Validar los parámetros (solo se aceptan 1 o 0)
    if (!action) {
      throw new InvalidParameterError(
        "🚫 ¡Invalido! 🚫 Solo puedes usar 1 para abrir el grupo o 0 para cerrarlo. 🤷‍♂️"
      );
    }

    try {
      // Verificar si el grupo está cerrado
      if (action === "open" && !(await isGroupClosed(remoteJid))) {
        await sendReply("👍 ¡Listo! 👍 El grupo ya está abierto. 🤩");
        return;
      }

      // Verificar si el grupo está abierto
      if (action === "close" && (await isGroupClosed(remoteJid))) {
        await sendReply("👍 ¡Listo! 👍 El grupo ya está cerrado. 🤐");
        return;
      }

      // Abrir o cerrar el grupo
      if (action === "open") {
        await openGroup(remoteJid);
        await sendSuccessReact();
        await sendReply("🔓 ¡Abierto! 🔓 El grupo ha sido abierto correctamente. 🎉");
      } else if (action === "close") {
        await closeGroup(remoteJid);
        await sendSuccessReact();
        await sendReply("🔒 ¡Cerrado! 🔒 El grupo ha sido cerrado correctamente. 🚫");
      }
    } catch (error) {
      console.error(error);
      await sendReply("🚨 ¡Error! 🚨 No se pudo actualizar la configuración del grupo. Inténtalo de nuevo más tarde. 🤔");
    }
  },
};
