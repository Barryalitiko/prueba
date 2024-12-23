const { PREFIX } = require("../../config");
const { toUserJid, onlyNumbers } = require("../../utils");
let userList = require("../../database/userList");

module.exports = {
  name: "removefromlist",
  description: "Elimina un usuario de la lista.",
  usage: `${PREFIX}removefromlist @usuario o respondiendo a un mensaje`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, quotedMessage }) => {
    if (!args.length && !isReply) {
      return await sendReply("👻 Krampus.bot 👻 Menciona o responde a un usuario para eliminarlo de la lista.");
    }

    const userToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
    const userToRemoveNumber = onlyNumbers(userToRemoveJid);

    const index = userList.indexOf(userToRemoveJid);

    if (index === -1) {
      return await sendReply("⚠️ Este usuario no está en la lista.");
    }

    userList.splice(index, 1);
    await sendReply(`✅ Usuario @${userToRemoveNumber} eliminado de la lista.`, { mentions: [userToRemoveJid] });
  },
};