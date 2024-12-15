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
