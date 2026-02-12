"use client";

import axiosCall from "@/Utils/APIcall";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import DarkLoader from "../../../Loader/DarkLoader";
import Ts_Post from "./Ts_Post";
import Ts_PostReaction from "./Ts_PostReaction";

interface ApiResponse {
  status: number;
  message: string;
  data: {
    post: PostData;
    // _links: PaginationLinks;
    // _meta: PaginationMeta;
  };
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
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
  isOnline: boolean;
}

const Ts_MentionedPostFeeds = ({ clss = "", reaction = "" }) => {
  const [allPosts, setAllPosts] = useState<Ts_PostProps[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Ts_PostProps[]>([]);
  const [posts, setPosts] = useState<Ts_PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postsPerRender, setPostsPerRender] = useState(20);
  const pageIndex = useRef(0);
  const loadingRef = useRef(false);

  // 🧠 Common mapper
  const mapPost = (post: PostItem): Ts_PostProps => {
    const gallery: PostGalleryItem[] = post.postGallary || [];
    // const isPdf = (g: PostGalleryItem) =>
    //   g.filename?.toLowerCase().endsWith(".pdf");

    // const images = gallery.filter((g) => g.media_type === 1 && !isPdf(g));
    // const videos = gallery.filter((g) => g.media_type === 2);
    // const pdfs = gallery.filter((g) => g.media_type === 4 || isPdf(g));
    const getFileName = (g: PostGalleryItem) =>
      (g.filenameUrl || g.filename || "").toLowerCase();

    const isPdf = (g: PostGalleryItem) => getFileName(g).endsWith(".pdf");

    const isImage = (g: PostGalleryItem) =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(getFileName(g));

    const isVideo = (g: PostGalleryItem) =>
      /\.(mp4|webm|ogg)$/i.test(getFileName(g));

    const images = gallery.filter(isImage);
    const videos = gallery.filter(isVideo);
    const pdfs = gallery.filter(isPdf);

    return {
      postId: post.id,
      postText: post.description || post.title || "",
      hashTags: post.hashtags || [],
      postImgs: images.map((i) => i.filenameUrl || i.filename),
      postVideos: videos.map((v) => v.filenameUrl || v.filename),
      postPdfs: pdfs.map((p) => p.filenameUrl || p.filename),
      name: post.user?.name ?? "Unknown user",
      userName: post.user?.username ?? "Unknown",
      userAvt: post.user?.picture ?? "",
      created_at: Number(post.created_at) || 0,
      total_view: post.total_view || 0,
      total_like: post.total_like || 0,
      total_comment: post.total_comment || 0,
      total_share: post.total_share || 0,
      ai_search_views: post.ai_search_views || 0,
      isOnline: post.user.is_online || false,
    };
  };

  const fetchAllPosts = useCallback(async (page = 1) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await axiosCall<ApiResponse>({
        ENDPOINT: `posts/view-mentioned-posts?expand=user&is_recent=1&page=${page}`,
        METHOD: "GET",
      });

      const items = res?.data?.data?.post?.items ?? [];
      const meta = res?.data?.data?.post?._meta;

      const mappedPosts = items.map(mapPost);

      setPosts((prev) => [...prev, ...mappedPosts]);

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
  }, []);

  // 📜 Load more
  const loadMorePosts = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchAllPosts(pageIndex.current + 1);
    }
  }, [fetchAllPosts, hasMore]);

  // Scroll listener
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

  // Initial fetch
  useEffect(() => {
    pageIndex.current = 0;
    setHasMore(true);
    setPosts([]);
    fetchAllPosts(1);
  }, [fetchAllPosts]);

  return (
    <div className="post-item d-flex flex-column gap-5 gap-md-7" id="news-feed">
      {posts.map((post) => (
        <div key={post.postId} className={`post-single-box ${clss}`}>
          <Ts_Post post={post} />
          <Ts_PostReaction post={post} />
        </div>
      ))}
      {loading && <DarkLoader />}
      {/* {!hasMore && !loading && (
        <div className="text-center my-3 text-muted">No more posts</div>
      )} */}
      {!loading && posts.length === 0 && (
        <div className="text-center text-muted my-5">
          <h6>No mentioned posts yet</h6>
          <p>Posts where you are mentioned will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Ts_MentionedPostFeeds;
