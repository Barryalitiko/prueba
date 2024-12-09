const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const CLOSED_GROUPS_FILE = "closed-groups";
const MUTED_USERS_FILE = "muted-users";

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
// borrar despues
function getMutedUsers() {
  return readJSON(MUTED_USERS_FILE);
}

function writeMutedUsers(data) {
  writeJSON(MUTED_USERS_FILE, data);
}

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
  return closedGroups.includes(groupId); // Retorna true si el grupo está cerrado
};



// borrar despues 




exports.muteMember = (groupId, userJid, muteTimeInMinutes) => {
  const mutedUsers = getMutedUsers();

  // Verificar si el usuario ya está muteado
  const existingMute = mutedUsers.find(
    (mute) => mute.userJid === userJid && mute.groupId === groupId
  );

  if (existingMute) {
    return; // El usuario ya está muteado
  }

  const muteExpiration = Date.now() + muteTimeInMinutes * 60000; // Calcular el tiempo de expiración

  mutedUsers.push({
    groupId,
    userJid,
    muteExpiration,
  });

  writeMutedUsers(mutedUsers);
};

exports.unmuteMember = (groupId, userJid) => {
  const mutedUsers = getMutedUsers();

  const index = mutedUsers.findIndex(
    (mute) => mute.userJid === userJid && mute.groupId === groupId
  );

  if (index !== -1) {
    mutedUsers.splice(index, 1); // Eliminar al usuario del listado de muteados
    writeMutedUsers(mutedUsers);
  }
};

exports.isMuted = (groupId, userJid) => {
  const mutedUsers = getMutedUsers();

  const mute = mutedUsers.find(
    (mute) => mute.userJid === userJid && mute.groupId === groupId
  );

  if (!mute) {
    return false;
  }

  // Verificar si el tiempo de muteo ha expirado
  if (mute.muteExpiration <= Date.now()) {
    this.unmuteMember(groupId, userJid); // Desmutear al usuario si el tiempo ha expirado
    return false;
  }

  return true;
};
