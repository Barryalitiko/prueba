const { getDatabase } = require('../utils/database');

exports.isMuted = async (userJid) => {
  const db = await getDatabase();
  const mutedUsers = await db.get('mutedUsers');
  return mutedUsers.includes(userJid);
};





