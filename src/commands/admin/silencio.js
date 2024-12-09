const { PREFIX } = require("../../config");
const { addMute, isUserMuted, removeMute } = require(../../utils/database");
const { silence_times } = require("../../utils/database");

module.exports = {
  name: "silencio",
  description: "Mutea o desmutea a un usuario en el grupo.",
  commands: ["silencio"],
  usage: `${PREFIX}silencio <0-5> @usuario`,
  handle: async ({ client, message, args }) => {
    const { groupId, senderId, isAdmin, mentionedUsers } = message;

    // Verificar si el usuario que ejecuta el comando es administrador
    if (!isAdmin) {
      return message.reply("🚫 Solo los administradores pueden ejecutar este comando.");
    }

    // Verificar si hay un usuario mencionado
    if (mentionedUsers.length === 0) {
      return message.reply("⚠️ Por favor, menciona a un usuario para silenciar o desilenciar.");
    }

    const userToMute = mentionedUsers[0]; // Primer usuario mencionado
    const muteIndex = args[0]; // Primer argumento es el índice de tiempo

    if (muteIndex === "0") {
      // Desmutear al usuario
      if (!await isUserMuted(groupId, userToMute)) {
        return message.reply("⚠️ El usuario no está silenciado.");
      }

      removeMute(groupId, userToMute);
      return message.reply(`🔊 El usuario @${userToMute} ha sido desmuteado.`);
    }

    if (muteIndex < 1 || muteIndex > 5) {
      return message.reply("⚠️ Parámetro inválido. Usa un número entre 1 y 5 para definir el tiempo de muteo.");
    }

    // Obtener el tiempo de muteo desde el array silence_times
    const muteDuration = silence_times[muteIndex];

    // Agregar el muteo
    addMute(groupId, userToMute, muteDuration);

    // Responder con la confirmación
    message.reply(`🔇 El usuario @${userToMute} ha sido silenciado por ${muteDuration / 60000} minutos.`);
  },
};