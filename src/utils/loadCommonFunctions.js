const { BOT_EMOJI } = require("../config");
const { extractDataFromMessage, baileysIs, download } = require(".");
const { waitMessage } = require("./messages");
const fs = require("fs");

exports.loadCommonFunctions = ({ socket, webMessage }) => {
  const {
    args,
    commandName,
    fullArgs,
    fullMessage,
    isReply,
    prefix,
    remoteJid,
    replyJid,
    userJid,
  } = extractDataFromMessage(webMessage);

  if (!remoteJid) {
    return null;
  }

  const isImage = baileysIs(webMessage, "image");
  const isVideo = baileysIs(webMessage, "video");
  const isSticker = baileysIs(webMessage, "sticker");

  const downloadImage = async (webMessage, fileName) => {
    return await download(webMessage, fileName, "image", "png");
  };

  const downloadSticker = async (webMessage, fileName) => {
    return await download(webMessage, fileName, "sticker", "webp");
  };

  const downloadVideo = async (webMessage, fileName) => {
    return await download(webMessage, fileName, "video", "mp4");
  };

  const sendText = async (text, mentions) => {
    let optionalParams = {};
    if (mentions?.length) {
      optionalParams = { mentions };
    }
    return await socket.sendMessage(remoteJid, {
      text: `${BOT_EMOJI} ${text}`,
      ...optionalParams,
    });
  };

  const sendReply = async (text) => {
    return await socket.sendMessage(
      remoteJid,
      { text: `${BOT_EMOJI} ${text}` },
      { quoted: webMessage }
    );
  };

  const sendReact = async (emoji) => {
    return await socket.sendMessage(remoteJid, {
      react: {
        text: emoji,
        key: webMessage.key,
      },
    });
  };

  const sendSuccessReact = async () => {
    return await sendReact("✅");
  };

  const sendWaitReact = async () => {
    return await sendReact("⏳");
  };

  const sendWarningReact = async () => {
    return await sendReact("⚠️");
  };

  const sendErrorReact = async () => {
    return await sendReact("❌");
  };

  const sendSuccessReply = async (text) => {
    await sendSuccessReact();
    return await sendReply(`👻 ${text}`);
  };

  const sendWaitReply = async (text) => {
    await sendWaitReact();
    return await sendReply(`⏳ Espera! ${text || waitMessage}`);
  };

  const sendWarningReply = async (text) => {
    await sendWarningReact();
    return await sendReply(`⚠️ Advertencia! ${text}`);
  };

  const sendErrorReply = async (text) => {
    await sendErrorReact();
    return await sendReply(`☠ Error! ${text}`);
  };

  const sendStickerFromFile = async (file) => {
    return await socket.sendMessage(remoteJid, {
      sticker: fs.readFileSync(file),
    }, { quoted: webMessage });
  };

  const sendStickerFromURL = async (url) => {
    return await socket.sendMessage(remoteJid, {
      sticker: { url },
    }, { url, quoted: webMessage });
  };

  const sendImageFromFile = async (file, caption = "") => {
    return await socket.sendMessage(remoteJid, {
      image: fs.readFileSync(file),
      caption: caption ? `${BOT_EMOJI} ${caption}` : "",
    }, { quoted: webMessage });
  };

  const sendImageFromURL = async (url, caption = "") => {
    return await socket.sendMessage(remoteJid, {
      image: { url },
      caption: caption ? `${BOT_EMOJI} ${caption}` : "",
    }, { url, quoted: webMessage });
  };

  const sendAudioFromURL = async (url) => {
    return await socket.sendMessage(remoteJid, {
      audio: { url },
      mimetype: "audio/mp4",
    }, { url, quoted: webMessage });
  };

  const sendVideoFromURL = async (url) => {
    return await socket.sendMessage(remoteJid, {
      video: { url },
    }, { url, quoted: webMessage });
  };

  const sendReplyOpenGroup = async (text) => {
    return await sendReply(`🔓 ${text}`);
  };

  const sendReplyCloseGroup = async (text) => {
    return await sendReply(`🔒 ${text}`);
  };

  // Nueva función para manejar el cierre de grupos
  const closeGroupCommand = async (groupId) => {
    if (isGroupClosed(groupId)) {
      await sendErrorReply("Este grupo ya está cerrado.");
    } else {
      closeGroup(groupId); // Llamar a la función del archivo database.js
      await sendSuccessReply("Grupo cerrado con éxito.");
    }
  };

  // Nueva función para manejar la apertura de grupos
  const openGroupCommand = async (groupId) => {
    if (!isGroupClosed(groupId)) {
      await sendErrorReply("Este grupo ya está abierto.");
    } else {
      openGroup(groupId); // Llamar a la función del archivo database.js
      await sendSuccessReply("Grupo abierto con éxito.");
    }
  };

  // Nueva función para obtener la URL de la foto de perfil
  const getProfilePicture = async (jid) => {
    try {
      const url = await socket.getProfilePictureUrl(jid);
      return url || "https://example.com/default-profile-picture.png"; // URL por defecto si no hay foto
    } catch (error) {
      console.error("Error al obtener la foto de perfil:", error);
      return "https://example.com/default-profile-picture.png"; // URL de fallback en caso de error
    }
  };

  return {
    args,
    commandName,
    fullArgs,
    fullMessage,
    isReply,
    prefix,
    remoteJid,
    replyJid,
    socket,
    userJid,
    webMessage,
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
    closeGroupCommand, // Nueva función para cerrar grupos
    openGroupCommand,  // Nueva función para abrir grupos
    getProfilePicture, // Nueva función para obtener la foto de perfil
  };
};