const { PREFIX } = require("../../config");

module.exports = {
  name: "tag",
  description: "taguear mensajes",
  commands: ["tag"],
  usage: `${PREFIX}tag`,
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const { participants } = await socket.groupMetadata(remoteJid);

    const mentions = participants.map(({ id }) => id);

    await sendReact("👻");

    await sendText(`>👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻
      !\n\n${fullArgs}`, mentions);
  },
};
