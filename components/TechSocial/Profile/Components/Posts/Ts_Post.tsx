import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Ts_PostAction from "./Ts_PostAction";

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
}

const Ts_Post = ({ post }: { post: Ts_PostProps }) => {
  const {
    postId,
    postText,
    userAvt,
    name,
    userName,
    hashTags,
    postImgs = [],
    postVideos = [],
    postPdfs = [],
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
            <h6 className="m-0">
              <Link href="/public-profile/post">{name}</Link>
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

      {postPdfs.length > 0 && (
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
      )}
    </div>
  );
};

export default Ts_Post;
