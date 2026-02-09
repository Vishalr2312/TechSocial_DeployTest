"use client";

import axiosCall from "@/Utils/APIcall";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Ts_Post from "./components/Ts_Post";
import DarkLoader from "../../Loader/DarkLoader";
import Ts_PostReaction from "./components/Ts_PostReaction";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { removePost, setPosts } from "@/Redux/Reducers/PostFeeds/PostSlice";
import Ts_RepostModal from "./components/Modal/Ts_RepostModal";
import Ts_Repost from "./components/Ts_Repost";

interface ApiResponse {
  status: number;
  success: string;
  message: string;
  data: {
    post: PostData;
  };
}

interface DeleteApiResponse {
  status: number;
  message: string;
  data: [];
}

interface BasePostProps {
  postId: number;
  userId: number;
  type: number;
  postText?: string;
  hashTags?: string[];
  postImgs: string[];
  postVideos?: string[];
  postPdfs?: string[];
  isVideoPost?: boolean;
  name: string;
  userName: string;
  userAvt: string;
  created_at: number;
  is_like: boolean;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
  isFollowing: boolean;
  isSaved: boolean;
}

export interface Ts_NormalPostProps extends BasePostProps {
  type: Exclude<number, 5>;
}

export interface Ts_RepostProps extends BasePostProps {
  type: 5;
  repostedBy: {
    name: string;
    username: string;
    avatar: string;
    title?: string;
  };
  originalPost?: {
    postId: number;
    text?: string;
    imgs: string[];
    videos?: string[];
    pdfs?: string[];
    user: {
      name: string;
      username: string;
      avatar: string;
    };
  };
}
export type Ts_PostProps = Ts_NormalPostProps | Ts_RepostProps;

// interface Ts_PostProps {
//   postId: number;
//   userId: number;
//   type: number;
//   postText?: string;
//   hashTags?: string[];
//   postImgs: string[];
//   postVideos?: string[];
//   postPdfs?: string[];
//   isVideoPost?: boolean;
//   name: string;
//   userName: string;
//   userAvt: string;
//   created_at: number;
//   is_like: boolean;
//   total_view: number;
//   total_like: number;
//   total_comment: number;
//   total_share: number;
//   ai_search_views: number;
//   isFollowing: boolean;
//   repostedBy?: {
//     name: string;
//     username: string;
//     avatar: string;
//     comment?: string;
//   };
//   // original post
//   originalPost: {
//     postId: number;
//     text?: string;
//     imgs: string[];
//     videos?: string[];
//     pdfs?: string[];
//     // user: {
//     //   name: string;
//     //   username: string;
//     //   avatar: string;
//     // };
//   };
// }

const Ts_PostFeeds = ({ clss = "", reaction = "" }) => {
  const dispatch = useAppDispatch();
  const { posts: allPosts } = useAppSelector((state) => state.post);

  // const [displayedPosts, setDisplayedPosts] = useState<Ts_PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [repostPostId, setRepostPostId] = useState<number | null>(null);

  const pageIndex = useRef(0);
  const loadingRef = useRef(false);

  // const mapPost = (post: PostItem): Ts_PostProps => {
  //   const gallery: PostGalleryItem[] = post.postGallary || [];
  //   const isPdf = (g: PostGalleryItem) =>
  //     g.filename?.toLowerCase().endsWith(".pdf");

  //   const images = gallery.filter((g) => g.media_type === 1 && !isPdf(g));
  //   const videos = gallery.filter((g) => g.media_type === 2);
  //   const pdfs = gallery.filter((g) => g.media_type === 4 || isPdf(g));
  //   const origin = post.originPost;
  //   const originGallery: PostGalleryItem[] = origin?.postGallary || [];

  //   const originImages = originGallery.filter(
  //     (g) => g.media_type === 1 && !isPdf(g),
  //   );

  //   const originVideos = originGallery.filter((g) => g.media_type === 2);

  //   const originPdfs = originGallery.filter(
  //     (g) => g.media_type === 4 || isPdf(g),
  //   );

  //   return {
  //     postId: post.id,
  //     userId: post.user.id,
  //     type: post.type,
  //     postText: post.description || post.title || "",
  //     hashTags: post.hashtags || [],
  //     postImgs: images.map((i) => i.filenameUrl || i.filename),
  //     postVideos: videos.map((v) => v.filenameUrl || v.filename),
  //     postPdfs: pdfs.map((p) => p.filenameUrl || p.filename),
  //     isVideoPost: videos.length > 0,
  //     name: post.user.name,
  //     userName: post.user.username,
  //     userAvt: post.user.picture || "",
  //     created_at: Number(post.created_at) || 0,
  //     is_like: post.is_like || false,
  //     total_view: post.total_view || 0,
  //     total_like: post.total_like || 0,
  //     total_comment: post.total_comment || 0,
  //     total_share: post.total_share || 0,
  //     ai_search_views: post.ai_search_views || 0,
  //     isFollowing: post.user.isFollowing || false,
  //     repostedBy: {
  //       name: post.user.name,
  //       username: post.user.username,
  //       avatar: post.user.picture || "",
  //       comment: post.share_comment || "",
  //     },
  //     originalPost: {
  //       postId: origin?.id || 0,
  //       text: origin?.description || origin?.title || "",
  //       imgs: originImages.map((i) => i.filenameUrl || i.filename),
  //       videos: originVideos.map((v) => v.filenameUrl || v.filename),
  //       pdfs: originPdfs.map((p) => p.filenameUrl || p.filename),
  //       // user: {
  //       //   name: origin.user?.name ?? "",
  //       //   username: origin.user?.username ?? "",
  //       //   avatar: origin.user?.picture ?? "",
  //       // },
  //     },
  //   };
  // };
  const mapPost = (post: PostItem): Ts_PostProps => {
    const gallery: PostGalleryItem[] = post.postGallary || [];

    const isPdf = (g: PostGalleryItem) =>
      g.filename?.toLowerCase().endsWith(".pdf");

    const images = gallery.filter((g) => g.media_type === 1 && !isPdf(g));
    const videos = gallery.filter((g) => g.media_type === 2);
    const pdfs = gallery.filter((g) => g.media_type === 4 || isPdf(g));

    const basePost: BasePostProps = {
      postId: post.id,
      userId: post.user.id,
      type: post.type,
      postText: post.description || post.title || "",
      hashTags: post.hashtags || [],
      postImgs: images.map((i) => i.filenameUrl || i.filename),
      postVideos: videos.map((v) => v.filenameUrl || v.filename),
      postPdfs: pdfs.map((p) => p.filenameUrl || p.filename),
      isVideoPost: videos.length > 0,
      name: post.user.name,
      userName: post.user.username,
      userAvt: post.user.picture || "",
      created_at: Number(post.created_at) || 0,
      is_like: post.is_like || false,
      total_view: post.total_view || 0,
      total_like: post.total_like || 0,
      total_comment: post.total_comment || 0,
      total_share: post.total_share || 0,
      ai_search_views: post.ai_search_views || 0,
      isFollowing: post.user.isFollowing || false,
      isSaved: post.is_saved || false,
    };

    /* 🔁 Repost */
    if (post.type === 5 && post.originPost) {
      const origin = post.originPost;
      const originGallery = origin.postGallary || [];

      const originImages = originGallery.filter(
        (g) => g.media_type === 1 && !isPdf(g),
      );
      const originVideos = originGallery.filter((g) => g.media_type === 2);
      const originPdfs = originGallery.filter(
        (g) => g.media_type === 4 || isPdf(g),
      );

      return {
        ...basePost,
        type: 5,
        repostedBy: {
          name: post.user.name,
          username: post.user.username,
          avatar: post.user.picture || "",
          title: post.title || "",
        },
        originalPost: {
          postId: origin.id,
          text: origin.title || "",
          imgs: originImages.map((i) => i.filenameUrl || i.filename),
          videos: originVideos.map((v) => v.filenameUrl || v.filename),
          pdfs: originPdfs.map((p) => p.filenameUrl || p.filename),
          user: {
            name: origin.user?.name ?? "",
            username: origin.user?.username ?? "",
            avatar: origin.user?.picture ?? "",
          },
        },
      };
    }

    /* 🔁 Broken Repost - originPost is null */
    if (post.type === 5 && !post.originPost) {
      return {
        ...basePost,
        type: 5,
        repostedBy: {
          name: post.user.name,
          username: post.user.username,
          avatar: post.user.picture || "",
          title: post.title || "",
        },
        originalPost: undefined, // 🚨 Mark as unavailable
      } as Ts_RepostProps;
    }

    /* 🧾 Normal post */
    return {
      ...basePost,
      type: post.type as Exclude<number, 5>,
    };
  };

  const handleDeletePost = async (postId: number) => {
    // 1️⃣ Optimistic UI
    dispatch(removePost(postId));

    try {
      // 2️⃣ API call
      await axiosCall<DeleteApiResponse>({
        ENDPOINT: `posts/${postId}`,
        METHOD: "DELETE",
      });

      toast.success("Post deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete post");

      // 🔁 Optional rollback on failure refetch posts
      fetchAllPosts(1);
    }
  };

  const fetchAllPosts = useCallback(
    async (page = 1) => {
      if (loadingRef.current || !hasMore) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const res = await axiosCall<ApiResponse>({
          ENDPOINT: `posts/search-post?expand=user,originPost.user&is_recent=1&page=${page}`,
          METHOD: "GET",
        });

        const items = res?.data?.data?.post?.items ?? [];
        const meta = res?.data?.data?.post?._meta;

        const mappedPosts = items.map(mapPost);

        dispatch(setPosts(mappedPosts));
        // setDisplayedPosts(mergedPosts);

        pageIndex.current = page;

        if (!meta || page >= meta.pageCount) {
          setHasMore(false);
        }
      } catch (err) {
        toast.error("Failed to fetch posts");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, hasMore],
  );

  const loadMorePosts = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchAllPosts(pageIndex.current + 1);
    }
  }, [fetchAllPosts, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loadingRef.current
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadMorePosts]);

  useEffect(() => {
    pageIndex.current = 0;
    setHasMore(true);
    dispatch(setPosts([]));
    // setDisplayedPosts([]);
    fetchAllPosts(1);
  }, [fetchAllPosts, dispatch]);

  return (
    <div className="post-item d-flex flex-column gap-5 gap-md-7" id="news-feed">
      {allPosts.map((post) => (
        <div key={post.postId} className={`post-single-box ${clss}`}>
          {/* <Ts_Post post={post} /> */}
          {post.type === 5 ? (
            <Ts_Repost
              post={post as Ts_RepostProps}
              onDelete={handleDeletePost}
            />
          ) : (
            <Ts_Post post={post} onDelete={handleDeletePost} />
          )}
          <Ts_PostReaction
            key={post.postId}
            post={post}
            isVideoPost={post.isVideoPost}
          />
        </div>
      ))}

      <Ts_RepostModal postId={repostPostId} />

      {loading && <DarkLoader />}

      {!hasMore && !loading && (
        <div className="text-center my-3 text-muted">No more posts</div>
      )}
    </div>
  );
};

export default Ts_PostFeeds;
