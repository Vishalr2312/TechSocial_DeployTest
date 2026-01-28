import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosCall from "@/Utils/APIcall";
import Ts_ChildComment from "./Ts_ChildComment";
import Ts_ParentCommentReaction from "./Ts_ParentCommentReaction";

interface CommentApiResponse {
  status: number;
  message: string;
  data: {
    comment: CommentData;
  };
}

interface Ts_ParentCommentProps {
  comment: CommentItem;
  postId: number;
  onDelete: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onLikeToggle: (commentId: number) => void;
}

const Ts_ParentComment = ({
  comment,
  postId,
  onDelete,
  onReport,
  onLikeToggle,
}: Ts_ParentCommentProps) => {
  const [replyCount, setReplyCount] = useState<number>(0);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
  };

  useEffect(() => {
    const fetchReplyCount = async () => {
      try {
        const res = await axiosCall<CommentApiResponse>({
          ENDPOINT: `posts/comment-list?post_id=${comment.post_id}&parent_id=${comment.id}&page=1`,
          METHOD: "GET",
        });

        const meta = res?.data?.data?.comment?._meta;
        if (meta) {
          setReplyCount(meta.totalCount);
        }
      } catch {
        // silent fail is fine here
      }
    };

    fetchReplyCount();
  }, [comment.id, comment.post_id]);

  return (
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
          <Ts_ParentCommentReaction
            comment={comment}
            commentId={comment.id}
            postId={postId}
            replyCount={replyCount}
            onDelete={onDelete}
            onReport={onReport}
            onLikeToggle={onLikeToggle}
          />
        </div>
      </div>
    </>
  );
};

export default Ts_ParentComment;
