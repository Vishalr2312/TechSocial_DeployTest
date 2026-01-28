import Image from "next/image";
import avatar_2 from "/public/images/avatar-2.png";
import avatar_3 from "/public/images/avatar-3.png";
import avatar_4 from "/public/images/avatar-4.png";
import { useRouter } from "next/navigation";
import { setParentCommentCache } from "@/Utils/commentCache";
import { useAppSelector } from "@/Redux/hooks";

interface Ts_ParentCommentReactionProps {
  comment: CommentItem;
  commentId: number;
  postId: number;
  replyCount: number;
  onDelete: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onLikeToggle: (commentId: number) => void;
}

const Ts_ParentCommentReaction = ({
  comment,
  commentId,
  postId,
  replyCount,
  onDelete,
  onLikeToggle,
  onReport,
}: Ts_ParentCommentReactionProps) => {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.user.user);
  const isOwner = comment.user?.id === currentUser?.id;

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
      <div className="py-2 d-center flex-wrap gap-5 gap-md-0 justify-content-between">
        <div className="d-center flex-wrap">
          <button
            className="d-center gap-1 gap-sm-2 mdtxt chat-btn"
            // onClick={() => {
            //   setParentCommentCache(comment);
            //   router.push(`/post/${postId}/comment/${commentId}`);
            // }}
          >
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              comment{" "}
            </i>
          </button>
          {replyCount > 0 && (
            <span style={{ fontSize: "15px" }}>{replyCount}</span>
          )}
        </div>
        <div className="d-center flex-wrap">
          <button
            className="d-center gap-1 gap-sm-2 mdtxt chat-btn"
            onClick={() => onLikeToggle(commentId)}
          >
            <i
              className="material-symbols-outlined mat-icon"
              style={{
                fontSize: "20px",
                color: comment.isLike ? "#f05a28" : "inherit",
              }}
            >
              {" "}
              thumb_up{" "}
            </i>
          </button>
          {/* {total_like > 0 && (
            <span style={{ fontSize: "15px" }}>{total_like}</span>
          )} */}
        </div>
        {/* <div className="d-center flex-wrap">
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
        </div> */}
        {isOwner ? (
          <div className="d-center flex-wrap">
            <button
              className="d-center gap-1 gap-sm-2 mdtxt chat-btn"
              onClick={() => {
                if (confirm("Are you sure you want to delete this comment?")) {
                  onDelete(commentId);
                }
              }}
            >
              <i
                className="material-symbols-outlined mat-icon"
                style={{ fontSize: "20px" }}
              >
                {" "}
                delete{" "}
              </i>
            </button>
            {/* {total_view > 0 && (
            <span style={{ fontSize: "15px" }}>{total_view}</span>
          )} */}
          </div>
        ) : (
          <div className="d-center flex-wrap">
            <button
              className="d-center gap-1 gap-sm-2 mdtxt chat-btn"
              onClick={() => onReport(commentId)}
            >
              <i
                className="material-symbols-outlined mat-icon"
                style={{ fontSize: "20px" }}
              >
                {" "}
                report{" "}
              </i>
            </button>
            {/* {total_share > 0 && (
            <span style={{ fontSize: "15px" }}>{total_share}</span>
          )} */}
          </div>
        )}
      </div>
      {/* <div className="px-3 d-center flex-wrap gap-5 gap-md-0 justify-content-between">
        <button
          className="d-center justify-content-start mdtxt chat-btn"
          style={{ whiteSpace: "nowrap" }}
        >
          View {replyCount} Comments
        </button>
      </div> */}
    </>
  );
};

export default Ts_ParentCommentReaction;
