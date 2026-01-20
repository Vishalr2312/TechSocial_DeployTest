import Image from "next/image";
import Link from "next/link";
import add_post_avatar from "/public/images/add-post-avatar.png";
import { useAppSelector } from "@/Redux/hooks";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { UserInterface } from "@/Type/User/SignInType";
import axiosCall from "@/Utils/TsAPIcall";

export interface AddCommentResponse {
  status: number;
  message: string;
  data: {
    id: number;
  };
}

interface CommentUser {
  id: number;
  name: string;
  username: string;
  image: string | null;
  picture: string | null;
  coverImageUrl: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  is_reported: number;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  userStory: string | null;
  profileCategoryName: string | null;
}

interface CommentItem {
  id: number;
  post_id: number;
  type: number;
  filename: string;
  comment: string;
  user_id: number;
  created_at: number;
  level: number;
  parent_id: number;
  filenameUrl: string | null;
  user?: CommentUser;
}

interface Ts_WriteCommentProps {
  postId: number;
  onCommentAdded: (comment: CommentItem) => void;
}

const Ts_WriteComment = ({ postId, onCommentAdded }: Ts_WriteCommentProps) => {
  const currentUser = useAppSelector((state) => state.user.user);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapUserToCommentUser = (u: UserInterface): CommentUser => ({
    id: u.id,
    name: u.name ?? "",
    username: u.username,
    image: u.image ?? null,
    picture: u.picture ?? null,
    coverImageUrl: u.coverImageUrl ?? null,
    is_chat_user_online: 0,
    chat_last_time_online: 0,
    location: null,
    latitude: null,
    longitude: null,
    is_reported: 0,
    is_like: 0,
    is_match: 0,
    profile_views: 0,
    isFollower: 0,
    isFollowing: 0,
    userStory: null,
    profileCategoryName: null,
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!currentUser) {
  //     toast.error("Please login to comment");
  //     return;
  //   }

  //   if (!comment.trim() && !selectedImage) {
  //     toast.error("Please add a comment or image");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const res = await axiosCall<AddCommentResponse>({
  //       ENDPOINT: "posts/add-comment",
  //       METHOD: "POST",
  //       PAYLOAD: {
  //         post_id: postId,
  //         comment: comment.trim(),
  //         type: 1,
  //       },
  //     });

  //     /** ✅ Optimistic comment */
  //     const newComment: CommentItem = {
  //       id: res.data.data.id,
  //       post_id: postId,
  //       type: 1,
  //       filename: "",
  //       comment: comment.trim(),
  //       user_id: currentUser.id,
  //       created_at: Math.floor(Date.now() / 1000),
  //       level: 1,
  //       parent_id: 0,
  //       filenameUrl: null,
  //       user: mapUserToCommentUser(currentUser),
  //     };

  //     onCommentAdded(newComment);
  //     setComment("");
  //     toast.success("Comment added");
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message || "Failed to add comment");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    if (!comment.trim() && !selectedImage) {
      toast.error("Please add a comment or image");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (selectedImage) {
        // 🖼 IMAGE COMMENT (type = 2)
        const formData = new FormData();
        formData.append("post_id", String(postId));
        formData.append("type", "2");
        formData.append("filename", selectedImage);

        res = await axiosCall<AddCommentResponse>({
          ENDPOINT: "posts/add-comment",
          METHOD: "POST",
          PAYLOAD: formData,
          // HEADERS: {
          //   "Content-Type": "multipart/form-data",
          // },
        });
      } else {
        // 📝 TEXT COMMENT (type = 1)
        res = await axiosCall<AddCommentResponse>({
          ENDPOINT: "posts/add-comment",
          METHOD: "POST",
          PAYLOAD: {
            post_id: postId,
            comment: comment.trim(),
            type: 1,
          },
        });
      }

      /** ✅ Optimistic UI */
      const newComment: CommentItem = {
        id: res.data.data.id,
        post_id: postId,
        type: selectedImage ? 2 : 1,
        filename: selectedImage ? selectedImage.name : "",
        comment: selectedImage ? "" : comment.trim(),
        user_id: currentUser.id,
        created_at: Math.floor(Date.now() / 1000),
        level: 1,
        parent_id: 0,
        filenameUrl: null,
        user: mapUserToCommentUser(currentUser),
      };

      onCommentAdded(newComment);

      // reset
      setComment("");
      setSelectedImage(null);
      toast.success("Comment added");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action="#" onSubmit={handleSubmit}>
      <div className="d-flex mt-5 gap-3">
        <div className="profile-box d-none d-xxl-block">
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid #f05a28",
            }}
          >
            {/* <Link href="#"> */}
              <Image
                src={currentUser?.picture || "/images/default-avatar.png"}
                height={50}
                width={50}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="avatar"
              />
            {/* </Link> */}
          </div>
        </div>
        <div className="form-content input-area py-1 d-flex gap-2 align-items-center w-100">
          <input
            placeholder="Write a comment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            // required
          />
          <div className="file-input d-flex gap-1 gap-md-2">
            {/* <div className="file-upload">
              <label className="file">
                <input type="file" required />
                <span className="file-custom border-0 d-grid text-center">
                  <span className="material-symbols-outlined mat-icon m-0 xxltxt">
                    gif_box
                  </span>
                </span>
              </label>
            </div>
            <div className="file-upload">
              <label className="file">
                <input type="file" required />
                <span className="file-custom border-0 d-grid text-center">
                  <span className="material-symbols-outlined mat-icon m-0 xxltxt">
                    perm_media
                  </span>
                </span>
              </label>
            </div> */}
            {/* <span className="mood-area">
              <span className="material-symbols-outlined mat-icon m-0 xxltxt">
                mood
              </span>
            </span> */}
            <button
              type="button"
              className="btn rounded-circle p-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
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
          </div>
        </div>
        <div className="btn-area d-flex">
          <button type={"submit"} className="cmn-btn px-2 px-sm-5 px-lg-6">
            {/* <i className="material-symbols-outlined mat-icon m-0 fs-xxl">
              near_me
            </i> */}
            <h6>Reply</h6>
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setSelectedImage(e.target.files[0]);
          }
        }}
      />
    </form>
  );
};

export default Ts_WriteComment;
