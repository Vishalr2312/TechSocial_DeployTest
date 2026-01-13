const Ts_PostAction = () => {
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
        </li> */}
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">edit</i>
            <span>Edit Post</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">delete</i>
            <span>Delete Post</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">share</i>
            <span>Share</span>
          </button>
        </li>
        {/* <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon"> flag </i>
            <span>Report Post</span>
          </button>
        </li> */}
      </ul>
    </>
  );
};

export default Ts_PostAction;
