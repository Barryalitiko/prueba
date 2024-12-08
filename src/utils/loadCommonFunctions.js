const { BOT_EMOJI } = require("../config");
const { extractDataFromMessage, baileysIs, download } = require(".");
const { waitMessage } = require("./messages");
const fs = require("fs");

exports.loadCommonFunctions = ({ socket, messageData: initialMessageData }) => {
  const { message } = initialMessageData;  // Utilizamos initialMessageData para evitar conflicto con 'messageData' dentro de la función
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
  } = extractDataFromMessage(message);

  if (!remoteJid) {
    return null;
  }

  const isImage = baileysIs(message, "image");
  const isVideo = baileysIs(message, "video");
  const isSticker = baileysIs(message, "sticker");

  const downloadImage = async (message, fileName) => {
    return await download(message, fileName, "image", "png");
  };

  const downloadSticker = async (message, fileName) => {
    return await download(message, fileName, "sticker", "webp");
  };

  const downloadVideo = async (message, fileName) => {
    return await download(message, fileName, "video", "mp4");
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
    return await socket.sendMessage(remoteJid, {
      text: `${BOT_EMOJI} ${text}`,
    }, { quoted: message });
  };

  const sendReact = async (emoji) => {
    return await socket.sendMessage(remoteJid, {
      react: {
        text: emoji,
        key: message.key,
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
    }, { quoted: message });
  };

  const sendStickerFromURL = async (url) => {
    return await socket.sendMessage(remoteJid, {
      sticker: { url },
    }, { url, quoted: message });
  };

  const sendImageFromFile = async (file, caption = "") => {
    return await socket.sendMessage(remoteJid, {
      image: fs.readFileSync(file),
      caption: caption ? `${BOT_EMOJI} ${caption}` : "",
    }, { quoted: message });
  };

  const sendImageFromURL = async (url, caption = "") => {
    return await socket.sendMessage(remoteJid, {
      image: { url },
      caption: caption ? `${BOT_EMOJI} ${caption}` : "",
    }, { url, quoted: message });
  };

  const sendAudioFromURL = async (url) => {
    return await socket.sendMessage(remoteJid, {
      audio: { url },
      mimetype: "audio/mp4",
    }, { url, quoted: message });
  };

  const sendVideoFromURL = async (url) => {
    return await socket.sendMessage(remoteJid, {
      video: { url },
    }, { url, quoted: message });
  };

  const sendReplyOpenGroup = async (text) => {
    return await sendReply(`🔓 ${text}`);
  };

  const sendReplyCloseGroup = async (text) => {
    return await sendReply(`🔒 ${text}`);
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
    message,
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
    openGroup,
    closeGroup,
  };
};
