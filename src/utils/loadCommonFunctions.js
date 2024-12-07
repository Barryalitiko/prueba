exports.loadCommonFunctions = ({ socket, webMessage }) => {
  const { 
    args, 
    commandName, 
    fullArgs, 
    fullMessage, 
    isImage, 
    isReply, 
    isSticker, 
    isVideo, 
    prefix, 
    remoteJid, 
    replyJid, 
    userJid, 
    webMessage: extractedWebMessage 
  } = extractDataFromMessage(webMessage);

  if (!remoteJid) {
    return null;
  }

  const isImage = baileysIs(webMessage, "image");
  const isVideo = baileysIs(webMessage, "video");
  const isSticker = baileysIs(webMessage, "sticker");

  // (El resto de tu código permanece igual)

  return {
    args,
    commandName,
    fullArgs,
    fullMessage,
    isImage,
    isReply,
    isSticker,
    isVideo,
    prefix,
    remoteJid,
    replyJid,
    socket, // Mantén el `socket` original de los parámetros
    userJid,
    webMessage: extractedWebMessage,
    downloadImage,
    downloadSticker,
    downloadVideo,
    sendAudioFromURL,
    sendErrorReact,
    sendErrorReply,
    sendImageFromFile,
    sendImageFromURL,
    sendReact,
    sendReply,
    sendStickerFromFile,
    sendStickerFromURL,
    sendSuccessReact,
    sendSuccessReply,
    sendText,
    sendVideoFromURL,
    sendWaitReact,
    sendWaitReply,
    sendWarningReact,
    sendWarningReply,
    getGroupAdmins,
    getGroupMembers,
    isGroupAdmin,
    addGroupAdmin,
    removeGroupAdmin,
    getGroupSettings,
    updateGroupSettings,
    openGroup,
    closeGroup,
    isGroupClosed,
  };
};
