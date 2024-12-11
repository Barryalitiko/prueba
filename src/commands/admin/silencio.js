const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { addMute, removeMute, isUserMuted } = require("../../utils/database");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario en el grupo.",
  commands: ["mute"],
  usage: `${PREFIX}mute @usuario`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid, mentionedJid }) => {
    if (args.length < 1 || !mentionedJid) {
      throw new InvalidParameterError(
        "Uso incorrecto! Usa el comando así: \n`!mute @usuario`"
      );
    }

    const userId = mentionedJid[0];
    if (await isUserMuted(remoteJid, userId)) {
      await sendReply("Este usuario ya está silenciado en este grupo.");
      return;
    }

    await addMute(remoteJid, userId);
    await sendSuccessReact();
    await sendReply(`El usuario @${userId} ha sido silenciado.`);
  },
};
```
En este ejemplo, el comando `!mute` solo requiere el nombre del usuario que se quiere silenciar. No se especifica un tiempo de silencio.

Recuerda que debes modificar la función `addMute` en el archivo `database.js` para que no requiera un tiempo de silencio. Por ejemplo:
```
exports.addMute = (groupId, userId) => {
  const filename = MUTE_DATA_FILE;
  const muteData = readJSON(filename);
  const userMute = {
    groupId,
    userId,
  };
  muteData.push(userMute);
  writeJSON(filename, muteData);
};
