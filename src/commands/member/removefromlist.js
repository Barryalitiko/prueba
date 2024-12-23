const { PREFIX } = require("../../config");
const { toUserJid } = require("../../utils");
const database = require("../../utils/database");

module.exports = {
  name: "removefromlist",
  description: "Elimina un usuario de la lista.",
  usage: `${PREFIX}removefromlist @usuario`,
  handle: async ({ args, socket, sendReply, quotedMessage }) => {
    if (!args.length && !quotedMessage) {
      return await sendReply(`❌ ${PREFIX}removefromlist @usuario`);
    }

    const userToRemoveJid = quotedMessage ? quotedMessage.sender : toUserJid(args[0]);

    const index = database.userList.indexOf(userToRemoveJid);

    if (index === -1) {
      return await sendReply("⚠️ Este usuario no está en la lista.");
    }

    database.userList.splice(index, 1);
    database.writeJSON("userList", database.userList);
    await sendReply(`✅ Usuario @${userToRemoveJid.split("@")[0]} eliminado de la lista.`);
  },
};