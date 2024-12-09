const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const CLOSED_GROUPS_FILE = "closed-groups";
const MUTE_DATA_FILE = "mute-data"; // Nuevo archivo para almacenar datos de muteo

const MAX_MUTE_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos

// Tiempos predeterminados de muteo
const SILENCE_TIMES = {
  "0": 0,             // 0: Desmutear
  "1": 1 * 60 * 1000, // 1: 1 minuto
  "2": 3 * 60 * 1000, // 2: 3 minutos
  "3": 5 * 60 * 1000, // 3: 5 minutos
  "4": 10 * 60 * 1000,// 4: 10 minutos
  "5": 15 * 60 * 1000,// 5: 15 minutos
};

function createIfNotExists(fullPath) {
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify([]));
  }
}

function readJSON(jsonFile) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
  createIfNotExists(fullPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function writeJSON(jsonFile, data) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);
  createIfNotExists(fullPath);
  fs.writeFileSync(fullPath, JSON.stringify(data));
}

// Función para leer el archivo de muteos
function readMuteJSON() {
  const fullPath = path.resolve(databasePath, `${MUTE_DATA_FILE}.json`);
  createIfNotExists(fullPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

// Función para escribir en el archivo de muteos
function writeMuteJSON(data) {
  const fullPath = path.resolve(databasePath, `${MUTE_DATA_FILE}.json`);
  createIfNotExists(fullPath);
  fs.writeFileSync(fullPath, JSON.stringify(data));
}

// Función para añadir un muteo
exports.addMute = (groupId, userId, muteKey) => {
  const muteDuration = SILENCE_TIMES[muteKey];

  if (muteDuration === undefined) {
    throw new Error("Tiempo de muteo no válido");
  }

  const muteData = readMuteJSON();

  const existingMute = muteData.find(
    (entry) => entry.groupId === groupId && entry.userId === userId
  );

  if (existingMute) {
    // Si ya está silenciado, actualizamos la duración
    existingMute.muteDuration = muteDuration;
    existingMute.muteStartTime = Date.now(); // Actualizamos el tiempo de inicio del muteo
  } else {
    // Si no está silenciado, agregamos un nuevo muteo
    muteData.push({
      groupId,
      userId,
      muteDuration,
      muteStartTime: Date.now(), // Guardamos el tiempo de inicio del muteo
    });
  }

  writeMuteJSON(muteData);
};

// Función para comprobar si un usuario está silenciado
exports.isUserMuted = (groupId, userId) => {
  const muteData = readMuteJSON();
  const userMute = muteData.find(
    (entry) => entry.groupId === groupId && entry.userId === userId
  );

  if (userMute) {
    const muteEndTime = userMute.muteStartTime + userMute.muteDuration;
    if (Date.now() > muteEndTime) {
      // Si el tiempo de muteo ha expirado, eliminamos el muteo
      this.removeMute(groupId, userId);
      return false;
    }
    return true;
  }

  return false;
};

// Función para eliminar el muteo de un usuario
exports.removeMute = (groupId, userId) => {
  const muteData = readMuteJSON();
  const updatedMuteData = muteData.filter(
    (entry) => entry.groupId !== groupId || entry.userId !== userId
  );

  writeMuteJSON(updatedMuteData);
};

// Función para obtener los tiempos predeterminados de muteo
exports.getSilenceTimes = () => {
  return SILENCE_TIMES;
};

exports.activateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename);

  const index = inactiveGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

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

exports.activateWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;

  const notWelcomeGroups = readJSON(filename);

  const index = notWelcomeGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

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

exports.getAutoResponderResponse = (match) => {
  const filename = "auto-responder";

  const responses = readJSON(filename);

  const matchUpperCase = match.toLocaleUpperCase();

  const data = responses.find(
    (response) => response.match.toLocaleUpperCase() === matchUpperCase
  );

  if (!data) {
    return null;
  }

  return data.answer;
};

exports.activateAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;

  const inactiveAutoResponderGroups = readJSON(filename);

  const index = inactiveAutoResponderGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

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

  if (index === -1) {
    return;
  }

  antiLinkGroups.splice(index, 1);

  writeJSON(filename, antiLinkGroups);
};

exports.isActiveAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename);

  return antiLinkGroups.includes(groupId);
};

exports.closeGroup = (groupId) => {
  const filename = CLOSED_GROUPS_FILE;
  const closedGroups = readJSON(filename);

  if (this.isGroupClosed(groupId)) {
    console.log(`El grupo ${groupId} ya está cerrado`); // Log si el grupo ya está cerrado
    return; // No cerramos el grupo si ya está cerrado
  }

  closedGroups.push(groupId);
  console.log(`Grupo cerrado: ${groupId}`); // Log para verificar el cierre
  writeJSON(filename, closedGroups);
};

exports.openGroup = (groupId) => {
  const filename = CLOSED_GROUPS_FILE;
  const closedGroups = readJSON(filename);

  const index = closedGroups.indexOf(groupId);

  if (index !== -1) {
    closedGroups.splice(index, 1);
    console.log(`Grupo abierto: ${groupId}`); // Log para verificar la apertura
  } else {
    console.log(`El grupo ${groupId} ya está abierto`); // Log si el grupo ya estaba abierto
  }

  writeJSON(filename, closedGroups);
};

exports.isGroupClosed = (groupId) => {
  const filename = CLOSED_GROUPS_FILE;
  const closedGroups = readJSON(filename);
    return closedGroups.includes(groupId);
};

exports.addGroupToMuteList = (groupId, userId) => {
  const muteList = readMuteJSON();

  if (!muteList[groupId]) {
    muteList[groupId] = [];
  }

  if (!muteList[groupId].includes(userId)) {
    muteList[groupId].push(userId);
  }

  writeMuteJSON(muteList);
};

exports.removeGroupFromMuteList = (groupId, userId) => {
  const muteList = readMuteJSON();

  if (muteList[groupId]) {
    const index = muteList[groupId].indexOf(userId);

    if (index !== -1) {
      muteList[groupId].splice(index, 1);
    }
  }

  writeMuteJSON(muteList);
};

exports.isUserMutedInGroup = (groupId, userId) => {
  const muteList = readMuteJSON();
  return muteList[groupId] && muteList[groupId].includes(userId);
};

exports.getMutedUsers = (groupId) => {
  const muteList = readMuteJSON();
  return muteList[groupId] || [];
};

exports.getMutedUsersForAllGroups = () => {
  return readMuteJSON();
};
