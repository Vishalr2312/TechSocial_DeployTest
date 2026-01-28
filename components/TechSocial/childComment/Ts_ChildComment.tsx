"use client";

import axiosCall from "@/Utils/APIcall";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DarkLoader from "../Loader/DarkLoader";
import { toast } from "react-toastify";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserList, UserListData } from "@/Type/SearchUsers/SearchUsers";
import Ts_Post from "./Ts_Post";
import Ts_PostReaction from "./Ts_PostReaction";
import Ts_ParentComment from "./Ts_ParentComment";
import { getParentCommentCache } from "@/Utils/commentCache";
import Ts_CommentReplies from "./Ts_CommentReplies";
import Ts_WriteComment from "./Ts_WriteComment";

export interface CommentApiResponse {
  status: number;
  message: string;
  data: {
    comment: CommentData;
  };
}

interface DeleteApiResponse {
  status: number;
  message: string;
  data: [];
}

interface ReportCommentApiResponse {
  status: number;
  message: string;
  data: {
    errors?: {
      message?: string[];
    };
  };
}

interface LikeUnlikeApiResponse {
  status: number;
  message: string;
  data: [];
}

interface Ts_PostProps {
  postId: number;
  postText?: string;
  hashTags?: string[];
  postImgs: string[];
  postVideos?: string[];
  postPdfs?: string[];
  name: string;
  userName: string;
  userAvt: string;
  created_at: number;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
}

interface Ts_ChildCommentProps {
  clss?: string;
  commentId: number;
  postId: number;
}

const Ts_ChildComment = ({
  clss = "",
  commentId,
  postId,
}: Ts_ChildCommentProps) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  // const didFetchComments = useRef(false);
  const [parentComment, setParentComment] = useState<CommentItem | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { posts, selectedPost } = useAppSelector((state) => state.post);

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axiosCall<DeleteApiResponse>({
        ENDPOINT: `post-comments/${commentId}`,
        METHOD: "DELETE",
      });

      // ✅ Optimistic UI update
      setComments((prev) => prev.filter((c) => c.id !== commentId));

      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleToggleLike = async (commentId: number) => {
    // 🔥 optimistic update for parent comment
    setParentComment((prev) =>
      prev && prev.id === commentId ? { ...prev, isLike: !prev.isLike } : prev,
    );

    // optimistic update for child comments
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, isLike: !c.isLike } : c)),
    );

    try {
      const target =
        parentComment?.id === commentId
          ? parentComment
          : comments.find((c) => c.id === commentId);

      if (!target) return;

      const res = await axiosCall<LikeUnlikeApiResponse>({
        ENDPOINT: target.isLike ? "comments/unlike" : "comments/like",
        METHOD: "POST",
        PAYLOAD: {
          comment_id: commentId,
          source_type: 1,
        },
      });
      toast.success(res?.data?.message);
    } catch {
      // rollback parent
      setParentComment((prev) =>
        prev && prev.id === commentId
          ? { ...prev, isLike: !prev.isLike }
          : prev,
      );

      // rollback children
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, isLike: !c.isLike } : c)),
      );
      toast.error("Failed to update like");
    }
  };

  const handleReportComment = async (commentId: number) => {
    try {
      const res = await axiosCall<ReportCommentApiResponse>({
        ENDPOINT: "post-comments/report-comment",
        METHOD: "POST",
        PAYLOAD: {
          post_comment_id: commentId,
        },
      });

      const errors = res?.data?.data?.errors;

      if (errors?.message?.length) {
        toast.info(errors.message[0]); // 👈 already reported
        return;
      }

      toast.success("Comment reported successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to report comment");
    }
  };

  useEffect(() => {
    const cached = getParentCommentCache(commentId);
    if (cached) {
      setParentComment(cached);
    }
  }, [commentId]);

  useEffect(() => {
    if (!postId || !hasMore) return;

    const fetchComments = async () => {
      try {
        setLoadingComments(true);

        const response = await axiosCall<CommentApiResponse>({
          ENDPOINT: `posts/comment-list?post_id=${postId}&parent_id=${commentId}&page=${page}&expand=user`,
          METHOD: "GET",
        });

        const commentData = response?.data?.data?.comment;

        if (!commentData) return;

        // ❌ API-level validation
        if (commentData?.errors) {
          const errors = commentData.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          toast.error(errors[firstField]?.[0] ?? "Failed to fetch comments");
          return;
        }

        // Append comments (IMPORTANT)
        // setComments((prev) => [...prev, ...commentData.items]);
        setComments((prev) => {
          const map = new Map<number, CommentItem>();
          [...prev, ...commentData.items].forEach((c) => map.set(c.id, c));
          return Array.from(map.values());
        });

        // Pagination logic
        setHasMore(commentData._meta.currentPage < commentData._meta.pageCount);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch comments",
        );
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId, commentId, page, hasMore]);

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [postId]);

  const post: Ts_PostProps | undefined = useMemo(() => {
    if (selectedPost?.postId === postId) {
      return selectedPost;
    }
    return posts.find((p) => p.postId === postId);
  }, [postId, posts, selectedPost]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // 🛑 Safety guard
  if (!post) {
    return (
      <div className="text-center my-5 text-muted">
        Post not found or still loading
      </div>
    );
  }

  return (
    <div className="post-item d-flex flex-column gap-5 gap-md-7" id="news-feed">
      <div className={`post-single-box ${clss}`}>
        {/* <button
          onClick={handleBack}
          className="btn d-inline-flex align-items-center gap-2 mb-3"
        > */}
        <div className="mb-4 d-flex gap-4 align-items-center">
          <Link href="/">
            <i className="material-symbols-outlined mat-icon">arrow_back</i>
          </Link>
          <h5>Post</h5>
        </div>
        {/* </button> */}
        <Ts_Post post={post} />
        <Ts_PostReaction post={post} />
        {parentComment && (
          <div className="comments-area mt-5">
            <Ts_ParentComment
              postId={postId}
              comment={parentComment}
              onDelete={handleDeleteComment}
              onLikeToggle={handleToggleLike}
              onReport={handleReportComment}
            />
          </div>
        )}
        {/* <div>
          <Ts_ParentCommentReaction
          // comment={comment}
          // commentId={comment.id}
          // postId={postId}
          // replyCount={replyCount}
          // onDelete={onDelete}
          />
        </div> */}
        {/* {comments.map((comment) => (
          <div key={comment.id} className="comments-area mt-5">
            <Ts_ParentComment
              key={comment.id}
              postId={postId}
              comment={comment}
              onDelete={handleDeleteComment}
            />
          </div>
        ))} */}
        <Ts_WriteComment
          postId={postId}
          commentId={commentId}
          onCommentAdded={(newComment) => {
            setComments((prev) => [newComment, ...prev]);
            setPage(1);
            setHasMore(true);
          }}
        />
        {comments
          ? comments.map((comment) => (
              <div key={comment.id} className="comments-area mt-5">
                {/* <div className="single-comment-area ms-1 ms-xxl-15"> */}
                <Ts_CommentReplies
                  comment={comment}
                  postId={postId}
                  onDelete={handleDeleteComment}
                  onLikeToggle={handleToggleLike}
                  onReport={handleReportComment}
                />
                {/* </div> */}
              </div>
            ))
          : ""}
        {hasMore && !loadingComments && (
          <div className="text-center mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((p) => p + 1)}
            >
              Load more comments
            </button>
          </div>
        )}

        {loadingComments && <DarkLoader />}
      </div>
      {/* {loading && <DarkLoader />} */}
      {/* {!hasMore && !loading && (
        <div className="text-center my-3 text-muted">No more posts</div>
      )} */}
    </div>
  );
};

export default Ts_ChildComment;
