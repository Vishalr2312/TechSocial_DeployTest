import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/Redux/hooks";
import { Post } from "@/Type/Post Feeds/PostByIdTypes";
import axiosCall from "@/Utils/APIcall";
import Image from "next/image";
import { toast } from "react-toastify";
import DarkLoader from "../Loader/DarkLoader";

interface Props {
  post: {
    postId: number;
    postThumbnail?: string;
  } | null;
}

interface GetPostByIdApiResponse {
  status: number;
  message: string;
  data: {
    post: Post;
    errors: any;
  };
}

const PostMessage = ({ post }: Props) => {
  const [fullPost, setFullPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  const postId = post?.postId;

  // ✅ 3. Fetch only if redux missing
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await axiosCall<GetPostByIdApiResponse>({
          ENDPOINT: `posts/${postId}?expand=user,user.userLiveDetail,clubDetail,giftSummary`,
          METHOD: "GET",
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0];
          toast.error(errors[firstField]?.[0] ?? "Unknown error");
          return;
        }

        const apiPost = response.data.data.post;

        setFullPost(apiPost);

        // ⭐ optional but recommended
        // dispatch(setSelectedPost(apiPost));
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>Post unavailable</p>;

  return (
    <div className="post-message-card">
      {loading && <DarkLoader />}
      {fullPost?.user && (
        <div
          className="post-owner d-flex align-items-center gap-2 mb-2"
        >
          <Image
            src={fullPost.user.picture}
            alt="avatar"
            width={32}
            height={32}
            style={{ borderRadius: "50%", border: "1px solid #f05a28" }}
          />
          <span>{fullPost.user.name}</span>
        </div>
      )}

      {/* {post.postThumbnail && (
        <Image
          src={post.postThumbnail}
          alt="image"
          width={350}
          height={350}
          style={{ width: "100%", borderRadius: 12 }}
        />
      )} */}
      {(fullPost?.postGallary?.[0]?.filenameUrl || post.postThumbnail) && (
        <Image
          src={fullPost?.postGallary?.[0]?.filenameUrl ?? post.postThumbnail!}
          alt="post"
          width={350}
          height={350}
          style={{ width: "100%", borderRadius: 12 }}
        />
      )}

      {/* {post.video && (
        <video controls style={{ width: "100%", borderRadius: 12 }}>
          <source src={post.video} />
        </video>
      )}

      {post.title && <p className="mt-2">{post.title}</p>} */}
    </div>
  );
};

export default PostMessage;
