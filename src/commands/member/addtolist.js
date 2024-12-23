const { PREFIX } = require("../../config");
const { toUserJid, onlyNumbers } = require("../../utils");
let userList = require("../../database/userList");

module.exports = {
  name: "addtolist",
  description: "Añade un usuario a la lista.",
  usage: `${PREFIX}addtolist @usuario o respondiendo a un mensaje`,
  handle: async ({ args, isReply, socket, remoteJid, replyJid, sendReply, quotedMessage }) => {
    if (!args.length && !isReply) {
      return await sendReply("👻 Krampus.bot 👻 Menciona o responde a un usuario para añadirlo a la lista.");
    }

    const userToAddJid = isReply ? replyJid : toUserJid(args[0]);
    const userToAddNumber = onlyNumbers(userToAddJid);

    if (userToAddNumber.length < 7 || userToAddNumber.length > 15) {
      return await sendReply("❌ El número proporcionado no es válido.");
    }

    if (userList.includes(userToAddJid)) {
      return await sendReply("⚠️ Este usuario ya está en la lista.");
    }

    userList.push(userToAddJid);
    await sendReply(`✅ Usuario @${userToAddNumber} añadido a la lista.`, { mentions: [userToAddJid] });
  },
};