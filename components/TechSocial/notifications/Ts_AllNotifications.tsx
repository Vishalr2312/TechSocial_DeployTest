"use client";

import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { useEffect } from "react";
import { markAllNotificationsSeen } from "@/Redux/Reducers/Notification/NotificationSlice";
import { setLastSeenNotificationCount } from "@/Utils/notificationHelper";
import Image from "next/image";
import Link from "next/link";
import avatar_3 from "/public/images/avatar-3.png";
import avatar_4 from "/public/images/avatar-4.png";
import avatar_5 from "/public/images/avatar-5.png";
import avatar_6 from "/public/images/avatar-6.png";
import avatar_7 from "/public/images/avatar-7.png";

const Ts_AllNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.items);
  const total = notifications.length;
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

  useEffect(() => {
    dispatch(markAllNotificationsSeen());
    setLastSeenNotificationCount(total);
  }, [dispatch, total]);
  return (
    <main className="main-content">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="head-area pb-6">
              <h5>Notifications</h5>
            </div>
            <div className="d-grid gap-5">
              {notifications.length === 0 && <p>No notifications</p>}
              <div className="single-box">
                {notifications.map((n) => {
                  const user = n.createdByUser;
                  const name = user?.username || "User";
                  const firstLetter = name.charAt(0).toUpperCase();

                  return (
                    <div
                      key={n.id}
                      className="notification-single d-center p-4 justify-content-between"
                    >
                      {/* LEFT SIDE */}
                      <div className="d-flex top-review-wrapper gap-3 align-items-center">
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 12,
                            overflow: "hidden",
                            border: "1px solid #f05a28",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: user?.picture
                            //   ? "transparent"
                            //   : "#f05a28",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        >
                          {user?.picture ? (
                            <Image
                              src={user.picture}
                              alt={name}
                              width={50}
                              height={50}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span>{firstLetter}</span>
                          )}
                        </div>

                        <div className="d-flex">
                          <h6 className="m-0">
                            {/* <Link href={`/profile/${user?.id}`}>{name}</Link>{" "} */}
                            {/* <span>{n.title}</span> */}
                            {n.type === 2 ? (
                              <span>{n.title}</span>
                            ) : (
                              <span>{n.message}</span>
                            )}
                          </h6>
                        </div>
                      </div>

                      <div className="btn-area d-flex gap-3">
                        {/* <button className="cmn-btn py-1">Accept</button>
                        <button className="cmn-btn alt py-1">Delete</button> */}
                        <span className="mdtxt">
                          {formatTime(n.created_at)}
                        </span>
                      </div>

                      {/* <div className="d-flex gap-2">
                        {n.type === "follow_request" && (
                          <>
                            <button className="cmn-btn py-1">Accept</button>
                            <button
                              className="cmn-btn alt py-1"
                              onClick={() => dispatch(removeNotification(n.id))}
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {n.type !== "follow_request" && (
                          <button
                            className="cmn-btn alt p-2"
                            onClick={() => dispatch(removeNotification(n.id))}
                          >
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        )}
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Ts_AllNotifications;
