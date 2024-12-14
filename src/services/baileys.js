const { getBuffer, getRandomName } = require("../utils");
const fs = require("fs");
const path = require("path");
const { TEMP_DIR, ASSETS_DIR } = require("../config");
const { makeWASocket } = require("@whiskeysockets/baileys");

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

//PRUEBA
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



exports.toggleAdmin = async (remoteJid, userJid, action) => {
  try {
    // Crea una instancia del socket de Baileys
    const socket = makeWASocket();

    // Validar la acción
    if (!["promote", "demote"].includes(action)) {
      throw new Error("Acción no válida. Usa 'promote' o 'demote'.");
    }

    // Ejecutar la acción de promoción o degradación
    await socket.groupParticipantsUpdate(remoteJid, [userJid], action);

    // Responder según la acción ejecutada
    return { success: true, message: `Usuario @${userJid.split("@")[0]} ha sido ${action === "promote" ? "promovido a administrador" : "degradado a miembro"}.` };
  } catch (error) {
    console.error("Error al cambiar permisos de administrador:", error);
    return { success: false, error: "No se pudo completar la acción. Verifica los permisos del bot." };
  }
};
