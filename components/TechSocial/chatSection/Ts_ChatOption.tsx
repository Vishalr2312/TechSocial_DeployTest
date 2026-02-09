"use client";

import messageData from "@/data/messageData";
import Image from "next/image";
import { useState } from "react";
import avatar_1 from "/public/images/avatar-1.png";
// import ContactAction from "@/components/ui/ContactAction";
import Ts_SingleChat from "./Ts_SingleChat";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setActiveRoom } from "@/Redux/Reducers/ChatSection/chatSlice";
import { getLastMessagePreview, mapRoomToSingleChat } from "@/Utils/chatMessageHelper";

const Ts_ChatOption = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.chat.rooms);
  const activeRoomId = useAppSelector((state) => state.chat.activeRoomId);
  const currentUserId = useAppSelector((state) => state.user.user?.id);
  const [active, setActive] = useState<boolean>(false);

  if (!currentUserId) {
    return null; // or loader
  }

  return (
    <>
      <div className="d-block d-lg-none">
        <button
          className="button profile-active mb-4 mb-lg-0 d-flex align-items-center gap-2"
          onClick={() => setActive(!active)}
        >
          <i className="material-symbols-outlined mat-icon"> tune </i>
          <span>Chat List</span>
        </button>
      </div>
      <div className={`profile-sidebar ${active && "active"}`}>
        <div className="d-block d-lg-none position-absolute end-0 top-0">
          <button
            className="button profile-close m-1"
            onClick={() => setActive(false)}
          >
            <i className="material-symbols-outlined mat-icon fs-xl">close</i>
          </button>
        </div>
        <div className="chat-area">
          <aside>
            <div className="chat-top p-5">
              <div className="profile-area d-center justify-content-between">
                <div className="avatar-item d-flex mb-4 gap-3 align-items-center">
                  {/* <div className="avatar-item">
                    <Image
                      className="avatar-img max-un"
                      src={avatar_1}
                      alt="avatar"
                    />
                  </div> */}
                  <div className="info-area">
                    <h6 className="m-0">Chat</h6>
                  </div>
                </div>
                {/* Contact Action */}
                {/* <ContactAction
                  actionList={[
                    ["Unfollow", "person_remove"],
                    ["Hide Contact", "hide_source"],
                  ]}
                /> */}
              </div>
              <form
                action="#"
                className="input-area py-2 d-flex align-items-center"
              >
                <i className="material-symbols-outlined mat-icon">search</i>
                <input type="text" placeholder="Search" />
              </form>
            </div>
            <div className="header-menu cus-scrollbar">
              <div className="single-item messages-area pb-5">
                {/* Single Chat */}
                {/* {messageData.map((data) => (
                  <Ts_SingleChat key={data.id} data={data} />
                ))} */}
                {rooms.map((room) => {
                  const chat = mapRoomToSingleChat(room, currentUserId);
                  const lastMessageText = room.lastMessage
                    ? getLastMessagePreview(room.lastMessage)
                    : "";
                  return (
                    <Ts_SingleChat
                      key={room.id}
                      {...chat}
                      lastMessage={lastMessageText}
                      isActive={room.id === activeRoomId}
                      onClick={() => dispatch(setActiveRoom(room.id))}
                    />
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Ts_ChatOption;
