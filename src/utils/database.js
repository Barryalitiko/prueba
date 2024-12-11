const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const CLOSED_GROUPS_FILE = "closed-groups";
const MUTE_DATA_FILE = "mute-data";

// Función auxiliar para crear el archivo si no existe
function createIfNotExists(fullPath) {
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify([]));
  }
}

// Función para leer un archivo JSON
function readJSON(jsonFile) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
  createIfNotExists(fullPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

// Función para escribir datos en un archivo JSON
function writeJSON(jsonFile, data) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
  createIfNotExists(fullPath);
  fs.writeFileSync(fullPath, JSON.stringify(data));
}

// Funciones de grupos inactivos
exports.activateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;
  const inactiveGroups = readJSON(filename);
  const index = inactiveGroups.indexOf(groupId);
  if (index === -1) return;
  inactiveGroups.splice(index, 1);
  writeJSON(filename, inactiveGroups);
};

exports.deactivateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;
  const inactiveGroups = readJSON(filename);
  if (!inactiveGroups.includes(groupId)) {
    inactiveGroups.push(groupId);
  }
  writeJSON(filename, inactiveGroups);
};

exports.isActiveGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;
  const inactiveGroups = readJSON(filename);
  return !inactiveGroups.includes(groupId);
};

// Funciones de bienvenida de grupos
exports.activateWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;
  const notWelcomeGroups = readJSON(filename);
  const index = notWelcomeGroups.indexOf(groupId);
  if (index === -1) return;
  notWelcomeGroups.splice(index, 1);
  writeJSON(filename, notWelcomeGroups);
};

exports.deactivateWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;
  const notWelcomeGroups = readJSON(filename);
  if (!notWelcomeGroups.includes(groupId)) {
    notWelcomeGroups.push(groupId);
  }
  writeJSON(filename, notWelcomeGroups);
};

exports.isActiveWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;
  const notWelcomeGroups = readJSON(filename);
  return !notWelcomeGroups.includes(groupId);
};

// Funciones de auto-responder de grupos
exports.getAutoResponderResponse = (match) => {
  const filename = "auto-responder";
  const responses = readJSON(filename);
  const matchUpperCase = match.toLocaleUpperCase();
  const data = responses.find(
    (response) => response.match.toLocaleUpperCase() === matchUpperCase
  );
  if (!data) return null;
  return data.answer;
};

exports.activateAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;
  const inactiveAutoResponderGroups = readJSON(filename);
  const index = inactiveAutoResponderGroups.indexOf(groupId);
  if (index === -1) return;
  inactiveAutoResponderGroups.splice(index, 1);
  writeJSON(filename, inactiveAutoResponderGroups);
};

exports.deactivateAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;
  const inactiveAutoResponderGroups = readJSON(filename);
  if (!inactiveAutoResponderGroups.includes(groupId)) {
    inactiveAutoResponderGroups.push(groupId);
  }
  writeJSON(filename, inactiveAutoResponderGroups);
};

exports.isActiveAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;
  const inactiveAutoResponderGroups = readJSON(filename);
  return !inactiveAutoResponderGroups.includes(groupId);
};

// Funciones de anti-link de grupos
exports.activateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;
  const antiLinkGroups = readJSON(filename);
  if (!antiLinkGroups.includes(groupId)) {
    antiLinkGroups.push(groupId);
  }
  writeJSON(filename, antiLinkGroups);
};

exports.deactivateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;
  const antiLinkGroups = readJSON(filename);
  const index = antiLinkGroups.indexOf(groupId);
  if (index === -1) return;
  antiLinkGroups.splice(index, 1);
  writeJSON(filename, antiLinkGroups);
};

exports.isActiveAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;
  const antiLinkGroups = readJSON(filename);
  return antiLinkGroups.includes(groupId);
};

// Funciones de grupos cerrados
exports.closeGroup = (groupId) => {
  const filename = CLOSED_GROUPS_FILE;
  const closedGroups = readJSON(filename);
  if (this.isGroupClosed(groupId)) {
    console.log(`El grupo ${groupId} ya está cerrado`);
    return;
  }
  closedGroups.push(groupId);
  console.log(`Grupo cerrado: ${groupId}`);
  writeJSON(filename, closedGroups);
};

exports.openGroup = (groupId) => {
  const filename = CLOSED_GROUPS_FILE;
  const closedGroups = readJSON(filename);
  const index = closedGroups.indexOf(groupId);
  if (index !== -1) {
    closedGroups.splice(index, 1);
    console.log(`Grupo abierto: ${groupId}`);
  } else {
    console.log(`El grupo ${groupId} ya está abierto`);
  }
  writeJSON(filename, closedGroups);
};

exports.isGroupClosed = (groupId) => {
  const filename = CLOSED_GROUPS_FILE;
  const closedGroups = readJSON(filename);
  return closedGroups.includes(groupId);
};

// Funciones de muteo de usuarios
exports.addMute = (groupId, userId, muteDuration) => {
  const filename = MUTE_DATA_FILE;
  const muteData = readJSON(filename);
  const muteStartTime = Date.now();
  const muteEndTime = muteStartTime + muteDuration * 1000;
  const userMute = exports.addMute = (groupId, userId) => {
  const filename = MUTE_DATA_FILE;
  const muteData = readJSON(filename);
  const userMute = {
    groupId,
    userId,
  };
  muteData.push(userMute);
  writeJSON(filename, muteData);
};

exports.isUserMuted = (groupId, userId) => {
  const filename = MUTE_DATA_FILE;
  const muteData = readJSON(filename);
  const userMute = muteData.find((entry) => entry.groupId === groupId && entry.userId === userId);
  if (!userMute) {
    return false;
  }
  const currentTime = Date.now();
  if (currentTime >= userMute.muteEndTime) {
    this.removeMute(groupId, userId);
    return false;
  }
  return true;
};

exports.removeMute = (groupId, userId) => {
  const filename = MUTE_DATA_FILE;
  const muteData = readJSON(filename);
  const index = muteData.findIndex((entry) => entry.groupId === groupId && entry.userId === userId);
  if (index !== -1) {
    muteData.splice(index, 1);
    writeJSON(filename, muteData);
};