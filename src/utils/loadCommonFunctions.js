const { BOT_EMOJI } = require("../config");
const { extractDataFromMessage, baileysIs, download } = require(".");
const { waitMessage } = require("./messages");
const fs = require("fs");
const path = require("path");

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

 // Nueva función para fijar un mensaje
  const pinMessage = async (messageKey) => {
    try {
      await socket.sendMessage(remoteJid, {
        pin: true,
        key: messageKey,
      });
      await sendSuccessReply("Mensaje fijado exitosamente.");
    } catch (error) {
      await sendErrorReply("No se pudo fijar el mensaje.");
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

  // Función para obtener la foto de perfil
  const getProfilePicture = async (jid) => {
    try {
      const profile = await socket.profilePictureUrl(jid, "image");
      return profile || path.resolve(__dirname, "assets", "images", "default-user.png");
    } catch (error) {
      return path.resolve(__dirname, "assets", "images", "default-user.png");
    }
  };

  // Nueva función para eliminar los mensajes de un usuario muteado
  const deleteMessagesFromUser = async (userJid) => {
    try {
      const messages = await socket.loadMessages(remoteJid); // Cargar mensajes recientes del grupo
      messages.forEach((msg) => {
        if (msg.key.fromMe === false && msg.key.participant === userJid) {
          socket.deleteMessage(remoteJid, msg.key); // Eliminar mensaje del usuario muteado
        }
      });
    } catch (error) {
      console.error("Error al eliminar mensajes:", error);
    }
  };

  // Nueva función para mutear al usuario y eliminar sus mensajes
  const muteMember = async (userJid, muteTime) => {
    try {
      // Mute the member
      await socket.groupParticipantsUpdate(remoteJid, [userJid], 'mute');
      
      // Eliminar los mensajes del usuario muteado
      await deleteMessagesFromUser(userJid);

      // Desmutear al usuario después del tiempo especificado
      setTimeout(async () => {
        await socket.groupParticipantsUpdate(remoteJid, [userJid], 'unmute');
      }, muteTime);
    } catch (error) {
      await sendErrorReply("Hubo un error al mutear al usuario.");
      console.error("Error al mutear al miembro:", error);
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
    pinMessage, // ATENCIÓN
    sendWarningReact,
    sendWarningReply,
    closeGroupCommand, // Nueva función para cerrar grupos
    openGroupCommand,  // Nueva función para abrir grupos
    getProfilePicture, // Exportando la función getProfilePicture
    muteMember, // Nueva función para mutear a los miembros y borrar sus mensajes
  };
};