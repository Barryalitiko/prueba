const { getBuffer, getRandomName } = require("../utils");
const fs = require("fs");
const path = require("path");
const { TEMP_DIR, ASSETS_DIR } = require("../config");

exports.toggleAdmin = async (socket, remoteJid, userJid, action) => {
  try {
    // Normalizar la acción
    const normalizedAction = action.toLowerCase();

    // Validar la acción
    if (!["promote", "demote"].includes(normalizedAction)) {
      throw new Error("Acción no válida. Usa 'promote' o 'demote'.");
    }

    // Ejecutar la acción de promoción o degradación
    await socket.groupParticipantsUpdate(remoteJid, [userJid], normalizedAction);

    // Responder según la acción ejecutada
    return { 
      success: true, 
      message: `Usuario @${userJid.split("@")[0]} ha sido ${normalizedAction === "promote" ? "promovido a administrador" : "degradado a miembro"}.`
    };
  } catch (error) {
    console.error("Error al cambiar permisos de administrador:", error);
    return { 
      success: false, 
      error: "No se pudo completar la acción. Verifica los permisos del bot." 
    };
  }
};