const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const CLOSED_GROUPS_FILE = "closed-groups";
const MUTE_MEMBERS_FILE = "muted-members";

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
function createIfNotExists(fullPath) {
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, JSON.stringify({}));
    }
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







// Función para mutear a un miembro con tiempo
exports.muteMember = (groupId, userId, muteDuration) => {
    const filename = MUTE_MEMBERS_FILE;
    const mutedMembers = readJSON(filename);
    
    // Verificar si ya existe un grupo
    if (!mutedMembers[groupId]) {
        mutedMembers[groupId] = {};
    }

    const expireTime = Date.now() + muteDuration * 60000; // Expiración del muteo en milisegundos

    mutedMembers[groupId][userId] = {
        expireTime,
        muteDuration
    };

    writeJSON(filename, mutedMembers);
};

// Función para desmutear a un miembro
exports.unmuteMember = (groupId, userId) => {
    const filename = MUTE_MEMBERS_FILE;
    const mutedMembers = readJSON(filename);

    if (mutedMembers[groupId] && mutedMembers[groupId][userId]) {
        delete mutedMembers[groupId][userId];
        writeJSON(filename, mutedMembers);
    }
};

// Verificar si un miembro está muteado y si su muteo ha expirado
exports.isMutedMember = (groupId, userId) => {
    const filename = MUTE_MEMBERS_FILE;
    const mutedMembers = readJSON(filename);

    if (mutedMembers[groupId] && mutedMembers[groupId][userId]) {
        const member = mutedMembers[groupId][userId];
        if (Date.now() < member.expireTime) {
            return true; // El miembro sigue muteado
        } else {
            // Desmutear automáticamente si ha expirado el tiempo
            this.unmuteMember(groupId, userId);
            return false; // El muteo ha expirado
        }
    }

    return false; // El miembro no está muteado
};

// Función para obtener la duración del muteo en minutos
exports.getMuteDuration = (minutes) => {
    switch (minutes) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 5:
            return 5;
        case 10:
            return 10;
        case 15:
            return 15;
        default:
            return 1; // Muteo por 1 minuto si no se proporciona un valor válido
    }
};