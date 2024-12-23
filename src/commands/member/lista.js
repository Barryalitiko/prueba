const { PREFIX } = require("../../config");
const { toUserJid, onlyNumbers } = require("../../utils");

let userList = [];

module.exports = {
  name: "listmanager",
  description: "Administra una lista de usuarios.",
  commands: ["addtolist", "viewlist", "removefromlist"],
  usage: `
    ${PREFIX}addtolist @usuario o respondiendo a un mensaje
    ${PREFIX}viewlist
    ${PREFIX}removefromlist @usuario o respondiendo a un mensaje
  `,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    quotedMessage,
  }) => {
    const command = args.shift();

    switch (command) {
      case "addtolist":
        if (!args.length && !isReply) {
          return await sendReply(
            "👻 Krampus.bot 👻 Menciona o responde a un usuario para añadirlo a la lista."
          );
        }

        // Obtener el usuario a añadir
        const userToAddJid = isReply ? replyJid : toUserJid(args[0]);
        const userToAddNumber = onlyNumbers(userToAddJid);

        if (userToAddNumber.length < 7 || userToAddNumber.length > 15) {
          return await sendReply("❌ El número proporcionado no es válido.");
        }

        // Verificar si ya está en la lista
        if (userList.includes(userToAddJid)) {
          return await sendReply("⚠️ Este usuario ya está en la lista.");
        }

        // Añadir a la lista
        userList.push(userToAddJid);
        await sendReply(
          `✅ Usuario @${userToAddNumber} añadido a la lista.`,
          { mentions: [userToAddJid] }
        );
        break;

      case "viewlist":
        if (userList.length === 0) {
          return await sendReply("👻 La lista está vacía.");
        }

        const formattedList = userList
          .map((jid, index) => `${index + 1}. @${onlyNumbers(jid)}`)
          .join("\n");

        await sendReply(`👻 Lista de usuarios:\n\n${formattedList}`, {
          mentions: userList,
        });
        break;

      case "removefromlist":
        if (!args.length && !isReply) {
          return await sendReply(
            "👻 Krampus.bot 👻 Menciona o responde a un usuario para eliminarlo de la lista."
          );
        }

        // Obtener el usuario a eliminar
        const userToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
        const userToRemoveNumber = onlyNumbers(userToRemoveJid);

        // Verificar si está en la lista
        const index = userList.indexOf(userToRemoveJid);
        if (index === -1) {
          return await sendReply("⚠️ Este usuario no está en la lista.");
        }

        // Eliminar de la lista
        userList.splice(index, 1);
        await sendReply(
          `✅ Usuario @${userToRemoveNumber} eliminado de la lista.`,
          { mentions: [userToRemoveJid] }
        );
        break;

      default:
        await sendReply(
          "❌ Comando no reconocido. Usa `addtolist`, `viewlist` o `removefromlist`."
        );
    }
  },
};