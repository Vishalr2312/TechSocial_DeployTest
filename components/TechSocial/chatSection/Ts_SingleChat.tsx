import Image, { StaticImageData } from "next/image";

interface Ts_SingleChatProps {
  roomId: number;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  unreadCount: number;
  isActive: boolean;
  onClick: () => void;
}

const Ts_SingleChat = ({
  roomId,
  userName,
  userAvatar,
  lastMessage,
  unreadCount,
  isActive,
  onClick,
}: Ts_SingleChatProps) => {
  //   const { clss, id, last_message, number_of_message, user_avt, user_name } =
  //     data;

  const firstLetter = userName?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`text-start d-flex justify-content-between chat-single p-4 mb-2 ${
        // roomId === 1 ? "active" : ""
        isActive ? "active" : ""
      }`}
      onClick={onClick}
    >
      <div className="d-flex gap-2 align-items-center">
        {/* <div className="avatar"> */}
        <div>
          {/* <Image
            className="avatar-img max-un"
            src={userAvatar ?? "/images/default-avatar.png"}
            width={48}
            height={48}
            alt="avatar"
          /> */}
          <div
            style={{
              width: 50,
              height: 50,
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
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={`avatar`}
                width={50}
                height={50}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            ) : (
              <span>{firstLetter}</span>
            )}
          </div>
        </div>
        <div className="text-area">
          <div className="title-area position-relative d-inline-flex align-items-center">
            <h6 className="m-0 d-inline-flex">{userName}</h6>
            {/* {unreadCount && (
              <span className="abs-area position-absolute d-center mdtxt">
                {unreadCount}
              </span>
            )} */}
          </div>
          {/* <p className={`mdtxt ${clss}`}>{last_message}</p> */}
          <p className={`mdtxt`}>{lastMessage}</p>
        </div>
      </div>
      <div className="btn-group cus-dropdown dropend">
        <button
          type="button"
          className="dropdown-btn"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="material-symbols-outlined fs-xxl m-0">more_horiz</i>
        </button>
        <ul className="dropdown-menu p-4 pt-2">
          <li>
            <button className="droplist d-flex align-items-center gap-2">
              <i className="material-symbols-outlined mat-icon">
                person_remove
              </i>
              <span>Unfollow</span>
            </button>
          </li>
          <li>
            <button className="droplist d-flex align-items-center gap-2">
              <i className="material-symbols-outlined mat-icon">hide_source</i>
              <span>Hide Contact</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Ts_SingleChat;
