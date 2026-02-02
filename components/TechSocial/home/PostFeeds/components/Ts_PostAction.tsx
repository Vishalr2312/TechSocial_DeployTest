import { useAppSelector } from "@/Redux/hooks";

interface Ts_PostActionProps {
  postUserId: number;
  postId: number;
  isFollowing?: boolean;
  onDelete: (commentId: number) => void;
}

const Ts_PostAction = ({
  postUserId,
  postId,
  isFollowing = false,
  onDelete,
}: Ts_PostActionProps) => {
  const currentUserId = useAppSelector((state) => state.user.user?.id);
  const isMyPost = currentUserId === postUserId;

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
                  if (
                    confirm("Are you sure you want to delete this post?")
                  ) {
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
                // onClick={handleFollowToggle}
              >
                <i className="material-symbols-outlined mat-icon">
                  {isFollowing ? "person_remove" : "person_add"}
                </i>
                <span>{isFollowing ? "Unfollow" : "Follow"}</span>
              </button>
            </li>

            <li>
              <button className="droplist d-flex align-items-center gap-2">
                <i className="material-symbols-outlined mat-icon">
                  bookmark_add
                </i>
                <span>Save Post</span>
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
