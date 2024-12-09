const { PREFIX } = require("../../config");
const { addMute, isUserMuted, removeMute } = require("../../utils/database");

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

    const muteDurations = {
      1: 1 * 60 * 1000, // 1 minuto
      2: 3 * 60 * 1000, // 3 minutos
      3: 5 * 60 * 1000, // 5 minutos
      4: 10 * 60 * 1000, // 10 minutos
      5: 15 * 60 * 1000, // 15 minutos
    };

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

    const muteDuration = muteDurations[muteIndex];

    addMute(groupId, userToMute, muteDuration);
    message.reply(`🔇 El usuario @${userToMute} ha sido silenciado por ${muteDuration / 60000} minutos.`);
  },
};
