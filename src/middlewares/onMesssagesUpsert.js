const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { isMuted } = require("../middlewares/mute");

exports.onMessagesUpsert = async ({ socket, messages }) => {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    const userJid = webMessage.key.remoteJid;
    if (await isMuted(userJid)) {
      continue;
    }

    const commonFunctions = loadCommonFunctions({ socket, webMessage });
    if (!commonFunctions) {
      continue;
    }
    await dynamicCommand(commonFunctions);
  }
};
