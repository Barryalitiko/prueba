const { PREFIX } = require("../../config");

let userList = [];

module.exports = {
  name: "list",
  description: "Gestiona una lista de usuarios (añadir, ver, eliminar).",
  commands: ["list"],
  usage: `${PREFIX}list add/remove/view @usuario (o responde a un mensaje)`,
  handle: async ({ args, isReply, quotedMessage, sendReply, mentions }) => {
    try {
      const action = args[0]?.toLowerCase();

      // Verificar que se indique una acción válida
      if (!action || !["add", "remove", "view"].includes(action)) {
        return await sendReply(
          `⚠️ Usa el comando de la siguiente manera:\n\n` +
            `➕ Añadir: ${PREFIX}list add @usuario (o responde a un mensaje)\n` +
            `➖ Eliminar: ${PREFIX}list remove @usuario (o responde a un mensaje)\n` +
            `👀 Ver lista: ${PREFIX}list view`
        );
      }

      // Acción: Ver la lista
      if (action === "view") {
        if (userList.length === 0) {
          return await sendReply("👻 La lista está vacía.");
        }

        const formattedList = userList
          .map((user, index) => `${index + 1}. @${user.split("@")[0]}`)
          .join("\n");
        return await sendReply(`📋 Lista de usuarios:\n${formattedList}`, {
          mentions: userList,
        });
      }

      // Determinar el usuario objetivo (de respuesta o menciones)
      let targetUsers = [];

      if (isReply && quotedMessage?.key?.participant) {
        targetUsers.push(quotedMessage.key.participant);
      }

      if (mentions?.length) {
        targetUsers = targetUsers.concat(mentions);
      }

      // Validar que haya al menos un usuario objetivo
      if (targetUsers.length === 0) {
        return await sendReply(
          "⚠️ Menciona a un usuario o responde a un mensaje para añadir o eliminar."
        );
      }

      // Acción: Añadir a la lista
      if (action === "add") {
        const addedUsers = [];
        const alreadyInList = [];

        targetUsers.forEach((user) => {
          if (!userList.includes(user)) {
            userList.push(user);
            addedUsers.push(user);
          } else {
            alreadyInList.push(user);
          }
        });

        let response = "";

        if (addedUsers.length) {
          response += `✅ Añadido(s): ${addedUsers
            .map((user) => `@${user.split("@")[0]}`)
            .join(", ")}.\n`;
        }

        if (alreadyInList.length) {
          response += `⚠️ Ya estaba(n): ${alreadyInList
            .map((user) => `@${user.split("@")[0]}`)
            .join(", ")}.\n`;
        }

        return await sendReply(response.trim(), { mentions: targetUsers });
      }

      // Acción: Eliminar de la lista
      if (action === "remove") {
        const removedUsers = [];
        const notInList = [];

        targetUsers.forEach((user) => {
          if (userList.includes(user)) {
            userList = userList.filter((u) => u !== user);
            removedUsers.push(user);
          } else {
            notInList.push(user);
          }
        });

        let response = "";

        if (removedUsers.length) {
          response += `✅ Eliminado(s): ${removedUsers
            .map((user) => `@${user.split("@")[0]}`)
            .join(", ")}.\n`;
        }

        if (notInList.length) {
          response += `⚠️ No estaba(n): ${notInList
            .map((user) => `@${user.split("@")[0]}`)
            .join(", ")}.\n`;
        }

        return await sendReply(response.trim(), { mentions: targetUsers });
      }
    } catch (error) {
      console.error("Error en el comando list:", error);
      await sendReply("❌ Ocurrió un problema al gestionar la lista.");
    }
  },
};