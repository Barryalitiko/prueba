const { PREFIX, BOT_NUMBER, ASSETS_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const path = require("path");

module.exports = {
  name: "ban",
  description: "Banear",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @marcar_miembro
  
ou 

${PREFIX}ban respondiendo a un mensaje`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendSuccessReact,
    sendImageFromFile,  // Asegúrate de tener esta función disponible
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona"
      );
    }

    const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
    const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

    if (memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
      throw new InvalidParameterError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚞́𝚖𝚎𝚛𝚘 𝚗𝚘 in𝚟𝚊𝚕𝚒𝚍𝚘");
    }

    if (memberToRemoveJid === userJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗");
    }

    const botJid = toUserJid(BOT_NUMBER);

    if (memberToRemoveJid === botJid) {
      throw new DangerError("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗");
    }

    await socket.groupParticipantsUpdate(
      remoteJid,
      [memberToRemoveJid],
      "remove"
    );

    await sendSuccessReact();

    // Enviar la imagen "ban.jpg" desde la carpeta "assets/images"
    await sendImageFromFile(
      path.join(ASSETS_DIR, "images", "ban.jpg"),
      "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 He sacado la basura"
    );
  },
};