"use client";

import contentData from "@/data/contentData";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import avatar_6 from "/public/images/avatar-6.png";
import { UserList } from "@/Type/SearchUsers/SearchUsers";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import SinglePost from "./SinglePost";

interface ApiResponse {
  status: number;
  success: string;
  message: string;
  data: {
    post: PostData;
  };
}

interface TrendingPostProps {
  children: React.ReactNode;
}

const CACHE_KEY = "trending_posts";
const TTL = 60 * 60 * 1000; // 1 hour
const MAX_PAGES = 5;
const SHOW_COUNT = 3;

const TrendingPosts = ({ children }: TrendingPostProps) => {
  const pathname = usePathname();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        setLoading(true);

        // const response = await axiosCall<ApiResponse>({
        //   ENDPOINT: "posts/search-post?expand=user&page=${page}",
        //   METHOD: "GET",
        // });

        // if (response?.data?.data?.post?.errors) {
        //   const errors = response.data.data.post.errors;
        //   const firstField = Object.keys(errors)[0] as keyof typeof errors;
        //   const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
        //   toast.error(firstMessage);
        //   return;
        // }

        // const posts = response?.data?.data?.post;

        // if (!posts || posts.length === 0) {
        //   console.log("No users found in response");
        //   setPosts([]);
        //   return;
        // }

        // const sorted = [...posts]
        //   .filter((p) => typeof p.items.popular_point === "number")
        //   .sort(
        //     (a, b) =>
        //       (b.popular_point ?? 0) - (a.popular_point ?? 0) || b.id - a.id,
        //   )
        //   .slice(0, 5);

        // setPosts(sortedUsers.slice(0, 5));
        /** 1️⃣ Check cache */
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < TTL) {
            setPosts(parsed.data);
            setLoading(false);
            return;
          }
        }

        /** 2️⃣ Fetch pages 1 → 5 */
        const allPosts: PostItem[] = [];

        for (let page = 1; page <= MAX_PAGES; page++) {
          const res = await axiosCall<ApiResponse>({
            ENDPOINT: `posts/search-post?expand=user&page=${page}&is_popular_post=1`,
            METHOD: "GET",
          });

          if (res?.data?.data?.post?.errors) {
            const errors = res.data.data.post.errors;
            const firstField = Object.keys(errors)[0] as keyof typeof errors;
            const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
            toast.error(firstMessage);
            return;
          }

          const items = res?.data?.data?.post?.items ?? [];
          allPosts.push(...items);
        }

        if (!allPosts.length) {
          setPosts([]);
          return;
        }

        /** 3️⃣ Sort & select top */
        const trending = allPosts
          .filter(
            (p) =>
              typeof p.popular_point === "number" &&
              ((p.title && p.title.trim().length > 0) ||
                (p.description && p.description.trim().length > 0)),
          )
          .sort(
            (a, b) =>
              (b.popular_point ?? 0) - (a.popular_point ?? 0) ||
              b.created_at - a.created_at,
          )
          .slice(0, SHOW_COUNT);

        /** 4️⃣ Cache */
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: trending,
          }),
        );

        setPosts(trending);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    loadTrendingPosts();
  }, []);

  return (
    <>
      {/* children props */}
      {children}

      <div className="d-flex flex-column gap-6">
        {loading ? (
          <div>Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="profile-area d-center position-relative align-items-center justify-content-between"
            >
              <SinglePost key={post.id} data={post} />
            </div>
          ))
        ) : (
          <div>No posts found</div>
        )}
      </div>
    </>
  );
};

export default TrendingPosts;
