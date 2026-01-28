"use client";

import Image from "next/image";
import Link from "next/link";
import ts_profile_avatar from "/public/images/add-post-avatar.png";
import React, { useRef, useState } from "react";
import Ts_Location_Modal from "./Modal/Ts_Location_Modal";
import { useAppSelector } from "@/Redux/hooks";
import axiosCall from "@/Utils/APIcall";

interface CreatePostResponse {
  status: number;
  message: string;
  data: {
    post_id: number;
  };
}

const PostInputs = () => {
  const currentUser = useAppSelector((state) => state.user.user);
  const [text, setText] = useState("");
  const [images, setimages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [gifs, setGifs] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  const MEDIA_TYPE = {
    IMAGE: "1",
    VIDEO: "2",
    PDF: "7",
    // GIF: "4",
  };

  const createPost = (title: string) => {
    if (!title.trim()) {
      throw new Error("Post title cannot be empty");
    }

    return axiosCall<CreatePostResponse>({
      ENDPOINT: "posts",
      METHOD: "POST",
      PAYLOAD: {
        type: "1", // PostType.basic
        title: title.trim(),
        gallary: [], // MUST be empty array
        post_content_type: "1", // PostContentType.text
        is_comment_enable: 1,
      },
    });
  };

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageButton = () => {
    imageInputRef.current?.click();
  };

  const handleDocumentButton = () => {
    documentInputRef.current?.click();
  };

  const handleGifButton = () => {
    gifInputRef.current?.click();
  };

  // Image/Video
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    // ❌ Prevent mixing file types
    if (documents.length > 0) {
      alert("You cannot upload images/videos when a PDF/document is selected.");
      e.target.value = "";
      return;
    }
    if (gifs.length > 0) {
      alert("You cannot upload images/videos when a GIF is selected.");
      e.target.value = "";
      return;
    }
    // ✅ Enforce 4-file limit
    if (images.length + selectedFiles.length > 4) {
      alert("You can upload up to 4 files only.");
      return;
    }

    setimages((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setimages((prev) => prev.filter((_, i) => i !== index));
  };

  // Pdf/Document
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    // ❌ Prevent mixing file types
    if (images.length > 0) {
      alert("You cannot upload documents when images/videos are selected.");
      e.target.value = "";
      return;
    }
    if (gifs.length > 0) {
      alert("You cannot upload documents when GIFs are selected.");
      e.target.value = "";
      return;
    }
    const totalFiles = documents.length + selectedFiles.length;
    if (totalFiles > 4) {
      alert("You can upload up to 4 documents only.");
      return;
    }

    setDocuments((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Gif
  const handleGifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const gifFiles = selectedFiles.filter((file) => file.type === "image/gif");
    if (gifFiles.length !== selectedFiles.length) {
      alert("Only GIF files are allowed.");
    }
    // ❌ Prevent mixing file types
    if (images.length > 0) {
      alert("You cannot upload GIFs when images/videos are selected.");
      e.target.value = "";
      return;
    }
    if (documents.length > 0) {
      alert("You cannot upload GIFs when documents are selected.");
      e.target.value = "";
      return;
    }
    const totalFiles = gifs.length + gifFiles.length;
    if (totalFiles > 4) {
      alert("You can upload up to 4 GIFs only.");
      return;
    }
    setGifs((prev) => [...prev, ...gifFiles]);
    e.target.value = "";
  };
  const handleRemoveGif = (index: number) => {
    setGifs((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!text.trim()) return;
    // console.log("User Post:", text);
    // if (location) {
    //   console.log("User Location:", location.lat, location.lon);
    // }
    // if (images.length > 0) {
    //   console.log("Selected Images/Videos:", images);
    // }
    // if (documents.length > 0) {
    //   console.log("Selected Pdfs/Documents:", documents);
    // }
    // if (gifs.length > 0) {
    //   console.log("Selected Gifs:", gifs);
    // }
    // setText("");
    // setimages([]);
    // setDocuments([]);
    // setGifs([]);
    try {
      const res = await createPost(text);

      if (res.data.data.post_id) {
        console.log("Post created:", res.data.data.post_id);
        setText("");
        window.location.pathname === "/";
      }

      setimages([]);
      setDocuments([]);
      setGifs([]);
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    }
  };
  return (
    <div className="share-post d-flex gap-3 gap-sm-5 p-3 p-sm-5">
      <div className="profile-box">
        <Link href="#">
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
              src={currentUser?.picture || ts_profile_avatar}
              width={50}
              height={50}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="icon"
            />
          </div>
        </Link>
      </div>
      <form action="#" className="w-100 position-relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-white border-0"
          style={{ resize: "none" }}
          cols={10}
          rows={1}
          placeholder="Write something to Lerio.."
        ></textarea>

        {/* Image/Video */}
        <div className="file-upload">
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp,video/*"
            ref={imageInputRef}
            onChange={handleFileChange}
          />
          {images.length > 0 && (
            <ul className="mt-2 text-white text-sm space-y-1 w-full">
              {images.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center w-full"
                >
                  <span className="truncate">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-4 text-red-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pdf/Document */}
        <div className="file-upload">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            ref={documentInputRef}
            onChange={handleDocumentChange}
          />
          {documents.length > 0 && (
            <ul className="mt-2 text-white text-sm space-y-1 w-full">
              {documents.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center w-full"
                >
                  <span className="truncate">
                    📄 {file.name} ({Math.round(file.size / 1024)} KB)
                  </span>
                  <button
                    onClick={() => handleRemoveDocument(index)}
                    className="ml-4 text-red-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gif */}
        <div className="file-upload">
          <input
            type="file"
            multiple
            accept=".gif"
            ref={gifInputRef}
            onChange={handleGifChange}
          />
          {gifs.length > 0 && (
            <ul className="mt-2 text-white text-sm space-y-1 w-full">
              {gifs.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center w-full"
                >
                  <span>🖼️ {file.name}</span>
                  <button
                    onClick={() => handleRemoveGif(index)}
                    className="ml-4 text-red-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* <div className="abs-area position-absolute d-none d-sm-block">
          <i className="material-symbols-outlined mat-icon xxltxt">
            sentiment_satisfied
          </i>
        </div> */}
        <ul className="d-flex flex-wrap mt-3 gap-5 w-100">
          <li
            className="d-flex align-items-center"
            // data-bs-toggle="modal"
            // data-bs-target="#goTsPhotoMod"
          >
            <button
              type="button"
              className="btn rounded-circle p-0"
              onClick={handleImageButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="22"
                height="22"
                fill="none"
                stroke="#f05a28"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="6" y="10" width="52" height="40" rx="6" ry="6" />
                <path d="M12 42l10-12 10 12 8-10 12 10" />

                <circle cx="20" cy="20" r="4" />
              </svg>
            </button>
            {/* <span>Live</span> */}
          </li>
          <li
            className="d-flex align-items-center"
            // data-bs-toggle="modal"
            // data-bs-target="#goTsPdfMod"
          >
            <button
              type="button"
              className="btn rounded-circle p-0"
              onClick={handleDocumentButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="22"
                height="22"
                fill="none"
                stroke="#f05a28"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 6h24l16 16v36H12z" />
                <path d="M36 6v16h16" />
                <path d="M18 28h28" />
                <path d="M18 36h28" />
                <path d="M18 44h20" />
              </svg>
            </button>
            {/* <span>Photo/Video</span> */}
          </li>
          <li
            className="d-flex align-items-center"
            // data-bs-toggle="modal"
            // data-bs-target="#goTsGifMod"
          >
            <button
              className="btn rounded-circle p-0"
              type="button"
              onClick={handleGifButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="22"
                height="22"
                fill="none"
                stroke="#f05a28"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="8" y="12" width="48" height="40" rx="6" ry="6" />
                <text
                  x="32"
                  y="40"
                  text-anchor="middle"
                  font-family="Arial, Helvetica, sans-serif"
                  font-weight="700"
                  font-size="18"
                  fill="#f05a28"
                  stroke="none"
                >
                  GIF
                </text>
              </svg>
            </button>
            {/* <span>Fallings/Activity</span> */}
          </li>
          <li
            className="d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#goTsPollMod"
          >
            <button className="btn rounded-circle p-0" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="22"
                height="22"
                fill="none"
                stroke="#f05a28"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="14" cy="20" r="2.5" fill="#f05a28" stroke="none" />
                <circle cx="14" cy="32" r="2.5" fill="#f05a28" stroke="none" />
                <circle cx="14" cy="44" r="2.5" fill="#f05a28" stroke="none" />
                <path d="M20 20h30" />
                <path d="M20 32h30" />
                <path d="M20 44h30" />
              </svg>
            </button>
            {/* <span>Fallings/Activity</span> */}
          </li>
          {/* <li
            className="d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#goTsLocationMod"
          >
            <button
              className="btn rounded-circle p-0"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="22"
                height="22"
                fill="none"
                stroke="#f05a28"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M32 4c8.8 0 16 7.2 16 16 0 11.2-16 32-16 32S16 31.2 16 20c0-8.8 7.2-16 16-16z" />
                <circle cx="32" cy="20" r="6" />
              </svg>
            </button>
            <Ts_Location_Modal />
          </li> */}
          <li
            className="d-flex align-items-center ms-auto"
            // data-bs-toggle="modal"
            // data-bs-target="#goTsLocationMod"
          >
            <button
              type="button"
              className="cmn-btn"
              disabled={!text.trim()}
              onClick={handlePost}
            >
              Post
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default PostInputs;
