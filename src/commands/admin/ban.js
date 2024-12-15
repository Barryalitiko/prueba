const { PREFIX, BOT_NUMBER } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const path = require("path");
const fs = require("fs");

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
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Menciona a la persona"
      );
    }

    const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
    const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

    if (memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
      throw new InvalidParameterError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Número inválido"
      );
    }

    if (memberToRemoveJid === userJid) {
      throw new DangerError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No puedes realizar la acción sobre ti mismo"
      );
    }

    const botJid = toUserJid(BOT_NUMBER);

    if (memberToRemoveJid === botJid) {
      throw new DangerError(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No puedes realizar la acción sobre el bot"
      );
    }

    // Eliminar al usuario del grupo
    await socket.groupParticipantsUpdate(
      remoteJid,
      [memberToRemoveJid],
      "remove"
    );

    await sendSuccessReact();

    // Ruta de la imagen
    const banImagePath = path.resolve(__dirname, "../../assets/images/ban.jpg");

    if (fs.existsSync(banImagePath)) {
      // Enviar la imagen si existe
      await socket.sendMessage(remoteJid, {
        image: fs.readFileSync(banImagePath),
        caption: `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 Usuario expulsado: @${
          memberToRemoveNumber
        }`,
        mentions: [memberToRemoveJid],
      });
    } else {
      // Enviar mensaje si la imagen no se encuentra
      await sendReply(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 He sacado la basura, pero no encontré la imagen de ban.`
      );
    }
  },
};