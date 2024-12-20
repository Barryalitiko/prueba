const { getProfileImageData } = require("../services/baileys");
const fs = require("fs");
const { onlyNumbers } = require("../utils");
const { isActiveWelcomeGroup, isActiveAutoApproveGroup } = require("../utils/database");
const { warningLog } = require("../utils/logger");

exports.onGroupParticipantsUpdate = async ({
  groupParticipantsUpdate,
  socket,
}) => {
  const remoteJid = groupParticipantsUpdate.id;
  const userJid = groupParticipantsUpdate.participants[0];

  // Auto-approve group join requests
  if (groupParticipantsUpdate.action === "request" && isActiveAutoApproveGroup(remoteJid)) {
    try {
      await socket.groupParticipantsUpdate(remoteJid, [userJid], "accept");
      console.log(`Solicitud de ${userJid} aprobada automáticamente en el grupo ${remoteJid}`);
    } catch (error) {
      warningLog(`Error al aprobar automáticamente la solicitud de ${userJid}: ${error.message}`);
    }
    return;
  }

  // Welcome message for new participants
  if (!isActiveWelcomeGroup(remoteJid)) {
    return;
  }

  if (groupParticipantsUpdate.action === "add") {
    try {
      const { buffer, profileImage } = await getProfileImageData(
        socket,
        userJid
      );

      await socket.sendMessage(remoteJid, {
        image: buffer,
        caption: ` 👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 𝙱𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍𝚘 𝚊𝚕 𝚐𝚛𝚞𝚙𝚘 @${onlyNumbers(userJid)}!`,
        mentions: [userJid],
      });

      if (!profileImage.includes("default-user")) {
        fs.unlinkSync(profileImage);
      }
    } catch (error) {
      warningLog(
        "👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo enviar el mensaje de Bienvenida"
      );
    }
  }
};
