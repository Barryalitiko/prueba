const { makeWASocket } = require('@adiwajshing/baileys');
const { groupSettingUpdate } = require('@adiwajshing/baileys');
const { getBuffer, getRandomName } = require("../utils");
const fs = require("fs");
const path = require("path");
const { TEMP_DIR, ASSETS_DIR } = require("../config");

exports.getProfileImageData = async (socket, userJid) => {
  let profileImage = "";
  let buffer = null;
  let success = true;
  try {
    profileImage = await socket.profilePictureUrl(userJid, "image");
    buffer = await getBuffer(profileImage);
    const tempImage = path.resolve(TEMP_DIR, getRandomName("png"));
    fs.writeFileSync(tempImage, buffer);
    profileImage = tempImage;
  } catch (error) {
    success = false;
    profileImage = path.resolve(ASSETS_DIR, "images", "default-user.png");
    buffer = fs.readFileSync(profileImage);
  }
  return { buffer, profileImage, success };
};

exports.updateGroupSettings = async (remoteJid, setting) => {
  try {
    // Crea una instancia del socket de Baileys
    const socket = makeWASocket();

    // Actualiza la configuración del grupo
    await socket.groupSettingUpdate(remoteJid, setting);

    // Cierra la conexión del socket
    await socket.close();

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar la configuración del grupo:", error);
    return { success: false, error: error.message };
  }
};

