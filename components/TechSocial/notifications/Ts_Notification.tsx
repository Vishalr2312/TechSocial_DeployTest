"use client";

import Image from "next/image";
import Link from "next/link";
import avatar_1 from "/public/images/avatar-1.png";
import avatar_2 from "/public/images/avatar-2.png";
import avatar_3 from "/public/images/avatar-3.png";
import avatar_4 from "/public/images/avatar-4.png";
import emoji_love from "/public/images/icon/emoji-love.png";
import speech_bubble from "/public/images/icon/speech-bubble.png";
import { useAppSelector } from "@/Redux/hooks";

const Ts_Notification = ({
  activeHandler,
}: {
  activeHandler: (a: string) => void;
}) => {
  const notifications = useAppSelector((state) => state.notification.items);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const latestNotifications = notifications.slice(0, 5);
  function formatTime(timestamp: number) {
    const diff = Date.now() - timestamp * 1000;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  return (
    <>
      <div className="notification-btn cmn-head position-relative">
        <div
          className="icon-area d-center position-relative"
          onClick={() => activeHandler("notification")}
        >
          <i className="material-symbols-outlined mat-icon">notifications</i>
          {unreadCount > 0 && (
            <span className="abs-area position-absolute d-center mdtxt">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      <div className="main-area p-5 notification-content">
        <h5 className="mb-4">Notifications</h5>
        {latestNotifications.length === 0 && <p>No notifications</p>}
        {latestNotifications.map((n) => {
          const user = n.createdByUser;
          const name = user?.username || "User";
          const firstLetter = name?.charAt(0).toUpperCase() || "?";

          return (
            <div key={n.id} className="single-box p-0 mb-7">
              <Link
                href={`/profile/notification`}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="left-item d-inline-flex gap-3">
                  <div className="avatar d-flex align-items-center">
                    <div
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "15px",
                        overflow: "hidden",
                        border: "1px solid #f05a28",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // backgroundColor: userAvt ? "transparent" : "#f05a28",
                        color: "#fff",
                        // fontSize: 20,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {user?.picture ? (
                        <Image
                          //   className="avatar-img"
                          src={user.picture}
                          alt={name}
                          width={45}
                          height={45}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#fff" }}>{firstLetter}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-area">
                    {/* <h6 className="m-0 mb-1">{user?.username || "User"}</h6> */}
                    <p className="m-0 mb-1">{n.title}</p>
                    <p className="mdtxt">{n.message}</p>
                  </div>
                </div>

                <div className="time-remaining">
                  <p className="mdtxt">{formatTime(n.created_at)}</p>
                </div>
              </Link>
            </div>
          );
        })}
        <div className="btn-area">
          <Link href="/profile/notification">See all notifications</Link>
        </div>
      </div>
    </>
  );
};

export default Ts_Notification;
