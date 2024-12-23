const { PREFIX } = require("../../config");
const { onlyNumbers } = require("../../utils");
let userList = require("../../database/userList");

module.exports = {
  name: "viewlist",
  description: "Muestra la lista de usuarios.",
  usage: `${PREFIX}viewlist`,
  handle: async ({ sendReply }) => {
    if (userList.length === 0) {
      return await sendReply("👻 La lista está vacía.");
    }

    const formattedList = userList
      .map((jid, index) => `${index + 1}. @${onlyNumbers(jid)}`)
      .join("\n");

    await sendReply(`👻 Lista de usuarios:\n\n${formattedList}`, { mentions: userList });
  },
};