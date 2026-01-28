import Image from "next/image";
import Ts_ChildCommentReaction from "./Ts_ChildCommentReaction";

interface Props {
  comment: CommentItem;
  postId: number;
  onDelete: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onLikeToggle: (commentId: number) => void;
}

const Ts_CommentReplies = ({
  comment,
  postId,
  onDelete,
  onReport,
  onLikeToggle,
}: Props) => {
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    // <div className="d-flex gap-3">
    //   <div
    //     style={{
    //       width: 40,
    //       height: 40,
    //       borderRadius: "50%",
    //       overflow: "hidden",
    //     }}
    //   >
    //     <Image
    //       src={comment.user?.picture || "/images/default-avatar.png"}
    //       alt="avatar"
    //       width={40}
    //       height={40}
    //       style={{ objectFit: "cover" }}
    //     />
    //   </div>

    //   <div>
    //     <div className="d-flex align-items-center gap-2">
    //       <h6 className="fw-semibold mb-0">
    //         {comment.user?.username}
    //       </h6>
    //       <span className="small text-muted">
    //         · {timeAgo(comment.created_at)}
    //       </span>
    //     </div>

    //     <p className="mb-0">{comment.comment}</p>
    //   </div>
    // </div>
    <>
      <div className="profile-area d-center justify-content-between">
        <div className="avatar-item d-flex gap-3 align-items-center">
          <div className="avatar position-relative">
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #f05a28",
              }}
            >
              <Image
                src={comment.user?.picture || "/images/default-avatar.png"}
                alt="avatar"
                width={50}
                height={50}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            </div>
          </div>
          <div className="info-area">
            <h6 className="m-0 gap-2">
              {/* <Link href="/public-profile/post">{comment.user?.username || "Unknown User"}</Link> */}
              <span className="fw-bold">
                {comment.user?.username || "Unknown User"}
              </span>
              <span className="small">· {timeAgo(comment.created_at)}</span>
            </h6>
            {/* <span className="mdtxt status">@{userName}</span> */}
          </div>
        </div>
        {/* <div className="btn-group cus-dropdown">
          <Ts_PostAction />
        </div> */}
      </div>
      <div>
        {comment.type === 1 && <p className="mt-1 ps-16">{comment.comment}</p>}

        {comment.type === 2 && comment.filenameUrl && (
          <div className="mt-2">
            <Image
              src={comment.filenameUrl}
              alt="comment image"
              width={300}
              height={300}
              className="rounded"
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
          </div>
        )}
        <div className="ps-16">
          <Ts_ChildCommentReaction
            comment={comment}
            commentId={comment.id}
            postId={postId}
            onDelete={onDelete}
            onReport={onReport}
            onLikeToggle={onLikeToggle}
          />
        </div>
      </div>
    </>
  );
};

export default Ts_CommentReplies;
