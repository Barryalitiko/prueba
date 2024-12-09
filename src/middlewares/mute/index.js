const { getDatabase } = require('../utils/database');

exports.isMuted = async (userJid) => {
  const db = await getDatabase();
  const mutedUsers = await db.get('mutedUsers');
  return mutedUsers.includes(userJid);
};

exports.muteUser = async (userJid) => {
  const db = await getDatabase();
  const mutedUsers = await db.get('mutedUsers') || [];
  if (!mutedUsers.includes(userJid)) {
    mutedUsers.push(userJid);
    await db.set('mutedUsers', mutedUsers);
  }
};

exports.unmuteUser = async (userJid) => {
  const db = await getDatabase();
  const mutedUsers = await db.get('mutedUsers') || [];
  if (mutedUsers.includes(userJid)) {
    mutedUsers.splice(mutedUsers.indexOf(userJid), 1);
    await db.set('mutedUsers', mutedUsers);
  }
};
