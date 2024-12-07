const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const NOT_GRUPO_GROUPS_FILE = "not-grupo-groups";  // Nueva constante para grupos de tipo "grupo"
const CLOSED_GROUPS_FILE = "closed-groups";  // Nueva constante para grupos cerrados

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

// Funciones para manejar los grupos no bienvenidos
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

// Funciones para manejar el auto-responder
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

// Funciones para manejar los grupos con anti-link
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

// Cerrar un grupo
exports.closeGroup = (groupId) => {
  const filename = CLOSED_GROUPS_FILE; // Usamos la nueva constante
  const closedGroups = readJSON(filename); // Leer los grupos cerrados
  
  if (!closedGroups.includes(groupId)) {
    closedGroups.push(groupId); // Agregar el grupo a la lista de cerrados
  }
  
  writeJSON(filename, closedGroups); // Guardar la lista actualizada
};

// Abrir un grupo
exports.openGroup = (groupId) => {
  const filename = CLOSED_GROUPS_FILE; // Usamos la nueva constante
  const closedGroups = readJSON(filename); // Leer los grupos cerrados
  
  const index = closedGroups.indexOf(groupId); // Buscar el grupo en la lista de cerrados
  
  if (index !== -1) {
    closedGroups.splice(index, 1); // Eliminar el grupo de la lista de cerrados (abrirlo)
  }
  
  writeJSON(filename, closedGroups); // Guardar la lista actualizada
};

// Verificar si un grupo está cerrado
exports.isGroupClosed = (groupId) => {
  const filename = CLOSED_GROUPS_FILE; // Usamos la nueva constante
  const closedGroups = readJSON(filename); // Leer los grupos cerrados
  
  return closedGroups.includes(groupId); // Retorna true si el grupo está cerrado
};
