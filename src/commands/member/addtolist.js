const { PREFIX } = require("../../config");
const { toUserJid } = require("../../utils");
const database = require("../../utils/database");

module.exports = {
  name: "addtolist",
  description: "Añade un usuario a la lista.",
  usage: `${PREFIX}addtolist @usuario`,
  handle: async ({ args, socket, sendReply, quotedMessage }) => {
    if (!args.length && !quotedMessage) {
      return await sendReply(`❌ ${PREFIX}addtolist @usuario`);
    }

    const userToAddJid = quotedMessage ? quotedMessage.sender : toUserJid(args[0]);

    if (database.userList.includes(userToAddJid)) {
      return await sendReply("⚠️ Este usuario ya está en la lista.");
    }

    database.userList.push(userToAddJid);
    database.writeJSON("userList", database.userList);
    await sendReply(`✅ Usuario @${userToAddJid.split("@")[0]} añadido a la lista.`);
  },
};