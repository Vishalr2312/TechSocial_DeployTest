import CryptoJS from "crypto-js";
import { ChatRoom } from "@/Type/ChatsSection/chatRoom";
import {
  ChatMessageReplyModel,
  ChatMessageUI,
} from "@/Type/ChatsSection/chatMessage";
import { getChatSocket } from "@/components/TechSocial/socket/chatSocket";

export const mapRoomToSingleChat = (room: ChatRoom, currentUserId: number) => {
  const peer = room.chatRoomUser.find((u) => u.user_id !== currentUserId)?.user;

  return {
    roomId: room.id,
    userName: peer?.username || "Unknown",
    userAvatar: peer?.picture || null,
    lastMessage: room.lastMessage?.message || "",
    unreadCount: 0, // will come later
  };
};

const CHAT_SECRET_KEY = "bbC2H19lkVbQDfakxcrtNMQdd0FloLyw";

export function decryptAESCryptoJS(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, CHAT_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (e) {
    console.error("Decrypt failed", e);
    return encryptedText;
  }
}

export function decodeChatMessage(
  encryptedMessage: string,
  isEncrypted: number,
): string {
  if (!encryptedMessage) return "";
  if (isEncrypted !== 1) return encryptedMessage;

  // First layer
  const decrypted = decryptAESCryptoJS(encryptedMessage);
  if (!decrypted) return "🔒 Encrypted message";

  // Try JSON
  try {
    const parsed = JSON.parse(decrypted);

    // Text message
    if (parsed?.messageType === 1 && parsed?.text) {
      return decryptAESCryptoJS(parsed.text) || "🔒 Encrypted message";
    }

    return "📎 Unsupported message";
  } catch {
    // Fallback (plain AES text)
    return decrypted;
  }
}

export function encryptAESCryptoJS(plainText: string): string {
  try {
    return CryptoJS.AES.encrypt(plainText, CHAT_SECRET_KEY).toString();
  } catch (e) {
    console.error("Encrypt failed", e);
    return "";
  }
}

export function encryptChatMessage(
  plainText: string,
  messageType = 1, // 1 = text (same as Android)
): string {
  if (!plainText) return "";

  // 1️⃣ Encrypt actual text
  const encryptedText = encryptAESCryptoJS(plainText);

  // 2️⃣ Wrap payload (Android-compatible)
  const payload = {
    messageType,
    text: encryptedText,
  };

  // 3️⃣ Encrypt full JSON payload
  return encryptAESCryptoJS(JSON.stringify(payload));
}

export function getLastMessagePreview(lastMessage: any): string {
  if (!lastMessage) return "";

  // Not encrypted → return directly
  if (lastMessage.is_encrypted !== 1) {
    return lastMessage.message;
  }

  // 1️⃣ Decrypt outer layer
  const decryptedPayload = decryptAESCryptoJS(lastMessage.message);
  if (!decryptedPayload) return "🔒 Encrypted message";

  // 2️⃣ Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(decryptedPayload);
  } catch {
    return "🔒 Encrypted message";
  }

  // 3️⃣ Decrypt text content
  if (parsed?.text) {
    const finalText = decryptAESCryptoJS(parsed.text);
    return finalText || "🔒 Encrypted message";
  }

  return "";
}

export const getLastSeenText = (lastSeen: number, isOnline: number) => {
  if (isOnline === 1) return "online";

  if (!lastSeen) return "offline";

  const now = Date.now();
  const lastSeenMs = lastSeen * 1000;
  const diffMs = now - lastSeenMs;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "last seen just now";
  if (diffMin < 60) return `last seen ${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `last seen ${diffHr} hr ago`;

  return `last seen ${new Date(lastSeenMs).toLocaleDateString()} ${new Date(
    lastSeenMs,
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

export function parseRepliedMessage(
  encrypted?: string,
): ChatMessageReplyModel | null {
  if (!encrypted) return null;

  try {
    // 🔥 direct AES decrypt, NOT decodeChatMessage
    const decrypted = decryptAESCryptoJS(encrypted);
    if (!decrypted) return null;

    const parsed = JSON.parse(decrypted);

    // must look like a ChatMessage
    if (!parsed.messageType || !parsed.message) return null;

    return parsed as ChatMessageReplyModel;
  } catch (e) {
    console.error("Failed to parse replied message", e);
    return null;
  }
}

export function getReplyPreviewText(reply: ChatMessageReplyModel) {
  switch (reply.messageType) {
    case 1:
      return decodeChatMessage(reply.message, reply.is_encrypted);
    case 2:
      return "📷 Photo";
    case 3:
      return "🎥 Video";
    case 4:
      return "🎵 Audio";
    case 9:
      return decodeChatMessage(reply.message, reply.is_encrypted);
    case 16:
      return "📎 File";
    default:
      return "📎 Unsupported message";
  }
}

export const emitDeleteMessage = (msg: ChatMessageUI, deleteScope: 1 | 2) => {
  const socket = getChatSocket();
  if (!socket || !socket.connected) return;

  socket.emit("deleteMessage", {
    id: msg.id,
    room: msg.room_id,
    deleteScope,
  });
};

export const findRoomWithUser = (rooms: any[], userId: number) => {
  return rooms.find((room) =>
    room.chatRoomUser.some((u: any) => u.user_id === userId),
  );
};
