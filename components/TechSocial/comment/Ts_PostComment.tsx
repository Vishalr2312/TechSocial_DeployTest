"use client";

import axiosCall from "@/Utils/APIcall";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DarkLoader from "../Loader/DarkLoader";
import { toast } from "react-toastify";
import Ts_Post from "./Ts_Post";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Ts_PostReaction from "./Ts_PostReaction";
import Ts_WriteComment from "./Ts_WriteComment";
import Ts_ParentComment from "./Ts_ParentComment";
import Ts_TwitterComment from "./Ts_TwitterComment";
import { UserList, UserListData } from "@/Type/SearchUsers/SearchUsers";

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

export interface UserListApiResponse {
  status: number;
  message: string;
  data: UserListData;
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

interface Ts_PostCommentProps {
  clss?: string;
  postId: number;
}

const Ts_PostComment = ({ clss = "", postId }: Ts_PostCommentProps) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  // const didFetchComments = useRef(false);

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

  // useEffect(() => {
  //   if (!postId) return;
  //   if (didFetchComments.current) return;
  //   didFetchComments.current = true;

  //   const fetchComments = async () => {
  //     try {
  //       setLoadingComments(true);

  //       const response = await axiosCall<CommentApiResponse>({
  //         ENDPOINT: `posts/comment-list?post_id=${postId}`,
  //         METHOD: "GET",
  //       });

  //       // ❌ API-level validation
  //       if (response?.data?.data?.comment?.errors) {
  //         const errors = response.data.data.comment.errors;
  //         const firstField = Object.keys(errors)[0] as keyof typeof errors;
  //         const firstMessage =
  //           errors[firstField]?.[0] ?? "Failed to fetch comments";
  //         toast.error(firstMessage);
  //         return;
  //       }

  //       // ✅ Success
  //       setComments(response?.data?.data?.comment.items ?? []);
  //     } catch (error: any) {
  //       toast.error(
  //         error?.response?.data?.message || "Failed to fetch comments"
  //       );
  //     } finally {
  //       setLoadingComments(false);
  //     }
  //   };

  //   fetchComments();
  // }, [postId]);

  useEffect(() => {
    if (!postId || !hasMore) return;

    const fetchComments = async () => {
      try {
        setLoadingComments(true);

        const response = await axiosCall<CommentApiResponse>({
          ENDPOINT: `posts/comment-list?post_id=${postId}&page=${page}&expand=user`,
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
          error?.response?.data?.message || "Failed to fetch comments"
        );
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId, page, hasMore]);

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
        <Ts_WriteComment
          postId={postId}
          onCommentAdded={(newComment) => {
            setComments((prev) => [newComment, ...prev]);
            setPage(1);
            setHasMore(true);
          }}
        />
        {/* {comments
          ? comments.map((comment) => (
              <div key={comment.id} className="comments-area mt-5">
                <div className="single-comment-area ms-1 ms-xxl-15">
                  <Ts_ParentComment comment={comment} />
                </div>
              </div>
            ))
          : ""} */}
        {comments.map((comment) => (
          <div key={comment.id} className="comments-area mt-5">
            <Ts_ParentComment
              key={comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
            />
          </div>
        ))}
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

export default Ts_PostComment;
