import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Ts_PostAction from "./Ts_PostAction";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/Redux/hooks";
import { setSelectedPost } from "@/Redux/Reducers/PostFeeds/PostSlice";
import dynamic from "next/dynamic";
import Ts_PdfCarousel from "./Ts_PdfCarousel";

// const PdfCarousel = dynamic(() => import("./Ts_PdfCarousel"), { ssr: false });

interface LinkPreview {
  title: string | null;
  description: string | null;
  images: string[];
  siteName: string | null;
  url: string;
  favicons: string[];
}

interface Ts_PostProps {
  postId: number;
  userId: number;
  type: number;
  postText?: string;
  hashTags?: string[];
  postImgs: string[];
  postVideos?: string[];
  postPdfs?: string[];
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
  isOnline: boolean;
}

interface Ts_PostComponentProps {
  post: Ts_PostProps;
  onDelete: (postId: number) => void;
}

const Ts_Post = ({ post, onDelete }: Ts_PostComponentProps) => {
  const {
    postId,
    userId,
    postText,
    userAvt,
    name,
    userName,
    created_at,
    hashTags,
    postImgs = [],
    postVideos = [],
    postPdfs = [],
    isFollowing,
    isSaved,
    isOnline,
  } = post;

  // ✅ Image carousel state
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleImageClick = () => {
    if (postImgs.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % postImgs.length);
    }
  };

  const [showFullText, setShowFullText] = useState(false);

  const { urlsInText, mainText } = useMemo(() => {
    if (!postText) return { urlsInText: [], mainText: "" };

    // Improved regex to avoid matching trailing punctuation
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const rawMatches = postText.match(urlRegex) || [];

    // Clean trailing punctuation from URLs
    const cleanUrls = Array.from(
      new Set(rawMatches.map((url) => url.replace(/[.,;!?)]+$/, ""))),
    );
    const textWithoutUrls = postText.replace(urlRegex, "").trim();

    return { urlsInText: cleanUrls, mainText: textWithoutUrls };
  }, [postText]);
  const [linkPreviews, setLinkPreviews] = useState<Record<string, LinkPreview>>(
    {},
  );

  const [loadingPreviews, setLoadingPreviews] = useState<
    Record<string, boolean>
  >({});

  const fetchedUrlsRef = useRef<Set<string>>(new Set());

  const router = useRouter();
  const dispatch = useAppDispatch();

  const firstLetter = name?.charAt(0).toUpperCase() || "?";

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const openImageViewer = (e: React.MouseEvent, img: string) => {
    e.stopPropagation(); // 🚫 stop post routing
    setActiveImage(img);
    setIsImageOpen(true);
  };

  const openPdf = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelectedPost(post));
    router.push(`/post/${post.postId}`);
  };

  const openUserProfile = (e: React.MouseEvent, userId: number) => {
    e.stopPropagation(); // 🚨 prevents post open
    router.push(`/profile/${userId}/post`);
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
  };

  // const fetchLinkPreview = useCallback(
  //   async (url: string) => {
  //     if (linkPreviews[url] || loadingPreviews[url]) return;

  //     setLoadingPreviews((prev) => ({ ...prev, [url]: true }));

  //     try {
  //       const res = await fetch(
  //         `https://api.microlink.io?url=${encodeURIComponent(url)}`,
  //       );
  //       const json = await res.json();
  //       const { data } = json;

  //       if (json.status === "success" && data) {
  //         const preview: LinkPreview = {
  //           title: data.title || null,
  //           description: data.description || null,
  //           images: data.image ? [data.image.url] : [],
  //           siteName: data.publisher || null,
  //           url: data.url || url,
  //           favicons: data.logo ? [data.logo.url] : [],
  //         };

  //         setLinkPreviews((prev) => ({
  //           ...prev,
  //           [url]: preview,
  //         }));
  //       } else {
  //          // Handle failure or empty data silently or set a "failed" state
  //          console.warn("Link preview failed for:", url, json);
  //       }
  //     } catch (err) {
  //       console.error("Link preview fetch failed", err);
  //     } finally {
  //       setLoadingPreviews((prev) => ({ ...prev, [url]: false }));
  //     }
  //   },
  //   [linkPreviews, loadingPreviews],
  // );
  // const fetchLinkPreview = useCallback(async (url: string) => {
  //   setLoadingPreviews((prev) => {
  //     if (prev[url]) return prev;
  //     return { ...prev, [url]: true };
  //   });

  //   try {
  //     const res = await fetch(
  //       `https://api.microlink.io?url=${encodeURIComponent(url)}`,
  //     );
  //     const json = await res.json();

  //     if (json.status === "success" && json.data) {
  //       const data = json.data;

  //       setLinkPreviews((prev) => {
  //         if (prev[url]) return prev; // 🛑 hard stop duplicate
  //         return {
  //           ...prev,
  //           [url]: {
  //             title: data.title ?? null,
  //             description: data.description ?? null,
  //             images: data.image ? [data.image.url] : [],
  //             siteName: data.publisher ?? null,
  //             url: data.url ?? url,
  //             favicons: data.logo ? [data.logo.url] : [],
  //           },
  //         };
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Link preview fetch failed", err);
  //   } finally {
  //     setLoadingPreviews((prev) => ({ ...prev, [url]: false }));
  //   }
  // }, []);

  // useEffect(() => {
  //   urlsInText.forEach((url) => {
  //     fetchLinkPreview(url);
  //   });
  // }, [urlsInText, fetchLinkPreview]);
  //   useEffect(() => {
  //   urlsInText.forEach((url) => {
  //     if (!fetchedUrlsRef.current.has(url)) {
  //       fetchedUrlsRef.current.add(url);
  //       fetchLinkPreview(url);
  //     }
  //   });
  // }, [urlsInText, fetchLinkPreview]);

  return (
    <div className="top-area" onClick={openPost} style={{ cursor: "pointer" }}>
      {/* Profile Header */}
      <div className="profile-area d-center justify-content-between">
        <div
          className="avatar-item d-flex gap-3 align-items-center"
          onClick={(e) => openUserProfile(e, post.userId)}
          style={{ cursor: "pointer" }}
        >
          {/* <div className="avatar position-relative"> */}
          <div
            className={`avatar position-relative ${isOnline ? "online" : "not-online"}`}
          >
            {/* <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #f05a28",
              }}
            >
              <Image
                src={userAvt || "/images/default-avatar.png"}
                alt={name}
                width={50}
                height={50}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            </div> */}
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #f05a28",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: userAvt ? "transparent" : "#f05a28",
                color: "#fff",
                // fontSize: 20,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {userAvt ? (
                <Image
                  src={userAvt}
                  alt={name}
                  width={50}
                  height={50}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  priority
                />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>
          </div>
          <div className="info-area">
            <h6 className="m-0 d-flex align-items-baseline gap-2">
              {/* <Link href="/public-profile/post">{name}</Link> */}
              <span className="fw-bold">{name}</span>
              <span className="small">· {timeAgo(created_at)}</span>
            </h6>
            <span className="mdtxt status">@{userName}</span>
          </div>
        </div>
        <div
          className="btn-group cus-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <Ts_PostAction
            postUserId={post.userId}
            postId={post.postId}
            isFollowing={post.isFollowing}
            isSaved={post.isSaved}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* Post Text & Hashtags */}
      <div className="py-4">
        {mainText && (
          <div className="post-text">
            <p className="description">
              {showFullText
                ? mainText
                : mainText.slice(0, 100) + (mainText.length > 100 ? "..." : "")}
              {mainText.length > 100 && (
                <button
                  className="see-more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullText((prev) => !prev);
                  }}
                >
                  {showFullText ? "less" : "more"}
                </button>
              )}
            </p>
          </div>
        )}

        {urlsInText.map((url, idx) => (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-preview d-block rounded p-3 mb-2"
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #f05a28",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="small mb-1">
              {(() => {
                try {
                  return new URL(url).hostname;
                } catch {
                  return url;
                }
              })()}
            </p>
            <p className="description small">{url}</p>
          </a>
        ))}
        {/* {urlsInText.map((url, idx) => {
          const preview = linkPreviews[url];
          const isLoading = loadingPreviews[url];

          return (
            <div
              key={url} // Use URL as key
              className="link-preview rounded p-3 mb-2"
              // style={{ border: "1px solid #f05a28" }}
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading && (
                <p className="small text-muted">Loading preview…</p>
              )}

              {!isLoading && preview?.url && (
                <Link
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {preview.images?.length > 0 && (
                    <Image
                      src={preview.images[0]}
                      alt={preview.title ?? "Link preview"}
                      width={400}
                      height={200}
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  )}

                  <div className="mt-2">
                    <p className="fw-bold mb-1">
                      {preview.title ?? preview.siteName}
                    </p>
                    {preview.description && (
                      <p className="small">{preview.description}</p>
                    )}
                    <p className="small">
                      {preview.siteName ??
                        (() => {
                          try {
                            return new URL(url).hostname;
                          } catch {
                            return url;
                          }
                        })()}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          );
        })} */}

        {/* <p className="description">{postId}</p> */}
        {hashTags && (
          <p className="hastag d-flex gap-2">
            {hashTags?.map((tag) => (
              <Link key={tag} href="#">
                {tag}
              </Link>
            ))}
          </p>
        )}
      </div>

      {postImgs.length > 0 && (
        <div
          className={`post-media-container ${
            postImgs.length > 1 ? "clickable" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick();
          }}
        >
          <Image
            src={postImgs[currentImgIndex] || "/images/default-post.png"}
            alt={`Post Image ${currentImgIndex + 1}`}
            width={600}
            height={400}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
            onClick={(e) => openImageViewer(e, postImgs[currentImgIndex])}
          />
          {postImgs.length > 1 && (
            <div className="carousel-indicator">
              {currentImgIndex + 1} / {postImgs.length}
            </div>
          )}
        </div>
      )}

      {postVideos.length > 0 && (
        <div className="post-media-container">
          {postVideos.map((videoUrl, idx) => (
            <video key={idx} controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
      )}

      {/* {postPdfs.length > 0 && (
        <div className="pdf-container">
          {postPdfs.map((pdfUrl, idx) => (
            <div key={idx} className="pdf-item">
              <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <Image src={pdfUrl} alt="PDF" width={80} height={80} />
                <p>View PDF {postPdfs.length > 1 ? idx + 1 : ""}</p>
              </Link>
            </div>
          ))}
        </div>
      )} */}
      {postPdfs.length > 0 && (
        <div className="pdf-container">
          {postPdfs.map((pdfUrl, idx) => (
            <Ts_PdfCarousel key={idx} pdfUrl={pdfUrl} onOpen={openPdf} />
          ))}
        </div>
      )}

      {isImageOpen && activeImage && (
        <div
          className="image-viewer-overlay"
          onClick={() => setIsImageOpen(false)}
        >
          <div
            className="image-viewer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="Fullscreen image"
              fill
              style={{ objectFit: "contain" }}
            />

            <button
              className="image-close-btn"
              onClick={() => setIsImageOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ts_Post;
