const { getBuffer, getRandomName } = require("../utils");
const fs = require("fs");
const path = require("path");
const { TEMP_DIR, ASSETS_DIR } = require("../config");

/**
 * Obtiene la imagen de perfil de un usuario.
 * @param {Object} socket - La instancia del socket de Baileys.
 * @param {string} userJid - El JID del usuario.
 * @returns {Object} Datos de la imagen de perfil (buffer y ruta de archivo).
 */
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

/**
 * Actualiza la configuración del grupo para abrir o cerrar el grupo.
 * @param {string} remoteJid - El ID del grupo.
 * @param {string} setting - "announcement" para cerrar el grupo, "not_announcement" para abrirlo.
 * @returns {Object} Resultado de la operación.
 */
exports.updateGroupSettings = async (remoteJid, setting) => {
  try {
    // Crea una instancia del socket de Baileys
    const socket = makeWASocket();

    // Actualiza la configuración del grupo
    await socket.groupSettingUpdate(remoteJid, setting);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar la configuración del grupo:", error);
    return { success: false, error: error.message };
  }
};
