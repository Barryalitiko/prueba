const { PREFIX } = require("../../config");
const { addMute, isUserMuted, removeMute } = require("../../utils/database");
const { SILENCE_TIMES } = require("../../utils/database");

module.exports = {
  name: "silencio",
  description: "Mutea o desmutea a un usuario en el grupo.",
  commands: ["silencio"],
  usage: `${PREFIX}silencio <0-5> @usuario`,
  handle: async ({ client, message, args }) => {
    const { groupId, senderId, isAdmin, mentionedUsers } = message;

    if (!isAdmin) {
      return message.reply("🚫 Solo los administradores pueden ejecutar este comando.");
    }

    if (mentionedUsers.length === 0) {
      return message.reply("⚠️ Por favor, menciona a un usuario para silenciar o desilenciar.");
    }

    const userToMute = mentionedUsers[0];
    const muteIndex = args[0];

    if (muteIndex === "0") {
      if (!await isUserMuted(groupId, userToMute)) {
        return message.reply("⚠️ El usuario no está silenciado.");
      }
      removeMute(groupId, userToMute);
      return message.reply(`🔊 El usuario @${userToMute} ha sido desmuteado.`);
    }

    if (muteIndex < 1 || muteIndex > 5) {
      return message.reply("⚠️ Parámetro inválido. Usa un número entre 1 y 5 para definir el tiempo de muteo.");
    }

    const muteDuration = SILENCE_TIMES[muteIndex];

    addMute(groupId, userToMute, muteDuration);
    message.reply(`🔇 El usuario @${userToMute} ha sido silenciado por ${muteDuration / 60000} minutos.`);
  },
};
