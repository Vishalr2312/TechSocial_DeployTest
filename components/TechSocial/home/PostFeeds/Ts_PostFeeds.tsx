"use client";

import axiosCall from "@/Utils/APIcall";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Ts_Post from "./components/Ts_Post";
import DarkLoader from "../../Loader/DarkLoader";
import Ts_PostReaction from "./components/Ts_PostReaction";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setPosts } from "@/Redux/Reducers/PostFeeds/PostSlice";

interface ApiResponse {
  status: number;
  success: string;
  message: string;
  data: {
    post: PostData;
  };
}

interface Ts_PostProps {
  postId: number;
  userId: number;
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
}

const Ts_PostFeeds = ({ clss = "", reaction = "" }) => {
  const dispatch = useAppDispatch();
  const { posts: allPosts } = useAppSelector((state) => state.post);

  // const [displayedPosts, setDisplayedPosts] = useState<Ts_PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageIndex = useRef(0);
  const loadingRef = useRef(false);

  const mapPost = (post: PostItem): Ts_PostProps => {
    const gallery: PostGalleryItem[] = post.postGallary || [];
    const isPdf = (g: PostGalleryItem) =>
      g.filename?.toLowerCase().endsWith(".pdf");

    const images = gallery.filter((g) => g.media_type === 1 && !isPdf(g));
    const videos = gallery.filter((g) => g.media_type === 2);
    const pdfs = gallery.filter((g) => g.media_type === 4 || isPdf(g));

    return {
      postId: post.id,
      userId: post.user.id,
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
      isFollowing:post.user.isFollowing || false,
    };
  };

  const fetchAllPosts = useCallback(
    async (page = 1) => {
      if (loadingRef.current || !hasMore) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const res = await axiosCall<ApiResponse>({
          ENDPOINT: `posts/search-post?expand=user&is_recent=1&page=${page}`,
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
          <Ts_Post post={post} />
          <Ts_PostReaction post={post} isVideoPost={post.isVideoPost} />
        </div>
      ))}

      {loading && <DarkLoader />}

      {!hasMore && !loading && (
        <div className="text-center my-3 text-muted">No more posts</div>
      )}
    </div>
  );
};

export default Ts_PostFeeds;
