import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Ts_CommentReaction from "./Ts_CommentReaction";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosCall from "@/Utils/APIcall";

interface Ts_ParentCommentProps {
  comment: CommentItem;
  onDelete: (commentId: number) => void;
}

const Ts_ParentComment = ({ comment, onDelete }: Ts_ParentCommentProps) => {
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
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <div className="d-flex align-items-center gap-2">
          <h6 className="fw-semibold">
            {comment.user?.username || "Unknown User"}
          </h6>
          <span className="small">· {timeAgo(comment.created_at)}</span>
        </div>

        {/* Comment content */}
        {comment.type === 1 && <p className="mt-1">{comment.comment}</p>}

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

        {/* Actions */}
        {/* <div className="d-flex gap-4 text-muted small">
          <span className="cursor-pointer">Reply</span>
          <span className="cursor-pointer">Like</span>
          <span className="cursor-pointer">Share</span>
        </div> */}
        <Ts_CommentReaction commentId={comment.id} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default Ts_ParentComment;
