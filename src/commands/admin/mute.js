const { PREFIX, BOT_NUMBER } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { muteUser } = require("../middlewares/mute");

module.exports = {
  name: "mute",
  description: "Mutea a un usuario",
  commands: ["mute", "silenciar"],
  usage: `${PREFIX}mute @marcar_miembro ou ${PREFIX}mute respondiendo a un mensaje`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendSuccessReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚐𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona"
      );
    }

    const memberToMuteJid = isReply ? replyJid : toUserJid(args[0]);
    const memberToMuteNumber = onlyNumbers(memberToMuteJid);

    if (memberToMuteNumber.length < 7 || memberToMuteNumber.length > 15) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚐𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚞́𝚖𝚎𝚛𝚘 𝚗𝚘 in𝚟𝚊𝚕𝚒𝚍𝚘"
      );
    }

    if (memberToMuteJid === userJid) {
      throw new DangerError(
        "👻 𝙺𝚛𝚊𝚐𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗"
      );
    }

    const botJid = toUserJid(BOT_NUMBER);
    if (memberToMuteJid === botJid) {
      throw new DangerError(
        "👻 𝙺𝚛𝚊𝚐𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗"
      );
    }

    await muteUser(memberToMuteJid);
    await sendSuccessReact();
    await sendReply("👻 𝙺𝚛𝚊𝚐𝚙𝚞𝚜.𝚋𝚘𝚝 👻 He silenciado al usuario");
  },
};
