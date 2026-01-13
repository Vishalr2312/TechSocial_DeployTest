import { UserList } from "@/Type/SearchUsers/SearchUsers";
import Image from "next/image";
import Link from "next/link";

interface TwitterCommentProps {
  comment: CommentItem;
}

const Ts_TwitterComment = ({ comment }: TwitterCommentProps) => {
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <div className="d-flex gap-3 py-3 border-bottom">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={comment?.user?.picture || "/images/default-avatar.png"}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-circle"
        />
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <div className="d-flex align-items-center gap-2">
          {/* <strong className="fw-semibold">{comment?.user?.username}</strong> */}
          <h6 className="m-0 mb-3">
            <Link href="/public-profile/post">{comment?.user?.username}</Link>
          </h6>

          <span className="text-muted small">
            · {timeAgo(comment.created_at)}
          </span>
        </div>

        {/* Comment Text */}
        <p className="mb-2 mt-1">{comment.comment}</p>

        {/* Actions */}
        <div className="d-flex gap-4 text-muted small">
          <span className="cursor-pointer">Reply</span>
          <span className="cursor-pointer">Like</span>
          <span className="cursor-pointer">Share</span>
        </div>
      </div>
    </div>
  );
};

export default Ts_TwitterComment;
