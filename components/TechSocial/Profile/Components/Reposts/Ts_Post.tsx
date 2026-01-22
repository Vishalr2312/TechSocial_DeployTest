// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Ts_PostAction from "./Ts_PostAction";

// interface Ts_PostProps {
//   postId: number;
//   postText?: string;
//   hashTags?: string[];
//   postImgs: string[];
//   postVideos?: string[];
//   postPdfs?: string[];
//   name: string;
//   userName: string;
//   userAvt: string;
// }

// const Ts_Post = ({ post }: { post: Ts_PostProps }) => {
//   const {
//     postId,
//     postText,
//     userAvt,
//     name,
//     userName,
//     hashTags,
//     postImgs = [],
//     postVideos = [],
//     postPdfs = [],
//   } = post;

//   // ✅ Image carousel state
//   const [currentImgIndex, setCurrentImgIndex] = useState(0);

//   const handleImageClick = () => {
//     if (postImgs.length > 1) {
//       setCurrentImgIndex((prev) => (prev + 1) % postImgs.length);
//     }
//   };

//   const [showFullText, setShowFullText] = useState(false);

//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const urlsInText = postText?.match(urlRegex) || [];
//   const mainText = postText?.replace(urlRegex, "").trim() || "";

//   return (
//     <div className="top-area">
//       {/* Profile Header */}
//       <div className="profile-area d-center justify-content-between">
//         <div className="avatar-item d-flex gap-3 align-items-center">
//           <div className="avatar position-relative">
//             <div
//               style={{
//                 width: 50,
//                 height: 50,
//                 borderRadius: "50%",
//                 overflow: "hidden",
//                 border: "1px solid #f05a28",
//               }}
//             >
//               <Image
//                 src={userAvt || "/images/default-avatar.png"}
//                 alt={name}
//                 width={50}
//                 height={50}
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 priority
//               />
//             </div>
//           </div>
//           <div className="info-area">
//             <h6 className="m-0">
//               <Link href="/public-profile/post">{name}</Link>
//             </h6>
//             <span className="mdtxt status">@{userName}</span>
//           </div>
//         </div>
//         <div className="btn-group cus-dropdown">
//           <Ts_PostAction />
//         </div>
//       </div>

//       {/* Post Text & Hashtags */}
//       <div className="py-4">
//         {mainText && (
//           <div className="post-text">
//             <p className="description">
//               {showFullText
//                 ? mainText
//                 : mainText.slice(0, 100) + (mainText.length > 100 ? "..." : "")}
//               {mainText.length > 180 && (
//                 <button
//                   className="see-more-btn"
//                   onClick={() => setShowFullText((prev) => !prev)}
//                 >
//                   {showFullText ? "less" : "more"}
//                 </button>
//               )}
//             </p>
//           </div>
//         )}

//         {urlsInText.map((url, idx) => (
//           <a
//             key={idx}
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="link-preview d-block rounded p-3 mb-2"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//               border: "1px solid #f05a28",
//             }}
//           >
//             <p className="small mb-1">
//               {(() => {
//                 try {
//                   return new URL(url).hostname;
//                 } catch {
//                   return url;
//                 }
//               })()}
//             </p>
//             <p className="description small">{url}</p>
//           </a>
//         ))}

//         {/* <p className="description">{postId}</p> */}
//         {hashTags && (
//           <p className="hastag d-flex gap-2">
//             {hashTags?.map((tag) => (
//               <Link key={tag} href="#">
//                 {tag}
//               </Link>
//             ))}
//           </p>
//         )}
//       </div>

//       {postImgs.length > 0 && (
//         <div
//           className={`post-media-container ${
//             postImgs.length > 1 ? "clickable" : ""
//           }`}
//           onClick={handleImageClick}
//         >
//           <Image
//             src={postImgs[currentImgIndex] || "/images/default-post.png"}
//             alt={`Post Image ${currentImgIndex + 1}`}
//             width={600}
//             height={400}
//             style={{ objectFit: "contain", width: "100%", height: "auto" }}
//           />
//           {postImgs.length > 1 && (
//             <div className="carousel-indicator">
//               {currentImgIndex + 1} / {postImgs.length}
//             </div>
//           )}
//         </div>
//       )}

//       {postVideos.length > 0 && (
//         <div className="post-media-container">
//           {postVideos.map((videoUrl, idx) => (
//             <video key={idx} controls>
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ))}
//         </div>
//       )}

//       {postPdfs.length > 0 && (
//         <div className="pdf-container">
//           {postPdfs.map((pdfUrl, idx) => (
//             <div key={idx} className="pdf-item">
//               <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
//                 {/* <Image src={pdfUrl} alt="PDF" width={80} height={80} /> */}
//                 <div
//                   style={{
//                     width: 80,
//                     height: 80,
//                     border: "1px solid #f05a28",
//                     borderRadius: 8,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   PDF
//                 </div>
//                 <p>View PDF {postPdfs.length > 1 ? idx + 1 : ""}</p>
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Ts_Post;

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Ts_PostAction from "./Ts_PostAction";

interface Ts_PostProps {
  postId: number;

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
    // user: {
    //   name: string;
    //   username: string;
    //   avatar: string;
    // };
  };
}

const Ts_Post = ({ post }: { post: Ts_PostProps }) => {
  const { repostedBy, originalPost } = post;

  /* ---------------- TEXT HANDLING ---------------- */
  const [showFullText, setShowFullText] = useState(false);
  const text = originalPost.text || "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlsInText = text.match(urlRegex) || [];
  const mainText = text.replace(urlRegex, "").trim();

  /* ---------------- IMAGE CAROUSEL ---------------- */
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleImageClick = () => {
    if (originalPost.imgs.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % originalPost.imgs.length);
    }
  };

  const videos = originalPost.videos ?? [];
  const pdfs = originalPost.pdfs ?? [];

  return (
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
              <h6 className="m-0">
                <Link href="/public-profile/post">{repostedBy.name}</Link>
              </h6>
              <span className="mdtxt status">@{repostedBy.username}</span>
            </div>
          </div>

          <Ts_PostAction />
        </div>
      )}

      {/* 🔁 Repost Header */}
      {repostedBy && (
        <div className="repost-header d-flex align-items-center gap-2 mt-2 text-muted ms-5 ps-9">
          {/* <span>🔁</span> */}
          <i className="material-symbols-outlined mat-icon">repeat</i>
          <button className="d-center gap-1 gap-sm-2 mdtxt chat-btn">
            <i
              className="material-symbols-outlined mat-icon"
              style={{ fontSize: "20px" }}
            >
              {" "}
              person{" "}
            </i>
          </button>
          {/* <span>
            <b>{repostedBy.name}</b> reposted
          </span> */}
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
              src={"/images/default-avatar.png"}
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

export default Ts_Post;
