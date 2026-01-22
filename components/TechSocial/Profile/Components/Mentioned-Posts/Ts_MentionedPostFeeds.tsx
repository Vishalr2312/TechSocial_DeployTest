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
    post: PostItem[];
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
}

const Ts_MentionedPostFeeds = ({ clss = "", reaction = "" }) => {
  const [allPosts, setAllPosts] = useState<Ts_PostProps[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Ts_PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postsPerRender, setPostsPerRender] = useState(20);
  const pageIndex = useRef(0);

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
    };
  };

  // 🚀 Fetch posts dynamically
  //   const fetchAllPosts = useCallback(async () => {
  //     try {
  //       setLoading(true);

  //       // 1️⃣ Fetch first page to get meta info
  //       const firstRes = await axiosCall<ApiResponse>({
  //         ENDPOINT: "posts/view-mentioned-posts?page=1",
  //         METHOD: "GET",
  //       });

  //       const firstItems = firstRes?.data?.data?.post ?? [];
  //       const meta = firstRes?.data?.data?._meta;
  //       const perPage = meta?.perPage ?? 20;

  //       setPostsPerRender(perPage); // dynamic per-page

  //       // 2️⃣ Fetch remaining pages in parallel
  //       const otherPageRequests = Array.from(
  //         { length: (meta?.pageCount ?? 1) - 1 },
  //         (_, i) =>
  //           axiosCall<ApiResponse>({
  //             ENDPOINT: `posts/view-mentioned-posts?page=${i + 2}`,
  //             METHOD: "GET",
  //           }).catch(() => null)
  //       );

  //       const responses = await Promise.all(otherPageRequests);

  //       const allFetchedPosts: PostItem[] = [...firstItems];
  //       responses.forEach((res) => {
  //         if (res && res.data?.data?.post?.length) {
  //           allFetchedPosts.push(...res.data.data.post);
  //         }
  //       });

  //       // 3️⃣ Map + deduplicate + sort
  //       const mappedPosts = allFetchedPosts.map(mapPost);

  //       const uniquePosts = Array.from(
  //         new Map(mappedPosts.map((p) => [p.postId, p])).values()
  //       );

  //       uniquePosts.sort((a, b) => b.created_at - a.created_at);

  //       // 4️⃣ Store + display
  //       setAllPosts(uniquePosts);
  //       setDisplayedPosts(uniquePosts.slice(0, perPage));
  //       pageIndex.current = 1;
  //       setHasMore(uniquePosts.length > perPage);
  //     } catch (err) {
  //       toast.error(`Failed to fetch posts: ${err}`);
  //       console.log(`Failed to fetch posts: ${err}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, []);
  const POSTS_PER_BATCH = 20;
  const fetchAllPosts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosCall<ApiResponse>({
        ENDPOINT: "posts/view-mentioned-posts?expand=user",
        METHOD: "GET",
      });

      const posts = res?.data?.data?.post ?? [];

      const mappedPosts = posts.map(mapPost);

      mappedPosts.sort((a, b) => b.created_at - a.created_at);

      setAllPosts(mappedPosts);
      setDisplayedPosts(mappedPosts.slice(0, POSTS_PER_BATCH));
      setHasMore(mappedPosts.length > POSTS_PER_BATCH);
      pageIndex.current = 1;
    } catch (err) {
      toast.error("Failed to fetch mentioned posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // 📜 Infinite scroll logic
  const loadMorePosts = useCallback(() => {
    const nextPosts = allPosts.slice(
      pageIndex.current * postsPerRender,
      (pageIndex.current + 1) * postsPerRender,
    );

    setDisplayedPosts((prev) => [...prev, ...nextPosts]);
    pageIndex.current += 1;
    if (pageIndex.current * postsPerRender >= allPosts.length) {
      setHasMore(false);
    }
  }, [allPosts, postsPerRender]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        loadMorePosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadMorePosts]);

  // Initial fetch
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  return (
    <div className="post-item d-flex flex-column gap-5 gap-md-7" id="news-feed">
      {displayedPosts.map((post) => (
        <div key={post.postId} className={`post-single-box ${clss}`}>
          <Ts_Post post={post} />
          <Ts_PostReaction post={post} />
        </div>
      ))}
      {loading && <DarkLoader />}
      {/* {!hasMore && !loading && (
        <div className="text-center my-3 text-muted">No more posts</div>
      )} */}
      {!loading && displayedPosts.length === 0 && (
        <div className="text-center text-muted my-5">
          <h6>No mentioned posts yet</h6>
          <p>Posts where you are mentioned will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Ts_MentionedPostFeeds;
