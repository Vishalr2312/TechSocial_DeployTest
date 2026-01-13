import Image from "next/image";
import avatar_2 from "/public/images/avatar-2.png";
import avatar_3 from "/public/images/avatar-3.png";
import avatar_4 from "/public/images/avatar-4.png";

interface Ts_PostReactionProps {
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
}

const Ts_PostReaction = ({ post }: { post: Ts_PostReactionProps }) => {
  const {
    total_view,
    total_like,
    total_comment,
    total_share,
    ai_search_views,
  } = post;
  return (
    <>
      {/* <div
        className={`total-react-share ${reaction} pb-4 d-center gap-2 flex-wrap justify-content-between`}
      >
        <div className="friends-list d-flex gap-3 align-items-center text-center">
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Image src={avatar_2} alt="image" />
            </li>
            <li>
              <Image src={avatar_3} alt="image" />
            </li>
            <li>
              <Image src={avatar_4} alt="image" />
            </li>
            <li>
              <span className="mdtxt d-center">8+</span>
            </li>
          </ul>
        </div>
        <div className="react-list d-flex flex-wrap gap-6 align-items-center text-center">
          <button className="mdtxt">4 Comments</button>
          <button className="mdtxt">1 Shares</button>
        </div>
      </div> */}
      <div className="py-5 px-3 d-center flex-wrap gap-5 gap-md-0 justify-content-between">
        <div className="d-center flex-wrap">
          <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              thumb_up{" "}
            </i>
          </button>
          {total_like > 0 && (
            <span style={{ fontSize: "15px" }}>{total_like}</span>
          )}
        </div>
        <div className="d-center flex-wrap">
          <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              comment{" "}
            </i>
          </button>
          {total_comment > 0 && (
            <span style={{ fontSize: "15px" }}>{total_comment}</span>
          )}
        </div>
        <div className="d-center flex-wrap">
          <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
              }}
              onClick={() => (window.location.href = "/explore-ai")}
            >
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="ai-icon"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                />
                <line
                  x1="68"
                  y1="68"
                  x2="85"
                  y2="85"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text
                  x="50"
                  y="53"
                  fontFamily="Arial, sans-serif"
                  fontSize="24"
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  AI
                </text>
              </svg>
            </div>
          </button>
          {ai_search_views > 0 && (
            <span style={{ fontSize: "15px" }}>{ai_search_views}</span>
          )}
        </div>
        <div className="d-center flex-wrap">
          <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              upload{" "}
            </i>
          </button>
          {total_share > 0 && (
            <span style={{ fontSize: "15px" }}>{total_share}</span>
          )}
        </div>
        <div className="d-center flex-wrap">
          <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              visibility{" "}
            </i>
          </button>
          {total_view > 0 && (
            <span style={{ fontSize: "15px" }}>{total_view}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Ts_PostReaction;
