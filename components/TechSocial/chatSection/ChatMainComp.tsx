"use client";

import { useEffect, useState } from "react";
import Ts_ChatOption from "./Ts_ChatOption";
import Ts_Message from "./Ts_Message";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { ChatRoomsData } from "@/Type/ChatsSection/chatRoom";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import {
  deleteMessageLocal,
  receiveSocketMessage,
  setChatLoading,
  setChatRooms,
  updateLastMessage,
  updateMessageStatus,
} from "@/Redux/Reducers/ChatSection/chatSlice";
import { getChatSocket } from "../socket/chatSocket";
import { decodeChatMessage } from "@/Utils/chatMessageHelper";

interface ChatRoomsApiResponse {
  status: number;
  message: string;
  data: ChatRoomsData;
}

const ChatMainComp = () => {
  const dispatch = useAppDispatch();
  // const token = useAppSelector((s) => s.user.token);
  const activeRoomId = useAppSelector((state) => state.chat.activeRoomId);
  const rooms = useAppSelector((state) => state.chat.rooms);
  // const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setChatLoading(true));

        const response = await axiosCall<ChatRoomsApiResponse>({
          ENDPOINT:
            "chats/room?expand=createdByUser,chatRoomUser,chatRoomUser.user,lastMessage,chatRoomUser.user.userLiveDetail",
          METHOD: "GET",
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        dispatch(setChatRooms(response.data.data.room));
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch chat rooms",
        );
      } finally {
        dispatch(setChatLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  // useEffect(() => {
  //   connectChatSocket(() => {
  //     setSocketReady(true);
  //   });

  //   return () => {
  //     disconnectChatSocket();
  //   };
  // }, []);
  // console.log("🔌 socketReady =", socketReady);

  useEffect(() => {
    const socket = getChatSocket();
    if (!socket?.connected || !socket || !activeRoomId) return;

    // console.log("📥 Joining room:", activeRoomId);
    socket.emit("joinRoom", { room: activeRoomId });

    return () => {
      // console.log("📤 Leaving room:", activeRoomId);
      socket.emit("leaveRoom", { room: activeRoomId });
    };
  }, [activeRoomId]);

  useEffect(() => {
    const socket = getChatSocket();
    if (!socket || !socket.connected || rooms.length === 0) return;

    if (!socket) return;

    rooms.forEach((room) => {
      // console.log("📥 Auto-joining room:", room.id);
      socket.emit("joinRoom", { room: room.id });
    });
  }, [rooms]);

  useEffect(() => {
    const socket = getChatSocket();
    if (!socket) return;

    const onMessage = (response: any) => {
      const decrypted = decodeChatMessage(
        response.message,
        response.is_encrypted,
      );

      dispatch(
        receiveSocketMessage({
          ...response,
          decryptedMessage: decrypted,
          status: 1,
        }),
      );

      dispatch(
        updateLastMessage({
          roomId: response.room_id,
          message: response,
        }),
      );
    };

    socket.on("sendMessage", onMessage);
    socket.on("updateMessageStatus", (payload) =>
      dispatch(updateMessageStatus(payload)),
    );
    socket.on("deleteMessage", (payload) => {
      const messageId =
        payload.id ?? payload.message_id ?? payload.local_message_id;

      if (!messageId) {
        console.warn("⚠️ deleteMessage without messageId", payload);
        return;
      }
      dispatch(
        deleteMessageLocal({
          roomId: payload.room,
          messageId,
          deleteScope: payload.deleteScope,
        }),
      );
    });

    return () => {
      socket.off("sendMessage", onMessage);
      socket.off("updateMessageStatus");
      socket.off("deleteMessage");
    };
  }, [dispatch]);

  return (
    <main className="main-content">
      <div className="container">
        <div className="row">
          <div className="col-xxl-3 col-xl-4 col-lg-4 pe-0">
            {/* Chat Option */}
            <Ts_ChatOption />
          </div>
          <div className="col-xxl-9 col-xl-8 col-lg-8 ps-4 ps-lg-0 d-flex flex-column gap-7">
            <div className="chat-area">
              {/* Message */}
              <Ts_Message />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatMainComp;
