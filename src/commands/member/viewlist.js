const { PREFIX } = require("../../config");
const database = require("../../utils/database");

module.exports = {
  name: "viewlist",
  description: "Muestra la lista de usuarios.",
  usage: `${PREFIX}viewlist`,
  handle: async ({ sendReply }) => {
    if (database.userList.length === 0) {
      return await sendReply("👻 La lista está vacía.");
    }

    const formattedList = database.userList
      .map((jid, index) => `${index + 1}. @${jid.split("@")[0]}`)
      .join("\n");

    await sendReply(`👻 Lista de usuarios:\n\n${formattedList}`);
  },
};