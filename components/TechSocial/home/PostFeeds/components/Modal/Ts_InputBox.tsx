import Image from "next/image";
import Link from "next/link";
import add_post_avatar from "/public/images/add-post-avatar.png";
import { useAppSelector } from "@/Redux/hooks";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { UserInterface } from "@/Type/User/SignInType";
import axiosCall from "@/Utils/TsAPIcall";

interface Ts_InputBoxProps {
  onSubmit: (text: string) => void;
  loading: boolean;
}

const Ts_InputBox = ({ onSubmit, loading }: Ts_InputBoxProps) => {
  const currentUser = useAppSelector((state) => state.user.user);
  const [comment, setComment] = useState("");
  //   const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      onSubmit(""); // allow empty repost if backend allows
    } else {
      onSubmit(comment);
    }

    setComment("");
  };

  return (
    <form action="#" onSubmit={handleSubmit}>
      <div className="d-flex mt-5 pb-5 gap-3">
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
            placeholder="Add your thoughts.."
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
            {/* <button
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
            </button> */}
          </div>
        </div>
        <div className="btn-area d-flex">
          <button type={"submit"} className="cmn-btn px-2 px-sm-5 px-lg-6">
            {/* <i className="material-symbols-outlined mat-icon m-0 fs-xxl">
              near_me
            </i> */}
            <h6>Repost</h6>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Ts_InputBox;
