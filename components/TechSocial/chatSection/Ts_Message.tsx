import Image from "next/image";
import Link from "next/link";
import avatar_1 from "/public/images/avatar-1.png";
import avatar_2 from "/public/images/avatar-2.png";
import { useEffect, useRef, useState } from "react";
import axiosCall from "@/Utils/APIcall";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import {
  addOptimisticMessage,
  deleteMessageLocal,
  setReplyMessage,
  setRoomMessages,
  toggleStarMessage,
} from "@/Redux/Reducers/ChatSection/chatSlice";
import {
  ChatMessageItem,
  ChatMessageResponseData,
  ChatMessageUI,
} from "@/Type/ChatsSection/chatMessage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  decodeChatMessage,
  emitDeleteMessage,
  encryptAESCryptoJS,
  encryptChatMessage,
  getLastSeenText,
  getReplyPreviewText,
  parsePostMessage,
  parseRepliedMessage,
} from "@/Utils/chatMessageHelper";
import { getChatSocket } from "../socket/chatSocket";
import ContactAction from "@/components/ui/ContactAction";
import PostMessage from "./PostMessage";
import DarkLoader from "../Loader/DarkLoader";

export interface ChatMessageApiResponse {
  status: number;
  message: string;
  data: ChatMessageResponseData;
}

const Ts_Message = () => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const activeRoomId = useAppSelector((state) => state.chat.activeRoomId);
  const room = useAppSelector((state) =>
    state.chat.rooms.find((r) => r.id === activeRoomId),
  );
  const replyToMessage = useAppSelector((state) => state.chat.replyToMessage);

  const messages = useAppSelector((state) =>
    activeRoomId ? state.chat.messages[activeRoomId] : undefined,
  );

  const currentUserId = useAppSelector((state) => state.user.user?.id);

  const peerUser = room?.chatRoomUser?.find(
    (u) => u.user_id !== currentUserId,
  )?.user;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeRoomId) return;

    const cursor = room?.lastMessage?.id != null ? room.lastMessage.id + 1 : 1;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axiosCall<ChatMessageApiResponse>({
          ENDPOINT: `chats/chat-message?expand=chatMessageUser,user&room_id=${activeRoomId}&last_message_id=${cursor}`,
          METHOD: "GET",
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        const items = response.data.data.chatMessage.items;
        const decryptedItems: ChatMessageUI[] = items.map((msg) => ({
          ...msg,
          messageType: msg.type,
          decryptedMessage: decodeChatMessage(msg.message, msg.is_encrypted),
        }));

        dispatch(
          setRoomMessages({
            roomId: activeRoomId,
            messages: decryptedItems,
            cursor,
          }),
        );
      } catch (err: any) {
        console.error("Failed to fetch messages", err);
        toast.error(
          err?.response?.data?.message || "Failed to fetch chat rooms",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeRoomId, room?.lastMessage?.id, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.items?.length]);

  const handleDelete = (msg: ChatMessageUI, deleteScope: 1 | 2) => {
    if (!activeRoomId) return;

    // Optimistic UI
    dispatch(
      deleteMessageLocal({
        roomId: activeRoomId,
        messageId: msg.id,
        deleteScope,
      }),
    );

    // Emit socket
    emitDeleteMessage(msg, deleteScope);
  };

  const handleSend = () => {
    if (!text.trim() || !activeRoomId || !currentUserId) return;

    const localMessageId = uuidv4();
    const createdAt = Math.floor(Date.now() / 1000);
    const isReply = !!replyToMessage;
    const encrypted = encryptChatMessage(text, 1);

    const repliedOnMessage =
      replyToMessage != null
        ? encryptAESCryptoJS(
            JSON.stringify({
              id: replyToMessage.id,
              local_message_id: replyToMessage.local_message_id,
              message: replyToMessage.message, // 🔐 already encrypted
              is_encrypted: replyToMessage.is_encrypted,
              messageType: replyToMessage.messageType, // 👈 ORIGINAL TYPE (1,2,3…)
              created_by: replyToMessage.created_by,
              created_at: replyToMessage.created_at,
              chat_version: 1,
            }),
          )
        : null;

    const payload = {
      // userId: currentUserId, // 🔥 REQUIRED
      // localMessageId: localMessageId,
      // local_message_id: localMessageId,
      // room: activeRoomId,
      // created_by: currentUserId,
      // messageType: 1,
      // message: encrypted,
      // is_encrypted: 1,
      // chat_version: 1,
      // created_at: createdAt,
      userId: currentUserId,
      localMessageId: localMessageId, // ✅ camelCase only
      is_encrypted: 1,
      messageType: isReply ? 9 : 1,
      message: encrypted,
      replied_on_message: repliedOnMessage,
      chat_version: 1,
      room: activeRoomId,
      created_by: currentUserId,
      created_at: createdAt,
    };

    // 🔹 optimistic UI
    dispatch(
      addOptimisticMessage({
        roomId: activeRoomId,
        message: {
          ...payload,
          decryptedMessage: text,
          status: 0, // sending
        },
      }),
    );

    // getChatSocket()?.emit("sendMessage", payload);
    const socket = getChatSocket();

    if (!socket) {
      console.warn("⚠️ No socket instance");
      return;
    }

    if (!socket.connected) {
      console.warn("⚠️ Socket exists but not connected yet");
      return;
    }

    socket.emit("sendMessage", payload);
    dispatch(setReplyMessage(null));
    setText("");
  };

  if (!activeRoomId) {
    return (
      <div className="p-5 text-center">
        <h6 style={{ paddingTop: "30%" }}>Select a chat to start messaging</h6>
      </div>
    );
  }
  return (
    <div className="main">
      <div className="chat-head py-4 px-5 d-center justify-content-between">
        {loading && <DarkLoader />}
        <div className="d-flex gap-4 align-items-center">
          {/* <Image src={avatar_2} alt="image" /> */}
          <div className="profile-status">
            <h5 className="m-0">
              <Link href="/public-profile/post" className="m-0">
                {peerUser?.username}
              </Link>
            </h5>
            {/* <span className="mdtxt"> */}
            {peerUser?.is_show_online_chat_status === 1 && (
              <span
                className={`mdtxt ${
                  peerUser?.is_chat_user_online === 1
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {peerUser &&
                  getLastSeenText(
                    peerUser.chat_last_time_online,
                    peerUser.is_chat_user_online,
                  )}
              </span>
            )}
          </div>
        </div>
        {/* <div className="d-flex gap-3 align-items-center">
          <Link href="#">
            <i className="material-symbols-outlined mat-icon fw-600">call</i>
          </Link>
          <Link href="#">
            <i className="material-symbols-outlined mat-icon">videocam</i>
          </Link>
        </div> */}
      </div>
      <ul className="py-4 px-5 cus-scrollbar bottom-0 main-chat-box">
        {/* <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>Hello! Have you seen my backpack anywhere in office?</p>
            <span className="mdtxt">10:42</span>
          </div>
        </li>
        <li className="me">
          <div className="message">
            <p>No, There is no backpack in office.</p>
            <span className="mdtxt">10:43</span>
          </div>
          <div className="entete">
            <Image src={avatar_1} alt="image" />
          </div>
        </li>
        <li className="me">
          <div className="message">
            <p>Thank you for work, see you!</p>
            <span className="mdtxt">10:43</span>
          </div>
          <div className="entete">
            <Image src={avatar_1} alt="image" />
          </div>
        </li>
        <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </p>
            <span className="mdtxt">10:44</span>
          </div>
        </li>
        <li className="me">
          <div className="message">
            <p>Many desktop publishing packages and web page editors now</p>
            <span className="mdtxt">10:45</span>
          </div>
          <div className="entete">
            <Image src={avatar_1} alt="image" />
          </div>
        </li>
        <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>A page when looking at its layout.</p>
            <span className="mdtxt">10:46</span>
          </div>
        </li>
        <li className="me">
          <div className="message">
            <p>It was nice talking to you</p>
            <span className="mdtxt">10:47</span>
          </div>
          <div className="entete">
            <Image src={avatar_1} alt="image" />
          </div>
        </li>
        <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>What time is it?</p>
            <span className="mdtxt">10:48</span>
          </div>
        </li>
        <li className="me">
          <div className="message">
            <p>It is 11 o&#39;clock</p>
            <span className="mdtxt">11:00</span>
          </div>
          <div className="entete">
            <Image src={avatar_1} alt="image" />
          </div>
        </li>
        <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>I am late</p>
            <span className="mdtxt">11:42</span>
          </div>
        </li>
        <li className="me">
          <div className="message">
            <p>I have to go now</p>
            <span className="mdtxt">11:45</span>
          </div>
          <div className="entete">
            <Image src={avatar_1} alt="image" />
          </div>
        </li>
        <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>Are you okay?</p>
            <span className="mdtxt">10:48</span>
          </div>
        </li>
        <li className="you">
          <div className="entete">
            <Image src={avatar_2} alt="image" />
          </div>
          <div className="message">
            <p>Can I help you?</p>
            <span className="mdtxt">10:49</span>
          </div>
        </li> */}
        {messages?.items?.map((msg) => {
          const isMe = msg.created_by === currentUserId;
          const isReply = typeof msg.replied_on_message === "string";
          const repliedMessage = parseRepliedMessage(
            msg.replied_on_message ?? undefined,
          );
          const isMyMessage = msg.created_by === currentUserId;

          const isPostMessage = msg.messageType === 11;
          const postData =
            isPostMessage && msg.decryptedMessage?.startsWith("{")
              ? parsePostMessage(msg.decryptedMessage)
              : null;
          console.log("POST DATA:", postData);
          // console.log("RAW decryptedMessage:", msg.decryptedMessage);

          const deleteActions = isMyMessage
            ? [
                {
                  label: "Delete for me",
                  icon: "delete",
                  onClick: () => handleDelete(msg, 1),
                },
                {
                  label: "Delete for everyone",
                  icon: "delete_forever",
                  onClick: () => handleDelete(msg, 2),
                },
              ]
            : [
                {
                  label: "Delete for me",
                  icon: "delete",
                  onClick: () => handleDelete(msg, 1),
                },
              ];

          return (
            <li
              key={msg.id ?? msg.local_message_id}
              className={isMe ? "me" : "you"}
            >
              {!isMe && (
                <div className="entete">
                  {/* <Image src={avatar_2} alt="image" /> */}
                </div>
              )}

              {/* <div className="message">
                <p>{msg.decryptedMessage}</p>
                <span className="mdtxt">
                  {new Date(msg.created_at * 1000).toLocaleTimeString()}
                </span>
              </div> */}
              <div className="message-wrapper position-relative">
                {repliedMessage && (
                  <div
                    className={`reply-container mb-2 ${
                      isMe ? "reply-me" : "reply-you"
                    }`}
                  >
                    <p>{getReplyPreviewText(repliedMessage)}</p>
                  </div>
                )}

                <div className="message">
                  {/* <p>{msg.decryptedMessage}</p> */}
                  {isPostMessage ? (
                    <PostMessage post={postData} />
                  ) : (
                    <p>{msg.decryptedMessage}</p>
                  )}
                  <div className="message-meta">
                    <p className="message-time">
                      {new Date(msg.created_at * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {msg.isStarred && (
                      <i className="material-symbols-outlined starred-icon">
                        star
                      </i>
                    )}

                    {isMe && (
                      <i className="material-symbols-outlined sent-icon">
                        check_circle
                      </i>
                    )}
                  </div>
                </div>

                {/* Hover actions */}
                <div className={`message-actions ${isMe ? "me" : "you"}`}>
                  <ContactAction
                    actionList={[
                      {
                        label: "Copy",
                        icon: "content_copy",
                        onClick: () =>
                          navigator.clipboard.writeText(msg.decryptedMessage),
                      },
                      {
                        label: "Reply",
                        icon: "reply",
                        onClick: () => {
                          // console.log("Reply", msg);
                          dispatch(setReplyMessage(msg));
                        },
                      },
                      {
                        label: msg.isStarred ? "Unstar" : "Star",
                        icon: "star",
                        onClick: () => {
                          // console.log("Star", msg.id);
                          dispatch(
                            toggleStarMessage({
                              roomId: activeRoomId!,
                              messageId: msg.id ?? msg.local_message_id!,
                            }),
                          );
                        },
                      },
                      ...deleteActions,
                    ]}
                  />
                </div>
              </div>

              {isMe && (
                <div className="entete">
                  {/* <Image src={avatar_1} alt="image" /> */}
                </div>
              )}
            </li>
          );
        })}
        <div ref={bottomRef} />
      </ul>
      <div className="m-4 text-end chat-footer">
        {replyToMessage && (
          <div className="reply-preview">
            <div className="reply-preview-header d-flex justify-content-between">
              {/* <span className="replying-to">
                      Replying to{" "}
                      {replyToMessage.created_by === currentUserId
                        ? "You"
                        : peerUser?.username}
                    </span> */}
              <div className="reply-preview-body">
                <p>{replyToMessage.decryptedMessage}</p>
              </div>

              <button
                type="button"
                onClick={() => dispatch(setReplyMessage(null))}
                className="reply-cancel"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <form action="#" className="py-2 pt-1 px-5">
          <div className="d-flex align-items-sm-center align-items-end flex-column flex-sm-row mt-2 gap-3">
            <div className="form-content p-0 d-flex gap-2 align-items-center w-100">
              {/* <div className="file-input d-flex gap-1 gap-md-2">
                <div className="file-upload">
                  <label className="file">
                    <input type="file" />
                    <span className="file-custom border-0 d-grid text-center">
                      <span className="material-symbols-outlined rotateInDownLeft mat-icon fs-xxl">
                        attachment
                      </span>
                    </span>
                  </label>
                </div>
                <div className="file-upload">
                  <label className="file">
                    <input type="file" />
                    <span className="file-custom border-0 d-grid text-center">
                      <span className="material-symbols-outlined mat-icon fs-xxl">
                        perm_media
                      </span>
                    </span>
                  </label>
                </div>
                <div className="file-upload">
                  <label className="file">
                    <input type="file" />
                    <span className="file-custom border-0 d-grid text-center">
                      <span className="material-symbols-outlined mat-icon fs-xxl">
                        gif_box
                      </span>
                    </span>
                  </label>
                </div>
              </div> */}
              <input
                className="py-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message here.."
              />
            </div>
            <div className="btn-area">
              <button
                className="cmn-btn px-2 px-sm-5 px-lg-6"
                type="button"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ts_Message;
