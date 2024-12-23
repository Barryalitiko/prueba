const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const CLOSED_GROUPS_FILE = "closed-groups";
const MUTE_DATA_FILE = "mute-data";
const AUTO_APPROVE_GROUPS_FILE = "auto-approve-groups";
const USER_LIST_FILE = "userList";

const database = {
  userList: [],

  writeJSON: (jsonFile, data) => {
    const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
    fs.writeFileSync(fullPath, JSON.stringify(data));
  },

  readJSON: (jsonFile) => {
    const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  },

  // Función auxiliar para crear el archivo si no existe
  createIfNotExists: (fullPath) => {
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify([]));
    }
  },

  // Funciones de grupos inactivos
  activateGroup: (groupId) => {
    const filename = INACTIVE_GROUPS_FILE;
    const inactiveGroups = database.readJSON(filename);
    const index = inactiveGroups.indexOf(groupId);
    if (index === -1) return;
    inactiveGroups.splice(index, 1);
    database.writeJSON(filename, inactiveGroups);
  },

  deactivateGroup: (groupId) => {
    const filename = INACTIVE_GROUPS_FILE;
    const inactiveGroups = database.readJSON(filename);
    if (!inactiveGroups.includes(groupId)) {
      inactiveGroups.push(groupId);
    }
    database.writeJSON(filename, inactiveGroups);
  },

  isActiveGroup: (groupId) => {
    const filename = INACTIVE_GROUPS_FILE;
    const inactiveGroups = database.readJSON(filename);
    return !inactiveGroups.includes(groupId);
  },

  // Funciones de bienvenida de grupos
  activateWelcomeGroup: (groupId) => {
    const filename = NOT_WELCOME_GROUPS_FILE;
    const notWelcomeGroups = database.readJSON(filename);
    const index = notWelcomeGroups.indexOf(groupId);
    if (index === -1) return;
    notWelcomeGroups.splice(index, 1);
    database.writeJSON(filename, notWelcomeGroups);
  },

  deactivateWelcomeGroup: (groupId) => {
    const filename = NOT_WELCOME_GROUPS_FILE;
    const notWelcomeGroups = database.readJSON(filename);
    if (!notWelcomeGroups.includes(groupId)) {
      notWelcomeGroups.push(groupId);
    }
    database.writeJSON(filename, notWelcomeGroups);
  },

  isActiveWelcomeGroup: (groupId) => {
    const filename = NOT_WELCOME_GROUPS_FILE;
    const notWelcomeGroups = database.readJSON(filename);
    return !notWelcomeGroups.includes(groupId);
  },

  // Funciones de auto-responder de grupos
  getAutoResponderResponse: (match) => {
    const filename = "auto-responder";
    const responses = database.readJSON(filename);
    const matchUpperCase = match.toLocaleUpperCase();
    const data = responses.find((response) => response.match.toLocaleUpperCase() === matchUpperCase);
    if (!data) return null;
    return data.answer;
  },

  activateAutoResponderGroup: (groupId) => {
    const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;
    const inactiveAutoResponderGroups = database.readJSON(filename);
    const index = inactiveAutoResponderGroups.indexOf(groupId);
    if (index === -1) return;
    inactiveAutoResponderGroups.splice(index, 1);
    database.writeJSON(filename, inactiveAutoResponderGroups);
  },

  deactivateAutoResponderGroup: (groupId) => {
    const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;
    const inactiveAutoResponderGroups = database.readJSON(filename);
    if (!inactiveAutoResponderGroups.includes(groupId)) {
      inactiveAutoResponderGroups.push(groupId);
    }
    database.writeJSON(filename, inactiveAutoResponderGroups);
  },

  isActiveAutoResponderGroup: (groupId) => {
    const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;
    const inactiveAutoResponderGroups = database.readJSON(filename);
    return !inactiveAutoResponderGroups.includes(groupId);
  },

  // Funciones de anti-link de grupos
  activateAntiLinkGroup: (groupId) => {
    const filename = ANTI_LINK_GROUPS_FILE;
    const antiLinkGroups = database.readJSON(filename);
    if (!antiLinkGroups.includes(groupId)) {
      antiLinkGroups.push(groupId);
    }
    database.writeJSON(filename, antiLinkGroups);
  },

  deactivateAntiLinkGroup: (groupId) => {
    const filename = ANTI_LINK_GROUPS_FILE;
    const antiLinkGroups = database.readJSON(filename);
    const index = antiLinkGroups.indexOf(groupId);
    if (index === -1) return;
    antiLinkGroups.splice(index, 1);
    database.writeJSON(filename, antiLinkGroups);
  },

  isActiveAntiLinkGroup: (groupId) => {
    const filename = ANTI_LINK_GROUPS_FILE;
    const antiLinkGroups = database.readJSON(filename);
    return antiLinkGroups.includes(groupId);
  },

  // Funciones de grupos cerrados
  closeGroup: (groupId) => {
    const filename = CLOSED_GROUPS_FILE;
    const closedGroups = database.readJSON(filename);
    if (this.isGroupClosed(groupId)) {
      console.log(`El grupo ${groupId} ya está cerrado`);
      return;
    }
    closedGroups.push(groupId);
    console.log(`Grupo cerrado: ${groupId}`);
    database.writeJSON(filename, closedGroups);
  },

  openGroup: (groupId) => {
    const filename = CLOSED_GROUPS_FILE;
    const closedGroups = database.readJSON(filename);
    const index = closedGroups.indexOf(groupId);
    if (index !== -1) {
      closedGroups.splice(index, 1);
      console.log(`Grupo abierto: ${groupId}`);
    } else {
      console.log(`El grupo ${groupId} ya está abierto`);
    }
    database.writeJSON(filename, closedGroups);
  },

  isGroupClosed: (groupId) => {
    const filename = CLOSED_GROUPS_FILE;
    const closedGroups = database.readJSON(filename);
    return closedGroups.includes(groupId);
  },

  // Funciones de muteo de usuarios
  addMute: (groupId, userId, muteDuration) => {
    const filename = MUTE_DATA_FILE;
    const muteData = database.readJSON(filename);
    const muteStartTime = Date.now();
    const muteEndTime = muteStartTime + muteDuration * 1000;
    const userMute = {
      groupId,
      userId,
      muteStartTime,
      muteEndTime,
    };
    muteData.push(userMute);
    database.writeJSON(filename, muteData);
  },

  isUserMuted: (groupId, userId) => {
    const filename = MUTE_DATA_FILE;
    const muteData = database.readJSON(filename);
    const userMute = muteData.find((entry) => entry.groupId === groupId && entry.userId === userId);
    if (!userMute) {
      return false;
    }
    const currentTime = Date.now();
    if (currentTime >= userMute.muteEndTime) {
      database.removeMute(groupId, userId);
      return false;
    }
    return true;
  },

  removeMute: (groupId, userId) => {
    const filename = MUTE_DATA_FILE;
    const muteData = database.readJSON(filename);
    const index = muteData.findIndex((entry) => entry.groupId === groupId && entry.userId === userId);
    if (index !== -1) {
      muteData.splice(index, 1);
      database.writeJSON(filename, muteData);
    }
  },

  //NUEVO
  toggleAdmin: async (socket, groupId, userId) => {
    try {
      // Obtener detalles del grupo
      const groupMetadata = await socket.groupMetadata(groupId);
      // Verificar si el usuario ya es administrador
      const isAdmin = groupMetadata.participants.some((participant) => (link unavailable) === userId && participant.admin);
      if (isAdmin) {
        // Revocar permisos de administrador
        await socket.groupParticipantsUpdate(groupId, [userId], "demote");
        return `Se revocaron los permisos de administrador para el usuario ${userId}`;
      } else {
        // Otorgar permisos de administrador
        await socket.groupParticipantsUpdate(groupId, [userId], "promote");
        return `Se otorgaron permisos de administrador al usuario ${userId}`;
      }
    } catch (error) {
      console.error("Error en toggleAdmin:", error);
      throw new Error("No se pudo alternar el estado de administrador. Verifica los datos proporcionados.");
    }
  },

  toggleAutoApprove: (groupId, status) => {
    const autoApproveGroups = database.readJSON(AUTO_APPROVE_GROUPS_FILE);
    const index = autoApproveGroups.indexOf(groupId);
    if (status && index === -1) {
      autoApproveGroups.push(groupId);
    } else if (!status && index !== -1) {
      autoApproveGroups.splice(index, 1);
    }
    database.writeJSON(AUTO_APPROVE_GROUPS_FILE, autoApproveGroups);
  },

  isAutoApproveActive: (groupId) => {
    const autoApproveGroups = database.readJSON(AUTO_APPROVE_GROUPS_FILE);
    return autoApproveGroups.includes(groupId);
  },
};

module.exports = database;
