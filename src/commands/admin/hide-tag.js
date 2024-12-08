const { PREFIX } = require("../../config");

module.exports = {
  name: "hide-tag",
  description: "Para mencionar a todos",
  commands: ["krampus-bot", "todos"],
  usage: `${PREFIX}hidetag motivo`,
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const { participants } = await socket.groupMetadata(remoteJid);

    const mentions = participants.map(({ id }) => id);

    await sendReact("👻");

    await sendText(`> ╤╧╤╧╤ NOTIFICACION ╤╧╤╧╤
𝖴𝗇 𝗔𝗱𝗺𝗶𝗻 𝗁𝖺 𝖼𝗈𝗇𝗏𝗈𝖼𝖺𝖽𝗈 𝖺 𝗍𝗈𝖽𝗈𝗌 𝗅𝗈𝗌 𝙢𝙞𝙚𝙢𝙗𝙧𝙤𝙨 𝘥𝘦𝘭 𝘨𝘳𝘶𝘱𝘰
> 🄺🅁🄰🄼🄿🅄🅂 ᵇᵒᵗ\n\n${fullArgs}`, mentions);
  },
};
