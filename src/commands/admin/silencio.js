const { PREFIX } = require("../../config");
const { addMute, isUserMuted, removeMute } = require("../../utils/database");

module.exports = {
  name: "muteo",
  description: "Mutea a un usuario en el grupo durante un tiempo determinado.",
  commands: ["muteo"],
  usage: `${PREFIX}muteo <tiempo> @usuario`,
  handle: async ({ client, message, args }) => {
    try {
      const { groupId, senderId, isAdmin, mentionedUsers } = message;

      if (!isAdmin) {
        return message.reply("🚫 Solo los administradores pueden ejecutar este comando.");
      }

      if (mentionedUsers.length === 0) {
        return message.reply("⚠️ Por favor, menciona a un usuario para mutear.");
      }

      const userToMute = mentionedUsers[0];
      const muteTime = args[0];

      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      const muteEndTimeHour = currentHour;
      const muteEndTimeMinute = currentMinute + parseInt(muteTime);

      if (muteEndTimeMinute >= 60) {
        muteEndTimeHour += Math.floor(muteEndTimeMinute / 60);
        muteEndTimeMinute %= 60;
      }

      if (muteEndTimeHour >= 24) {
        muteEndTimeHour %= 24;
      }

      addMute(groupId, userToMute, `${muteEndTimeHour}:${muteEndTimeMinute}`);
      message.reply(`🔇 El usuario @${userToMute} ha sido muteado hasta las ${muteEndTimeHour}:${muteEndTimeMinute}.`);
    } catch (error) {
      console.error(error);
      message.reply("Error al ejecutar el comando. Por favor, inténtalo de nuevo.");
    }
  },
};
