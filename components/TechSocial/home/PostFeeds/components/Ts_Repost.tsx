import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Ts_PostAction from "./Ts_PostAction";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/Redux/hooks";
import { setSelectedPost } from "@/Redux/Reducers/PostFeeds/PostSlice";
import dynamic from "next/dynamic";
import Ts_PdfCarousel from "./Ts_PdfCarousel";

// const PdfCarousel = dynamic(() => import("./Ts_PdfCarousel"), { ssr: false });

interface Ts_RepostProps {
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
  repostedBy?: {
    name: string;
    username: string;
    avatar: string;
    comment?: string;
  };
  originalPost: {
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

interface Ts_RepostComponentProps {
  post: Ts_RepostProps;
  onDelete: (postId: number) => void;
}

const Ts_Repost = ({ post, onDelete }: Ts_RepostComponentProps) => {
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
    repostedBy,
    originalPost,
  } = post;

  // ✅ Image carousel state
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleImageClick = () => {
    if (postImgs.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % postImgs.length);
    }
  };

  const [showFullText, setShowFullText] = useState(false);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlsInText = originalPost?.text?.match(urlRegex) || [];
  const mainText = originalPost?.text?.replace(urlRegex, "").trim() || "";

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

  const videos = originalPost.videos ?? [];
  const pdfs = originalPost.pdfs ?? [];

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    // <div className="top-area" onClick={openPost} style={{ cursor: "pointer" }}>
    //   {/* Profile Header */}
    //   <div className="profile-area d-center justify-content-between">
    //     <div
    //       className="avatar-item d-flex gap-3 align-items-center"
    //       onClick={(e) => openUserProfile(e, post.userId)}
    //       style={{ cursor: "pointer" }}
    //     >
    //       <div className="avatar position-relative">
    //         {/* <div
    //           style={{
    //             width: 50,
    //             height: 50,
    //             borderRadius: "50%",
    //             overflow: "hidden",
    //             border: "1px solid #f05a28",
    //           }}
    //         >
    //           <Image
    //             src={userAvt || "/images/default-avatar.png"}
    //             alt={name}
    //             width={50}
    //             height={50}
    //             style={{ width: "100%", height: "100%", objectFit: "cover" }}
    //             priority
    //           />
    //         </div> */}
    //         <div
    //           style={{
    //             width: 50,
    //             height: 50,
    //             borderRadius: "50%",
    //             overflow: "hidden",
    //             border: "1px solid #f05a28",
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //             // backgroundColor: userAvt ? "transparent" : "#f05a28",
    //             color: "#fff",
    //             // fontSize: 20,
    //             fontWeight: 600,
    //             textTransform: "uppercase",
    //           }}
    //         >
    //           {userAvt ? (
    //             <Image
    //               src={userAvt}
    //               alt={name}
    //               width={50}
    //               height={50}
    //               style={{ width: "100%", height: "100%", objectFit: "cover" }}
    //               priority
    //             />
    //           ) : (
    //             <span>{firstLetter}</span>
    //           )}
    //         </div>
    //       </div>
    //       <div className="info-area">
    //         <h6 className="m-0 d-flex align-items-baseline gap-2">
    //           {/* <Link href="/public-profile/post">{name}</Link> */}
    //           <span className="fw-bold">{name}</span>
    //           <span className="small">· {timeAgo(created_at)}</span>
    //         </h6>
    //         <span className="mdtxt status">@{userName}</span>
    //       </div>
    //     </div>
    //     <div
    //       className="btn-group cus-dropdown"
    //       onClick={(e) => e.stopPropagation()}
    //     >
    //       <Ts_PostAction
    //         postUserId={post.userId}
    //         postId={post.postId}
    //         isFollowing={post.isFollowing}
    //       />
    //     </div>
    //   </div>

    //   {/* Post Text & Hashtags */}
    //   <div className="py-4">
    //     {mainText && (
    //       <div className="post-text">
    //         <p className="description">
    //           {showFullText
    //             ? mainText
    //             : mainText.slice(0, 100) + (mainText.length > 100 ? "..." : "")}
    //           {mainText.length > 100 && (
    //             <button
    //               className="see-more-btn"
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 setShowFullText((prev) => !prev);
    //               }}
    //             >
    //               {showFullText ? "less" : "more"}
    //             </button>
    //           )}
    //         </p>
    //       </div>
    //     )}

    //     {urlsInText.map((url, idx) => (
    //       <a
    //         key={idx}
    //         href={url}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="link-preview d-block rounded p-3 mb-2"
    //         style={{
    //           textDecoration: "none",
    //           color: "inherit",
    //           border: "1px solid #f05a28",
    //         }}
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <p className="small mb-1">
    //           {(() => {
    //             try {
    //               return new URL(url).hostname;
    //             } catch {
    //               return url;
    //             }
    //           })()}
    //         </p>
    //         <p className="description small">{url}</p>
    //       </a>
    //     ))}

    //     <p className="description">{postId}</p>
    //     {hashTags && (
    //       <p className="hastag d-flex gap-2">
    //         {hashTags?.map((tag) => (
    //           <Link key={tag} href="#">
    //             {tag}
    //           </Link>
    //         ))}
    //       </p>
    //     )}
    //   </div>

    //   {postImgs.length > 0 && (
    //     <div
    //       className={`post-media-container ${
    //         postImgs.length > 1 ? "clickable" : ""
    //       }`}
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         handleImageClick();
    //       }}
    //     >
    //       <Image
    //         src={postImgs[currentImgIndex] || "/images/default-post.png"}
    //         alt={`Post Image ${currentImgIndex + 1}`}
    //         width={600}
    //         height={400}
    //         style={{ objectFit: "contain", width: "100%", height: "auto" }}
    //         onClick={(e) => openImageViewer(e, postImgs[currentImgIndex])}
    //       />
    //       {postImgs.length > 1 && (
    //         <div className="carousel-indicator">
    //           {currentImgIndex + 1} / {postImgs.length}
    //         </div>
    //       )}
    //     </div>
    //   )}

    //   {postVideos.length > 0 && (
    //     <div className="post-media-container">
    //       {postVideos.map((videoUrl, idx) => (
    //         <video key={idx} controls>
    //           <source src={videoUrl} type="video/mp4" />
    //           Your browser does not support the video tag.
    //         </video>
    //       ))}
    //     </div>
    //   )}

    //   {/* {postPdfs.length > 0 && (
    //     <div className="pdf-container">
    //       {postPdfs.map((pdfUrl, idx) => (
    //         <div key={idx} className="pdf-item">
    //           <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
    //             <Image src={pdfUrl} alt="PDF" width={80} height={80} />
    //             <p>View PDF {postPdfs.length > 1 ? idx + 1 : ""}</p>
    //           </Link>
    //         </div>
    //       ))}
    //     </div>
    //   )} */}
    //   {postPdfs.length > 0 && (
    //     <div className="pdf-container">
    //       {postPdfs.map((pdfUrl, idx) => (
    //         <Ts_PdfCarousel key={idx} pdfUrl={pdfUrl} onOpen={openPdf} />
    //       ))}
    //     </div>
    //   )}

    //   {isImageOpen && activeImage && (
    //     <div
    //       className="image-viewer-overlay"
    //       onClick={() => setIsImageOpen(false)}
    //     >
    //       <div
    //         className="image-viewer-content"
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <Image
    //           src={activeImage}
    //           alt="Fullscreen image"
    //           fill
    //           style={{ objectFit: "contain" }}
    //         />

    //         <button
    //           className="image-close-btn"
    //           onClick={() => setIsImageOpen(false)}
    //         >
    //           ✕
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="top-area">
      {/* 🧑 Repost User Header */}
      {repostedBy && (
        <div className="profile-area d-center justify-content-between mb-3">
          <div className="avatar-item d-flex gap-3 align-items-center">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #f05a28",
              }}
            >
              <Image
                src={repostedBy.avatar || "/images/default-avatar.png"}
                alt={repostedBy.name}
                width={48}
                height={48}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="info-area">
              <h6 className="m-0 d-flex align-items-baseline gap-2">
                <Link href="/public-profile/post">{repostedBy.name}</Link>
                <span className="small">· {timeAgo(created_at)}</span>
              </h6>
              <span className="mdtxt status">@{repostedBy.username}</span>
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
              onDelete={onDelete}
            />
          </div>
        </div>
      )}

      {/* 🔁 Repost Header */}
      {repostedBy && (
        <div className="repost-header d-flex align-items-center gap-2 mt-2 text-muted ms-5 ps-9">
          {/* <span>🔁</span> */}
          <i className="material-symbols-outlined mat-icon">repeat</i>
          {/* <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              person{" "}
            </i>
          </button> */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid #f05a28",
            }}
          >
            <Image
              src={originalPost?.user.avatar || "/images/default-avatar.png"}
              alt={`avatar`}
              width={42}
              height={42}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span>
            <b>{originalPost?.user?.name}</b>
          </span>
        </div>
      )}

      {/* 💬 Repost Comment */}
      {repostedBy?.comment && <p className="mb-3">{repostedBy.comment}</p>}

      {/* 📦 Original Post Card */}
      <div className="original-post-wrapper ms-5 ps-9">
        <div className="original-post-card p-3 rounded">
          {/* Original User */}
          {/* <div className="d-flex gap-3 align-items-center mb-3">
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image
              src={originalPost?.user.avatar || "/images/default-avatar.png"}
              alt={`avatar`}
              width={42}
              height={42}
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="info-area">
            <h6 className="m-0">
              <Link href="/public-profile/post">{originalPost.user.name}</Link>
            </h6>
            <span className="mdtxt status">@{originalPost.user.username}</span>
          </div>
        </div> */}

          {/* Original Text */}
          {mainText && (
            <p className="description">
              {showFullText
                ? mainText
                : mainText.slice(0, 150) + (mainText.length > 150 ? "..." : "")}

              {mainText.length > 150 && (
                <button
                  className="see-more-btn"
                  onClick={() => setShowFullText((p) => !p)}
                >
                  {showFullText ? "less" : "more"}
                </button>
              )}
            </p>
          )}

          {/* Links */}
          {urlsInText.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-preview d-block rounded p-3 mb-2"
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

          {/* Images */}
          {originalPost.imgs.length > 0 && (
            <div
              className={`post-media-container ${
                originalPost.imgs.length > 1 ? "clickable" : ""
              }`}
              onClick={handleImageClick}
            >
              <Image
                src={
                  originalPost.imgs[currentImgIndex] ||
                  "/images/default-post.png"
                }
                alt="Post image"
                width={600}
                height={400}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                }}
              />
              {originalPost.imgs.length > 1 && (
                <div className="carousel-indicator">
                  {currentImgIndex + 1} / {originalPost.imgs.length}
                </div>
              )}
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="post-media-container">
              {videos.map((video, idx) => (
                <video key={idx} controls>
                  <source src={video} type="video/mp4" />
                </video>
              ))}
            </div>
          )}

          {/* PDFs */}
          {pdfs.length > 0 && (
            <div className="pdf-container">
              {pdfs.map((pdf, idx) => (
                <Link key={idx} href={pdf} target="_blank" className="pdf-item">
                  <div className="pdf-box">PDF</div>
                  <p>View PDF</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ts_Repost;
