import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Ts_PostAction from "./Ts_PostAction";
import Ts_PdfCarousel from "../home/PostFeeds/components/Ts_PdfCarousel";

interface Ts_PostProps {
  postId: number;
  postText?: string;
  hashTags?: string[];
  postImgs: string[];
  postVideos?: string[];
  postPdfs?: string[];
  name: string;
  created_at: number;
  userName: string;
  userAvt: string;
}

const Ts_Post = ({ post }: { post: Ts_PostProps }) => {
  const {
    postId,
    postText,
    userAvt,
    name,
    created_at,
    userName,
    hashTags,
    postImgs = [],
    postVideos = [],
    postPdfs = [],
  } = post;

  // ✅ Image carousel state
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
  };

  const openPdf = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleImageClick = () => {
    if (postImgs.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % postImgs.length);
    }
  };

  const [showFullText, setShowFullText] = useState(false);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlsInText = postText?.match(urlRegex) || [];
  const mainText = postText?.replace(urlRegex, "").trim() || "";

  return (
    <div className="top-area">
      {/* Profile Header */}
      <div className="profile-area d-center justify-content-between">
        <div className="avatar-item d-flex gap-3 align-items-center">
          <div className="avatar position-relative">
            <div
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
            </div>
          </div>
          <div className="info-area">
            <h6 className="m-0 gap-2">
              {/* <Link href="/public-profile/post">{name}</Link> */}
              <span className="fw-bold">{name}</span>
              <span className="small">· {timeAgo(created_at)}</span>
            </h6>
            <span className="mdtxt status">@{userName}</span>
          </div>
        </div>
        <div className="btn-group cus-dropdown">
          <Ts_PostAction />
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
              {mainText.length > 180 && (
                <button
                  className="see-more-btn"
                  onClick={() => setShowFullText((prev) => !prev)}
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

        <p className="description">{postId}</p>
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
          onClick={handleImageClick}
        >
          <Image
            src={postImgs[currentImgIndex] || "/images/default-post.png"}
            alt={`Post Image ${currentImgIndex + 1}`}
            width={600}
            height={400}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
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
    </div>
  );
};

export default Ts_Post;
