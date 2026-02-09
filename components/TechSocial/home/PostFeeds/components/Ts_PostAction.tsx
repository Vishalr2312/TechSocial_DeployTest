import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { toggleFollow, toggleSave } from "@/Redux/Reducers/PostFeeds/PostSlice";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";

interface FollowUnfollowApiResponse {
  status: number;
  message: string;
  data: [];
}

interface SaveUnsaveApiResponse {
  status: number;
  message: string;
  data: [];
}

interface Ts_PostActionProps {
  postUserId: number;
  postId: number;
  isFollowing?: boolean;
  isSaved?: boolean;
  onDelete: (commentId: number) => void;
}

const Ts_PostAction = ({
  postUserId,
  postId,
  isFollowing = false,
  isSaved = false,
  onDelete,
}: Ts_PostActionProps) => {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.user.user?.id);
  const isMyPost = currentUserId === postUserId;

  const followUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: "followers",
      METHOD: "POST",
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const unfollowUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: "followers/unfollow",
      METHOD: "POST", // change to DELETE if backend expects
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const handleFollowToggle = async () => {
    // 1️⃣ Optimistic update
    dispatch(toggleFollow(postUserId));

    try {
      if (isFollowing) {
        await unfollowUserApi(postUserId);
        toast.success("Unfollowed");
      } else {
        await followUserApi(postUserId);
        toast.success("Followed");
      }
    } catch (error: any) {
      // 2️⃣ Rollback on failure
      dispatch(toggleFollow(postUserId));
      toast.error(
        error?.response?.data?.message || "Failed to update follow status",
      );
    }
  };

  const savePostApi = (postId: number) => {
    return axiosCall<SaveUnsaveApiResponse>({
      ENDPOINT: "posts/save",
      METHOD: "POST",
      PAYLOAD: {
        post_id: postId,
      },
    });
  };

  const unsavePostApi = (postId: number) => {
    return axiosCall<SaveUnsaveApiResponse>({
      ENDPOINT: "posts/unsave",
      METHOD: "POST",
      PAYLOAD: {
        post_id: postId,
      },
    });
  };

  const handleSaveToggle = async () => {
    // 1️⃣ Optimistic update
    dispatch(toggleSave(postId));

    try {
      if (isSaved) {
        await unsavePostApi(postId);
        toast.success("Post unsaved");
      } else {
        await savePostApi(postId);
        toast.success("Post saved");
      }
    } catch (error: any) {
      // 2️⃣ Rollback on failure
      dispatch(toggleSave(postId));
      toast.error(
        error?.response?.data?.message || "Failed to update save status",
      );
    }
  };

  return (
    <>
      <button
        type="button"
        className="dropdown-btn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="material-symbols-outlined fs-xxl m-0">more_horiz</i>
      </button>
      <ul className="dropdown-menu p-4 pt-2">
        {/* <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">chat</i>
            <span>Message</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">person_add</i>
            <span>Follow</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">bookmark_add</i>
            <span>Save Post</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon"> block </i>
            <span>Block User</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon"> flag </i>
            <span>Report Post</span>
          </button>
        </li> */}
        {isMyPost ? (
          <>
            {/* 👑 OWN POST ACTIONS */}
            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                // onClick={handleEdit}
              >
                <i className="material-symbols-outlined mat-icon">edit</i>
                <span>Edit Post</span>
              </button>
            </li>

            <li>
              <button
                className="droplist d-flex align-items-center gap-2 text-danger"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this post?")) {
                    onDelete(postId);
                  }
                }}
              >
                <i className="material-symbols-outlined mat-icon">delete</i>
                <span>Delete Post</span>
              </button>
            </li>

            <li>
              <button className="droplist d-flex align-items-center gap-2 text-danger">
                <i className="material-symbols-outlined mat-icon">share</i>
                <span>Share Post</span>
              </button>
            </li>
          </>
        ) : (
          <>
            {/* 👥 OTHER USER POST ACTIONS */}
            <li>
              <button className="droplist d-flex align-items-center gap-2">
                <i className="material-symbols-outlined mat-icon">chat</i>
                <span>Message</span>
              </button>
            </li>

            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                onClick={handleFollowToggle}
              >
                <i className="material-symbols-outlined mat-icon">
                  {isFollowing ? "person_remove" : "person_add"}
                </i>
                <span>{isFollowing ? "Unfollow" : "Follow"}</span>
              </button>
            </li>

            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                onClick={handleSaveToggle}
              >
                <i className="material-symbols-outlined mat-icon">
                  {isSaved ? "bookmark_remove" : "bookmark_add"}
                </i>
                <span>{isSaved ? "Unsave Post" : "Save Post"}</span>
              </button>
            </li>

            <li>
              <button className="droplist d-flex align-items-center gap-2">
                <i className="material-symbols-outlined mat-icon">block</i>
                <span>Block User</span>
              </button>
            </li>

            <li>
              <button className="droplist d-flex align-items-center gap-2">
                <i className="material-symbols-outlined mat-icon">flag</i>
                <span>Report Post</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default Ts_PostAction;
