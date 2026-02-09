import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatRoom } from "@/Type/ChatsSection/chatRoom";
import { ChatMessageUI } from "@/Type/ChatsSection/chatMessage";
// import { ChatMessageItem } from "@/Type/ChatsSection/chatMessage";

type ChatActionMode = "none" | "reply";

interface ChatState {
  rooms: ChatRoom[];
  activeRoomId: number | null;
  loading: boolean;
  messages: Record<
    number,
    {
      items: ChatMessageUI[];
      cursor: number;
      hasMore: boolean;
    }
  >;
  actionMode: ChatActionMode;
  replyToMessage: ChatMessageUI | null;
}

const initialState: ChatState = {
  rooms: [],
  activeRoomId: null,
  loading: false,
  messages: {},
  actionMode: "none",
  replyToMessage: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatRooms(state, action: PayloadAction<ChatRoom[]>) {
      state.rooms = action.payload;
    },

    setActiveRoom(state, action: PayloadAction<number>) {
      state.activeRoomId = action.payload;
    },

    updateLastMessage(
      state,
      action: PayloadAction<{ roomId: number; message: any }>,
    ) {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.lastMessage = action.payload.message;
      }
    },

    setChatLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setRoomMessages(
      state,
      action: PayloadAction<{
        roomId: number;
        messages: ChatMessageUI[];
        cursor: number;
      }>,
    ) {
      const sorted = [...action.payload.messages].sort((a, b) => a.id - b.id);

      state.messages[action.payload.roomId] = {
        items: sorted,
        cursor: action.payload.cursor,
        hasMore: sorted.length > 0,
      };
    },

    addOptimisticMessage: (state, action) => {
      const { roomId, message } = action.payload;

      if (!state.messages[roomId]) {
        state.messages[roomId] = {
          items: [],
          cursor: 0,
          hasMore: true,
        };
      }

      state.messages[roomId].items.push(message);
    },

    receiveSocketMessage: (state, action) => {
      const msg = action.payload;
      // const roomId = msg.room_id;
      const roomId = msg.room ?? msg.room_id;

      if (!state.messages[roomId]) {
        state.messages[roomId] = {
          items: [],
          cursor: 0,
          hasMore: true,
        };
      }

      const existing = state.messages[roomId].items.find(
        (m) => m.local_message_id === msg.local_message_id,
      );

      if (existing) {
        existing.id = msg.id;
        existing.status = 1; // delivered
      } else {
        state.messages[roomId].items.push(msg);
      }
    },

    updateMessageStatus: (state, action) => {
      const { roomId, localMessageId, status } = action.payload;

      const msg = state.messages[roomId]?.items.find(
        (m) => m.local_message_id === localMessageId,
      );

      if (msg) msg.status = status;
    },

    setReplyMessage(state, action: PayloadAction<ChatMessageUI | null>) {
      if (action.payload === null) {
        state.actionMode = "none";
        state.replyToMessage = null;
      } else {
        state.actionMode = "reply";
        state.replyToMessage = action.payload;
      }
    },

    deleteMessageLocal: (
      state,
      action: PayloadAction<{
        roomId: number;
        messageId: string | number;
        deleteScope: 1 | 2;
      }>,
    ) => {
      const { roomId, messageId } = action.payload;

      const roomMessages = state.messages[roomId];
      if (!roomMessages) return;

      roomMessages.items = roomMessages.items.filter(
        (m) => m.id !== messageId && m.local_message_id !== messageId,
      );
    },

    toggleStarMessage: (
      state,
      action: PayloadAction<{
        roomId: number;
        messageId: number | string;
      }>,
    ) => {
      const { roomId, messageId } = action.payload;
      const room = state.messages[roomId];
      if (!room) return;

      const msg = room.items.find(
        (m) => m.id === messageId || m.local_message_id === messageId,
      );

      if (msg) {
        msg.isStarred = !msg.isStarred;
      }
    },
  },
});

export const {
  setChatRooms,
  setActiveRoom,
  updateLastMessage,
  setChatLoading,
  setRoomMessages,
  addOptimisticMessage,
  receiveSocketMessage,
  updateMessageStatus,
  setReplyMessage,
  deleteMessageLocal,
  toggleStarMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
